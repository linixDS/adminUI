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

    public function getCountDomainsRaw($db, $conn)
    {
        if ( (!isset($db)) || (!isset($conn)) )
            return false;

        $sess = new SessionController();
        $cid = $sess->GetClientID();

        try{
            if ($sess->IsGlobalAdmin()) {
                $query = "SELECT COUNT(*) as domains FROM domains;";
                $sth = $db->prepare($conn, $query);
                $sth->execute();
            } else {
                $query = "SELECT COUNT(*) as domains FROM domains WHERE client_id=?;";
                $sth = $db->prepare($conn, $query);
                $sth->execute([$cid]);
            }
    
            $data = $sth->fetch(PDO::FETCH_ASSOC);

            $result['name'] = "domains";
            $result['desc'] = "Liczba zarejestrowanych domen";
            $result['value'] = $data['domains'];
            return $result;

        } catch (Exception $e) {
            return false;
        }
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
                $query = "SELECT domain_id as id,name,client_id as client, created FROM domains ORDER BY name;";
                $sth = $db->prepare($conn, $query);
                $sth->execute();
            } else {
                $query = "SELECT domain_id as id,name,client_id as client,created FROM domains WHERE client_id=? ORDER BY name;";
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
            $query = "SELECT domain_id as id,name,client_id as client, created FROM domains WHERE client_id=? ORDER BY name;";
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

        if ((!isset($domain['name'])) || (!isset($domain['client'])) )
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

        $query = '';

        try {
            $db->BeginTransaction($conn);

            $query = "INSERT INTO domains (name,client_id) VALUES (:NAMEDOMAIN,:CLIENTID);";
            $sth = $db->prepare($conn, $query);

            $sth->bindValue(':NAMEDOMAIN', $name, PDO::PARAM_STR);
            $sth->bindValue(':CLIENTID', $client, PDO::PARAM_INT);

            $sth->execute();


            $job = new JobClass(null);
            $job->changeStructureDomain($db, $conn, "add", $name);

            $event = new EventClass(null);
            $event->event_add_domain($db, $conn, $domainData['name'], "Add new domain from ".$sess->getUserName());            

            $db->Commit($conn);

            $domain['created'] = date('Y-m-d H:i:s');
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

        if (!isset($domainData['name']))
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

        $name = $domainData['name'];

        $query = '';

        try {
            $db->BeginTransaction($conn);

            $query = "DELETE FROM domains WHERE name=? LIMIT 1;";
            $sth = $db->prepare($conn, $query);

            $sth->execute([$name]);


            $job = new JobClass(null);
            $job->changeStructureDomain($db, $conn, "remove", $name);

            $event = new EventClass(null);
            $event->event_add_domain($db, $conn, $name, "Delete domain from ".$sess->getUserName());            


            $db->Commit($conn);

          
            return $this->sendResult(201, $domainData);            
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
