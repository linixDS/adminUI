<?php

if(!defined('BASE_CLASS_LOADED')) 
        include("./core/BaseClass.php");

class AccountsClass extends BaseClass
{
    protected $args = null;

    public function __construct($args)
    {
        $this->args = $args;
    }

    

    public function getAccounts($token, $domain, $client){
        if (!isset($token))
            return $this->sendError(401, 'Access denied -token');
        if (!isset($domain))
            return $this->sendError(401, 'Access denied - domain');            

        $sess = new SessionController();
        $res = $sess->isAuthClient($token);
        if ($res == false)
            return $this->sendError(401, 'Access denied - wrong token');
        
        $db = new DB();
        $conn = $db->getConnection();
        if ($conn == null)
            return $this->sendError(501, $db->getLastError());

        try {
            if ($sess->IsGlobalAdmin())
                $cid = $client;
            else
                $cid = $sess->GetClientID();

            $query = "SELECT account_id as id,username,name,active,created FROM accounts WHERE domain_id=? AND client_id=? ORDER BY username;";
            $sth = $db->prepare($conn, $query);
            $sth->execute([$domain, $cid]);

            $data = $sth->fetchAll(PDO::FETCH_ASSOC);

            $result['accounts'] = $data;
            return $this->sendResult(200, $result);
        } catch (Exception $e) {
            $this->sendError(500, "Error SQL:" . $e);
            return;
        }
    }

    public function addAccount($token, $accountData, $services) {
        if (!isset($token))
            return $this->sendError(401, 'Access denied - token');
        if (!isset($accountData))
            return $this->sendError(401, 'Access denied - adminData');

        if ((!isset($accountData['name'])) || (!isset($accountData['password'])) || (!isset($accountData['client'])) ||
            (!isset($accountData['domain'])) || (!isset($accountData['username']))  )
            return $this->sendError(401, 'Nieprawidłowe zapytanie - data account');

        $sess = new SessionController();
        $res = $sess->isAuthClient($token);
        if ($res == false)
            return $this->sendError(401, 'Access denied - wrong token');


        $name = $accountData['name'];
        $username = $accountData['username'];
        $password = $accountData['password'];
        $client_id = $accountData['client'];
        $domain_id = $accountData['domain'];
           
        if (!$sess->IsGlobalAdmin()){
            $sess_client_id = $sess->GetClientID();
            if ($client_id != $sess_client_id)
                return $this->sendError(401, 'Access denied - access client id');
        }

        $db = new DB();
        $conn = $db->getConnection();
        if ($conn == null)
            return $this->sendError(501, $db->getLastError());


        $query = '';

        try {
            $db->BeginTransaction($conn);
            $query  = "INSERT INTO accounts (username,password,name,domain_id,client_id) VALUES ";
            $query .= "(:USERNAME, :PASSWORD, :NAME, :DOMAINID, :CLIENTID);";
 
            $sth = $db->prepare($conn, $query);
            $sth->bindValue(':USERNAME', $username, PDO::PARAM_STR);
            $sth->bindValue(':PASSWORD', $password, PDO::PARAM_STR);
            $sth->bindValue(':NAME', $name, PDO::PARAM_STR);
            $sth->bindValue(':DOMAINID', $domain_id, PDO::PARAM_INT);
            $sth->bindValue(':CLIENTID', $client_id, PDO::PARAM_INT);
            $sth->execute();

            $account_id = $db->GetLastInsertId($conn);

            $query = "INSERT INTO accounts_services (account_id,service_id) VALUES ";
            for ($i = 0; $i < count($services); $i++) {
                $service_id = $services[$i];
  
                $query .= '(' . $account_id . ',' . $service_id.')';
                if ($i < count($services) - 1) {
                    $query .= ',';
                } else
                    $query .= ';';
            }

            $sth2 = $db->prepare($conn, $query);
            $sth2->execute();
             

            $accountData['id'] = $account_id;            

            $db->Commit($conn);

            return $this->sendResult(201, $accountData);
        } catch (Exception $e) {
            $db->Rollback($conn);

            if (str_contains($e,'Duplicate entry'))
                $this->sendError(409, "Podana nazwa administratora jest już używana.");    
            else                
                $this->sendError(501, "Error SQL:" . $e);
            return;
        }
    }  

}

?>