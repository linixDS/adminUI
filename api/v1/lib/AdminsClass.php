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


    private function getCountAdminsResultData($db, $conn, $client){
        if (!isset($client))
            return false;        

        $sess = new SessionController();


        try {
            if ($sess->IsGlobalAdmin()){
                $query = "SELECT COUNT(*) as active_admins FROM admins WHERE client_id=?;";
                $sth = $db->prepare($conn, $query);
                $sth->execute([$client]);
            }
            else {
                $cid = $sess->GetClientID();
                $query = "SELECT COUNT(*) as active_admins FROM admins WHERE client_id=?;";
                $sth = $db->prepare($conn, $query);
                $sth->execute([$cid]);
            }

            $data = $sth->fetch(PDO::FETCH_ASSOC);

            return $data;
        } catch (Exception $e) {
            return false;
        }
    } 

    public function getCountAdmins($token, $client){
        if (!isset($token))
            return $this->sendError(401, 'Access denied');

        if (!isset($client))
            return $this->sendError(401, 'Access denied');            

        $sess = new SessionController();
        $res = $sess->isAuthClient($token);
        if ($res == false)
            return $this->sendError(401, 'Access denied - wrong token');
        
        $db = new DB();
        $conn = $db->getConnection();
        if ($conn == null)
            return $this->sendError(501, $db->getLastError());

        try {
            if ($sess->IsGlobalAdmin()){
                $query = "SELECT COUNT(*) as active_admins FROM admins WHERE client_id=?;";
                $sth = $db->prepare($conn, $query);
                $sth->execute([$client]);
            }
            else {
                $cid = $sess->GetClientID();
                $query = "SELECT COUNT(*) as active_admins FROM admins WHERE client_id=?;";
                $sth = $db->prepare($conn, $query);
                $sth->execute([$cid]);
            }

            $data = $sth->fetch(PDO::FETCH_ASSOC);

            return $this->sendResult(200, $data);
        } catch (Exception $e) {
            $this->sendError(500, "Error SQL:" . $e);
            return;
        }
    }

    

    public function getAllAdmins($token){
        if (!isset($token))
            return $this->sendError(401, 'Access denied');

        $sess = new SessionController();
        $res = $sess->isAuthClient($token);
        if ($res == false)
            return $this->sendError(401, 'Access denied - wrong token');
        
        $db = new DB();
        $conn = $db->getConnection();
        if ($conn == null)
            return $this->sendError(501, $db->getLastError());

        try {
            if ($sess->IsGlobalAdmin()){
                $query = "SELECT username,client_id as client,type,name,created,mail FROM admins ORDER BY username;";
                $sth = $db->prepare($conn, $query);
                $sth->execute();
            }
            else {
                $cid = $sess->GetClientID();
                $query = "SELECT username,client_id as client,type,name,created,mail FROM admins WHERE client_id=? ORDER BY username;";
                $sth = $db->prepare($conn, $query);
                $sth->execute([$cid]);
            }

            $data = $sth->fetchAll(PDO::FETCH_ASSOC);

            $result['admins'] = $data;
            return $this->sendResult(200, $result);
        } catch (Exception $e) {
            $this->sendError(500, "Error SQL:" . $e);
            return;
        }
    }

    public function addAdmin($token, $adminData) {
        if (!isset($token))
            return $this->sendError(401, 'Access denied - token');
        if (!isset($adminData))
            return $this->sendError(401, 'Access denied - adminData');

        if ((!isset($adminData['name'])) || (!isset($adminData['username'])) || (!isset($adminData['type'])) ||
            (!isset($adminData['password'])) || (!isset($adminData['mail']))  )
            return $this->sendError(401, 'Nieprawidłowe zapytanie - data admin');

        if ( ($adminData['type'] != 'global') && (!isset($adminData['client'])) )
            return $this->sendError(401, 'Nieprawidłowe zapytanie - data admin client');

        $sess = new SessionController();
        $res = $sess->isAuthClient($token);
        if ($res == false)
            return $this->sendError(401, 'Access denied - wrong token');

        
        if ( (!$sess->IsGlobalAdmin()) && ($adminData['type'] == 'global') )
            return $this->sendError(401, 'Access denied - global');

        $db = new DB();
        $conn = $db->getConnection();
        if ($conn == null)
            return $this->sendError(501, $db->getLastError());


        $name = $adminData['name'];
        $username = $adminData['username'];
        $password = $adminData['password'];
        $client_id = $adminData['client'];
        $type = $adminData['type'];
        $mail = $adminData['mail'];
        
        if ($type != 'global'){
            $clientClass = new ClientsClass(null);
            $result = $clientClass->getLimitAdminsResultData($db, $conn, $client_id);
            if ($result == false)
                return $this->sendError(501, 'Błąd systemowy SQL - limit 1');
            
            $maxAdmins = $result['admins'];
    
            $result = $this->getCountAdminsResultData($db, $conn, $client_id);
            if ($result == false)
                return $this->sendError(501, 'Błąd systemowy SQL - limit 2');
    
            $currAdmins = $result['active_admins'];
    
            if ($currAdmins >= $maxAdmins)
                return $this->sendError(400, 'Limit kont dla administratorów został wykorzystany.');
        }

        $query = '';

        try {
            $db->BeginTransaction($conn);
            $query  = "INSERT INTO admins (username,password,name,type,mail,client_id) VALUES ";
            $query .= "(:USERNAME, :PASSWORD, :NAME, :ADMINTYPE, :MAIL, :CLIENTID);";
 
            $sth = $db->prepare($conn, $query);
            $sth->bindValue(':USERNAME', $username, PDO::PARAM_STR);
            $sth->bindValue(':PASSWORD', $password, PDO::PARAM_STR);
            $sth->bindValue(':NAME', $name, PDO::PARAM_STR);
            $sth->bindValue(':ADMINTYPE', $type, PDO::PARAM_STR);
            $sth->bindValue(':MAIL', $mail, PDO::PARAM_STR);
            $sth->bindValue(':CLIENTID', $client_id, PDO::PARAM_INT);

            $sth->execute();

            $db->Commit($conn);

            return $this->sendResult(201, $adminData);
        } catch (Exception $e) {
            $db->Rollback($conn);

            if (str_contains($e,'Duplicate entry'))
                $this->sendError(409, "Podana nazwa administratora jest już używana.");    
            else                
                $this->sendError(501, "Error SQL:" . $e);
            return;
        }
    }

    public function updateAdmin($token, $adminData) {
        if (!isset($token))
            return $this->sendError(401, 'Access denied - token');
        if (!isset($adminData))
            return $this->sendError(401, 'Access denied - adminData');

        if ((!isset($adminData['name'])) || (!isset($adminData['username'])) || (!isset($adminData['type'])) ||
            (!isset($adminData['mail']))  )
            return $this->sendError(401, 'Nieprawidłowe zapytanie - data admin');

        if ( ($adminData['type'] != 'global') && (!isset($adminData['client'])) )
            return $this->sendError(401, 'Nieprawidłowe zapytanie - data admin client');


        $sess = new SessionController();
        $res = $sess->isAuthClient($token);
        if ($res == false)
            return $this->sendError(401, 'Access denied - wrong token');

        
        if ( (!$sess->IsGlobalAdmin()) && ($adminData['type'] == 'global') )
            return $this->sendError(401, 'Access denied - global');

        if (isset($adminData['passowrd'])){
            $password = $adminData['password'];
            if (strlen($password) < 12)
                return $this->sendError(401, 'Access denied - incorrect value');
        }

        $db = new DB();
        $conn = $db->getConnection();
        if ($conn == null)
            return $this->sendError(501, $db->getLastError());

        $name = $adminData['name'];
        $username = $adminData['username'];
        $mail = $adminData['mail'];
       
        $query = '';

        try {
            $db->BeginTransaction($conn);
            
            if (isset($adminData['passowrd'])) {
                $query  = "UPDATE admins SET name=:NAME,mail=:MAIL,password=:PASSWORD WHERE username=:USERNAME LIMIT 1;";
            }
                else {
                    $query  = "UPDATE admins SET name=:NAME,mail=:MAIL WHERE username=:USERNAME LIMIT 1;";
                }

 
            $sth = $db->prepare($conn, $query);
            $sth->bindValue(':USERNAME', $username, PDO::PARAM_STR);
            $sth->bindValue(':NAME', $name, PDO::PARAM_STR);
            $sth->bindValue(':MAIL', $mail, PDO::PARAM_STR);
            if (isset($adminData['passowrd'])) 
                $sth->bindValue(':PASSWORD', $password, PDO::PARAM_STR);


            $sth->execute();


            $db->Commit($conn);

            return $this->sendResult(200, $adminData);
        } catch (Exception $e) {
            $db->Rollback($conn);

            if (str_contains($e,'Duplicate entry'))
                $this->sendError(409, "Podana nazwa administratora jest już używana.");    
            else                
                $this->sendError(501, "Error SQL:" . $e);
            return;
        }
    }    

    public function deleteAdmin($token, $adminData) {
        if (!isset($token))
            return $this->sendError(401, 'Access denied - token');
        if (!isset($adminData))
            return $this->sendError(401, 'Access denied - adminData');

        if ((!isset($adminData['name'])) || (!isset($adminData['username'])) || (!isset($adminData['type'])) ||
            (!isset($adminData['mail']))  )
            return $this->sendError(401, 'Nieprawidłowe zapytanie - data admin');


        $sess = new SessionController();
        $res = $sess->isAuthClient($token);
        if ($res == false)
            return $this->sendError(401, 'Access denied - wrong token');

        
        if ( (!$sess->IsGlobalAdmin()) && ($adminData['type'] == 'global') )
            return $this->sendError(401, 'Access denied - global');


        $db = new DB();
        $conn = $db->getConnection();
        if ($conn == null)
            return $this->sendError(501, $db->getLastError());

        $username = $adminData['username'];
      
        $query = '';

        try {
            $db->BeginTransaction($conn);
            
            $query  = "DELETE FROM admins WHERE username=:USERNAME LIMIT 1;";
 
            $sth = $db->prepare($conn, $query);
            $sth->bindValue(':USERNAME', $username, PDO::PARAM_STR);

            $sth->execute();

            $db->Commit($conn);

            return $this->sendResult(200, $adminData);
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