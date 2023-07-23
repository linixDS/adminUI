<?php

if(!defined('BASE_CLASS_LOADED')) 
        include("./core/BaseClass.php");



class DomainsClass extends BaseClass
{
    protected $args = null;
    protected $error = '';

    public function __construct($args)
    {
        $this->args = $args;
    }

    public function getDomains($token)
    {
        if (!isset($token))
            return $this->sendError(401, 'Access denied token');

        $sess = new SessionController();
        $res = $sess->isAuthClient($token);
        if ($res == false)
            return $this->sendError(401, 'Access denied - wrong token');

        $uid = $sess->GetAdminUID();
        if ($uid == -1)
            return $this->sendError(401, 'Access denied -Admin');

        $db = new DB();
        $conn = $db->getConnection();
        if ($conn == null)
            return $this->sendError(501, $db->getLastError());

        try{
            if ($sess->IsGlobalAdmin()) {
                $query = "SELECT domain,comment,created,limit_admins,limit_mails FROM domains ORDER BY domain;";
                $sth = $db->prepare($conn, $query);
                $sth->execute();
            } else {
                $query = "SELECT domain,comment,created,limit_admins,limit_mails FROM domains WHERE id IN (SELECT domain_id FROM domain_admin WHERE admin_id=:uid) ORDER BY domain;";
                $sth = $db->prepare($conn, $query);
                $sth->execute([':uid' => $uid]);
            }
    
            $data = $sth->fetchAll(PDO::FETCH_ASSOC);
            return $this->sendResult(200, $data);

        } catch (Exception $e) {
            $this->sendError(501, "Error SQL:" . $e);
            return;
        }
    }

    private function getError($code, $msg)
    {
        $result = array();
        $error = array();
        $error['message'] = 'Błąd (pobieranie informacji o domenie): '.$msg;
        $error['code'] = $code;

        $result['error'] = $error;
        return $result;
    }


    public function getAdminInDomain($token, $domainId)
    {
        $db = new DB();
        $conn = $db->getConnection();
        if ($conn == null) 
            return -1;

        try
        {
            $query = "SELECT COUNT(*) FROM domain_admins WHERE domain_id=:domainId LIMIT 1;";
            $sth = $db->prepare($conn, $query);
            $sth->bindValue(':domainId', $domainId, PDO::PARAM_INT);
            $sth->execute();
            $data = $sth->fetch();
            return $data[0];

        } 
        catch (Exception $e) 
        {
            return -1;
        }
    } 

    public function getDomain($token, $domain, $sendResponde = true)
    {
        if (!isset($token)) 
        {
            if ($sendResponde)
                return $this->sendError(401, 'Access denied - token');
            else
                return $this->getError(401, 'Access denied -token');
        }

        if (!isset($domain)) 
        {
            if ($sendResponde)
                return $this->sendError(401, 'Access denied - domain');            
            else
                return $this->getError(401, 'Access denied -domain');
        }

        $sess = new SessionController();
        $res = $sess->isAuthClient($token);
        if ($res == false) 
        {
            if ($sendResponde)
                return $this->sendError(401, 'Access denied - wrong token');
            else
                return $this->getError(401, 'Access denied -wrong token');
        }

  
        $db = new DB();
        $conn = $db->getConnection();
        if ($conn == null) 
        {
            if ($sendResponde)
                return $this->sendError(501, $db->getLastError());
            else
                return $this->getError(501, 'Baza');
        }

        try
        {
            $query = "SELECT id,domain,comment,created,limit_admins,limit_mails FROM domains WHERE domain=:name LIMIT 1;";
            $sth = $db->prepare($conn, $query);
            $sth->execute([':name' => $domain]);

            $count = $sth->rowCount();
            
            if ($count > 0)
            {
                $data = $sth->fetch();
                if ($sendResponde)
                    return $this->sendResult(200, $data);                
                else
                    return $data;
            }
                else 
                {
                    if ($sendResponde)
                        $this->sendError(501, "Nie znaleziono domeny.");
                    else
                        return  $this->getError(501, 'Nie znaleziono domeny.');
                }

        } 
        catch (Exception $e) 
        {
            if ($sendResponde)
                return $this->sendError(501, 'SQL: '.$e);
            else
                return $this->getError(501, 'SQL: '.$e);
        }
    }    


    public function addDomain($token, $domainData, $services)
    {
        if (!isset($token))
            return $this->sendError(401, 'Access denied - token');
        if (!isset($domainData))
            return $this->sendError(401, 'Access denied - data');
        if (!isset($services))
            return $this->sendError(401, 'Access denied - access');

        $domain = $domainData;

        if ((!isset($domain['domain'])) || (!isset($domain['comment'])) || (!isset($domain['limit_mails'])) || (!isset($domain['limit_admins'])))
            return $this->sendError(401, 'Access denied - domain');

        $sess = new SessionController();
        $res = $sess->isAuthClient($token);
        if ($res == false)
            return $this->sendError(401, 'Access denied - wrong token');

        $uid = $sess->GetAdminUID();
        if (!$sess->IsGlobalAdmin())
            return $this->sendError(401, 'Access denied - global');

        $db = new DB();
        $conn = $db->getConnection();
        if ($conn == null)
            return $this->sendError(501, $db->getLastError());

        $name = $domain['domain'];
        $comment = $domain['comment'];
        $limit_mails = $domain['limit_mails'];
        $limit_admins = $domain['limit_admins'];
        $query = '';

        try {
            $db->BeginTransaction($conn);
            $query = "INSERT INTO domains (domain,comment,limit_admins,limit_mails) VALUES (:domain,:comment,:limit_admins,:limit_mails);";
            $sth = $db->prepare($conn, $query);
            $sth->execute([':domain' => $name, ':comment' => $comment, ':limit_admins' => $limit_admins, ':limit_mails' => $limit_mails]);

            $domain_id = $db->GetLastInsertId($conn);

            $query = "INSERT INTO domain_services (domain_id,service_id) VALUES ";
            for ($i = 0; $i < count($services); $i++) {
                $service_id = $services[$i];
                $query .= '(' . $domain_id . ',' . $service_id . ')';
                if ($i < count($services) - 1) {
                    $query .= ',';
                } else
                    $query .= ';';
            }

            $sth2 = $db->prepare($conn, $query);
            $sth2->execute();

            $db->Commit($conn);
        } catch (Exception $e) {
            $db->Rollback($conn);

            if (str_contains($e,'Duplicate entry'))
                $this->sendError(409, "Duplikacja nazwy domeny: Podana nazwa domeny została wcześniej wprowadzona.");    
            else                
                $this->sendError(501, "Error SQL:" . $e);
            return;
        }

        return $this->sendResult(201, $domain);
    }

    public function updateDomain($args)
    {
        return $this->sendError(401, 'Access denied');
    }

    public function deleteDomain($token)
    {
        if (!isset($token))
            return $this->sendError(400, 'Bad request - token is empty');
    }


}

?>
