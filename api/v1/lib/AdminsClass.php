<?php

if(!defined('BASE_CLASS_LOADED')) 
        include("./core/BaseClass.php");

class AdminsClass extends BaseClass
{
    protected $args = null;

    public function __construct($args)
    {
        $this->args = $args;
    }

    public function getAllAdmins($token){
        if (!isset($token))
            return $this->sendError(401, 'Access denied');

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

        try {
            $query = "SELECT username,type,name,comment FROM admins ORDER BY username;";
			$sth = $db->prepare($conn, $query);
			$sth->execute();
            $data = $sth->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            $this->sendError(500, "Error SQL:" . $e);
            return;
        }
    }

    public function addAdminDedicated($token, $domain, $adminData, $services) {
        if (!isset($token))
            return $this->sendError(401, 'Access denied - token');
        if (!isset($domain))
            return $this->sendError(401, 'Access denied - domain');            
        if (!isset($adminData))
            return $this->sendError(401, 'Access denied - adminData');
        if (!isset($services))
            return $this->sendError(401, 'Access denied - access');


        if ((!isset($adminData['name'])) || (!isset($adminData['username'])) || (!isset($adminData['password'])) )
            return $this->sendError(401, 'Access denied - admin');


        if ((!isset($domain['id_domain'])) || (!isset($domain['limit_admins'])) )
            return $this->sendError(401, 'Access denied - domain2');            

        $sess = new SessionController();
        $res = $sess->isAuthClient($token);
        if ($res == false)
            return $this->sendError(401, 'Access denied - wrong token');


        $db = new DB();
        $conn = $db->getConnection();
        if ($conn == null)
            return $this->sendError(501, $db->getLastError());

        $name = $adminData['name'];
        $username = $adminData['username'];
        $password = $adminData['password'];
        $domain_id = $domain['id_domain'];
        
        $query = '';

        try {
            $db->BeginTransaction($conn);
            $query = "INSERT INTO accounts (username,password,name,type) VALUES (:username, :password, :name, 'dedicated');";
 
            $sth = $db->prepare($conn, $query);
            $sth->bindValue(':username', $username, PDO::PARAM_STR);
            $sth->bindValue(':password', $password, PDO::PARAM_STR);
            $sth->bindValue(':name', $name, PDO::PARAM_STR);

            $sth->execute();

            $account_id = $db->GetLastInsertId($conn);

            $query = "INSERT INTO domain_accounts (domain_id, account_id, is_admin) VALUES (:domain_id,:account_id, 1);";
            $sth = $db->prepare($conn, $query);
            $sth->bindValue(':domain_id', $domain_id, PDO::PARAM_INT);
            $sth->bindValue(':account_id', $account_id, PDO::PARAM_INT);
            $sth->execute();


            $query_services = "INSERT INTO account_services (account_id, service_id) VALUES ";
            for ($i = 0; $i < count($services); $i++) {
                $service_id = $services[$i];
                $query_services .= '(' . $account_id . ',' . $service_id . ')';
                if ($i < count($services) - 1) {
                    $query_services .= ',';
                } else
                    $query_services .= ';';
            }            
           
            $sth2 = $db->prepare($conn, $query_services);
            $sth2->execute();

            $db->Commit($conn);

            $service = new ServicesClass(null);
            $service->runTriggerService('onRegisterUser', $account_id, $username);
        } catch (Exception $e) {
            $db->Rollback($conn);

            if (str_contains($e,'Duplicate entry'))
                $this->sendError(409, "Podana nazwa administratora jest już używana.");    
            else                
                $this->sendError(501, "Error SQL:" . $e);
            return;
        }


        

        return $this->sendResult(201, $adminData);
    }
}

?>