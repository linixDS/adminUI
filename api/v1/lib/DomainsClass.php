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

        $cid = $sess->GetClientID();

        $db = new DB();
        $conn = $db->getConnection();
        if ($conn == null)
            return $this->sendError(501, $db->getLastError());

        try{
            if ($sess->IsGlobalAdmin()) {
                $query = "SELECT domain_id as id,name,client_id as client, created,limit_mails as mails FROM domains ORDER BY name;";
                $sth = $db->prepare($conn, $query);
                $sth->execute();
            } else {
                $query = "SELECT domain_id as id,name,client_id as client,created,limit_mails as mails FROM domains WHERE client_id=? ORDER BY name;";
                $sth = $db->prepare($conn, $query);
                $sth->execute([$cid]);
            }
    
            $data = $sth->fetchAll(PDO::FETCH_ASSOC);
            $result['domains'] = $data;
            return $this->sendResult(200, $result);

        } catch (Exception $e) {
            $this->sendError(501, "Error SQL:" . $e);
            return;
        }
    }

    public function getClientDomains($token, $client_id)
    {
        if (!isset($token))
            return $this->sendError(401, 'Access denied token');
        if (!isset($client_id))
            return $this->sendError(401, 'Access denied token');       

        $sess = new SessionController();
        $res = $sess->isAuthClient($token);
        if ($res == false)
            return $this->sendError(401, 'Access denied - wrong token');
        
        if (!$sess->IsGlobalAdmin())
            return $this->sendError(401, 'Access denied'); 

        $db = new DB();
        $conn = $db->getConnection();
        if ($conn == null)
            return $this->sendError(501, $db->getLastError());

        try{
            $query = "SELECT domain_id as id,name,client_id as client, created,limit_mails as mails FROM domains WHERE client_id=? ORDER BY name;";
            $sth = $db->prepare($conn, $query);
            $sth->execute([$client_id]);

    
            $data = $sth->fetchAll(PDO::FETCH_ASSOC);
            $result['domains'] = $data;
            return $this->sendResult(200, $result);

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



  
    public function addDomain($token, $domainData)
    {
        if (!isset($token))
            return $this->sendError(401, 'Access denied - token');
        if (!isset($domainData))
            return $this->sendError(401, 'Access denied - data');

        $domain = $domainData;

        if ((!isset($domain['name'])) || (!isset($domain['client'])) || (!isset($domain['mails'])) )
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

        $name = $domain['name'];
        $client = $domain['client'];
        $limit = $domain['mails'];

        $query = '';

        try {
            $db->BeginTransaction($conn);

            $query = "INSERT INTO domains (name,client_id,limit_mails) VALUES (:NAMEDOMAIN,:CLIENTID,:LIMIT1);";
            $sth = $db->prepare($conn, $query);

            $sth->bindValue(':NAMEDOMAIN', $name, PDO::PARAM_STR);
            $sth->bindValue(':CLIENTID', $client, PDO::PARAM_INT);
            $sth->bindValue(':LIMIT1', $limit, PDO::PARAM_INT);

            $sth->execute();

            $dir = MAIL_PATH.'/'.$name;
            if (!mkdir($dir)){
                $this->sendError(409, "Nie można utworzyć folderu dla domeny."); 
                return;
            }

            chmod($dir, 0770);
            chgrp($dir,'dovecot');

    
            $db->Commit($conn);

            $domain['created'] = date('Y-m-d H:i:s');
            $domain['dir'] = $dir;
            return $this->sendResult(201, $domain);            
        } catch (Exception $e) {
            $db->Rollback($conn);

            if (str_contains($e,'Duplicate entry'))
                $this->sendError(409, "Duplikacja nazwy domeny: Podana nazwa domeny została wcześniej wprowadzona.");    
            else                
                $this->sendError(501, "Error SQL:" . $e);
            return;
        }

    }

    public function updateDomain($token, $domainData)
    {
        if (!isset($token))
            return $this->sendError(401, 'Access denied - token 2a');
        if (!isset($domainData))
            return $this->sendError(401, 'Access denied - data');

        $domain = $domainData;

        if ( (!isset($domain['name'])) || (!isset($domain['mails'])) )
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

        $name = $domain['name'];
        $limit = $domain['mails'];

        $query = '';

        try {
            $db->BeginTransaction($conn);

            $query = "UPDATE domains SET limit_mails=? WHERE name=? LIMIT 1;";
            $sth = $db->prepare($conn, $query);

            $sth->execute([$limit, $name]);

            $db->Commit($conn);

            return $this->sendResult(201, $domain);            
        } catch (Exception $e) {
            $db->Rollback($conn);

            if (str_contains($e,'Duplicate entry'))
                $this->sendError(409, "Duplikacja nazwy domeny: Podana nazwa domeny została wcześniej wprowadzona.");    
            else                
                $this->sendError(501, "Error SQL:" . $e);
            return;
        }
    }

    public function deleteDomain($token, $domainData)
    {
        if (!isset($token))
            return $this->sendError(401, 'Access denied - token 2a');
        if (!isset($domainData))
            return $this->sendError(401, 'Access denied - data');

        $domain = $domainData;

        if ( (!isset($domain['name'])) || (!isset($domain['mails'])) )
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

        $name = $domain['name'];

        $query = '';

        try {
            $db->BeginTransaction($conn);

            $query = "DELETE FROM domains WHERE name=? LIMIT 1;";
            $sth = $db->prepare($conn, $query);

            $sth->execute([$name]);

            $db->Commit($conn);

            $dir = MAIL_PATH.'/'.$name;
            system("rm -rf ".escapeshellarg($dir));
            return $this->sendResult(201, $domain);            
        } catch (Exception $e) {
            $db->Rollback($conn);

            if (str_contains($e,'Duplicate entry'))
                $this->sendError(409, "Duplikacja nazwy domeny: Podana nazwa domeny została wcześniej wprowadzona.");    
            else                
                $this->sendError(501, "Error SQL:" . $e);
            return;
        }
    }    


}

?>
