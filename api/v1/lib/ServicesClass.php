<?php

if(!defined('BASE_CLASS_LOADED')) 
    include("./core/BaseClass.php");


class ServicesClass extends BaseClass
{
    protected $args = null;

    public function __construct($args)
    {
        $this->args = $args;
    }


    private function isService($id, $table){
        foreach ($table as $value)
             if ($value['id'] == $id) return true;

        return false;
    }

    private function getCurrentService($id, $table){
        foreach ($table as $value){
              if ($value['id'] == $id) return $value;
        }
 
        return null;      
    }

    public function getChangedServicesResultData($current, $new){
            $serviceNew = array();
            $serviceDelete = array();
            $serviceUpdate = array();


            if (count($new) == 0){
                foreach ($current as $value) {
                    array_push($serviceDelete, $value);
                }                
            }
                else {
             /* Sprawdzamy bieżące usługi
                 jeśli w nowych usługach czegoś nie znajdziemy to należy usunąć usuługę
              */

                        foreach ($current as $value) {
                            if (!$this->isService($value['id'], $new)) 
                            array_push($serviceDelete, $value);
                        }
            

                        /* Sprawdzamy nowe usługi
                        jeśli w bieżacych usługach czegoś nie znajdziemy to należy dodać usuługę
                        */
                        foreach ($new as $value) {
                            if (!$this->isService($value['id'], $current)) 
                            array_push($serviceNew, $value);
                        }
            
            
                        
                        foreach ($new as $value) {
                            if (!isset($value['limit_accounts'])) break;

                            $curr = $this->getCurrentService($value['id'], $current);
                            if ($curr != null){
                            if ($curr['limit_accounts'] != $value['limit_accounts'])
                            array_push($serviceUpdate, $value);
                            }
                        }
                }

             $result = array();
             $result['add'] =  $serviceNew;
             $result['delete'] = $serviceDelete;
             $result['update'] = $serviceUpdate;

             return $result;
    }


    public function insertClientServiceFromData($conn, $db, $clientId, $service) {
        $service_id = $service['id'];
        $limit = $service['limit_accounts'];
        try {
            $query = "INSERT INTO clients_services(client_id, service_id, limit_accounts) VALUES (?,?,?);";
            $sth = $db->prepare($conn, $query);

            $sth->execute([$clientId, $service_id, $limit]);
            return true;
        } catch (Exception $e) {
            $this->exceptionWrite($e);
            
            $this->sendError(500, "Error SQL 222:" . $e->getMessage());
            return false;
        }
    }

    public function updateClientServiceFromData($conn, $db, $clientId, $service) {
        $service_id = $service['id'];
        $limit = $service['limit_accounts'];
        try {
            $query = "UPDATE clients_services SET limit_accounts=? WHERE client_id=? AND service_id=? LIMIT 1;";
            $sth = $db->prepare($conn, $query);

            $sth->execute([$limit, $clientId, $service_id]);
            return true;
        } catch (Exception $e) {
            $this->exceptionWrite($e);
            
            $this->sendError(500, "Error SQL 222:" . $e->getMessage());
            return false;
        }
    }
    
    public function removeClientServiceFromData($conn, $db, $clientId, $service) {
        $service_id = $service['id'];
        try {
            $query = "DELETE FROM clients_services WHERE client_id=? AND service_id=? LIMIT 1;";
            $sth = $db->prepare($conn, $query);

            $sth->execute([$clientId, $service_id]);
            return true;
        } catch (Exception $e) {
            $this->exceptionWrite($e);

            if (str_contains($e->getMessage(),'Cannot delete or update a parent'))
                $this->sendError(409, "Nie można wyłączyć usługi, ponieważ jest ona powiązana z kontem użytkownika."); 
            else
                $this->sendError(500, "Error SQL 222:" . $e->getMessage());

            return false;
        }
    }     

 


    public function getAdminServicesResultData($account) {
        $db = new DB();
        $conn = $db->getConnection();
        if ($conn == null)
            return null;

        try {
            $query = "SELECT service_id as id,onRegisterUser,onDeleteUser FROM services ";
            $query.= "WHERE id IN (SELECT service_id FROM account_services WHERE active=1 AND account_id=:ADMIN_ID);";

            $sth = $db->prepare($conn, $query);
            $sth->bindValue(':ADMIN_ID', $adminId, PDO::PARAM_INT);
            $sth->execute();

            return $sth->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            $this->sendError(500, "Error SQL 222:" . $e->getMessage());
            return null;
    }

    return $this->sendResult(200, $data);       
    }

    public function runService($command,$username) {
        shell_exec( $command . " '".$username."' > /dev/null 2>&1 &" );
    }

    public function runTriggerService($trigger, $userId, $username) {
        $result = $this->getAdminServicesResultData($userId);
        if ($result == null) return;
        if (count($result) == 0) return;
        try {
                for ($i=0; $i < count($result); $i++) {
                        if (isset($result[$trigger])) {
                            $command = $result[$trigger];

                            if ($command != null){
                                if (strlen($command) > 0) {
                                    if (file_exists($command)) {
                                        
                                        
                                        $this->runService($command, $username);
                                    }
                                }
                            }

                        }

                }

        } 
        catch (Exception $e) {
            return null;
        }
    }




    public function getAllServices($token)
    {
        if (!isset($token))
            return $this->sendError(401, 'Access denied - token');

        $sess = new SessionController();
        $res = $sess->isAuthClient($token);
        if ($res == false)
            return $this->sendError(401, 'Access denied - wrong token');           

        if (!$sess->IsGlobalAdmin())
            return $this->sendError(401, 'Access denied - global');

        $db = new DB();
        $conn = $db->getConnection();
        if ($conn == null)
            return $this->sendError(500, $db->getLastError());


        try {
            $query = "SELECT service_id as id,name,description,limit_accounts FROM services ORDER BY name;";
            $sth = $db->prepare($conn, $query);
            $sth->execute();
    
            $data = $sth->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            $this->sendError(500, "Error SQL:" . $e);
            return;
        }

        $result['services']= $data;
        return $this->sendResult(200, $result);
    }




    public function getClientServicesResultData($clientId)
    {
        $db = new DB();
        $conn = $db->getConnection();
        if ($conn == null)
            return $this->sendError(500, $db->getLastError());


        try {
            $query = "SELECT service_id as id,limit_accounts FROM clients_services WHERE client_id=:CLIENTID ORDER BY service_id";
            $sth = $db->prepare($conn, $query);
            $sth->bindValue(':CLIENTID', $clientId, PDO::PARAM_INT);
            $sth->execute();            
    
            $data = $sth->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            $this->sendError(500, "Error SQL:" . $e);
            return;
        }

        return $data;
    } 
    
    public function getAccountServicesResultData($accountId)
    {
        $db = new DB();
        $conn = $db->getConnection();
        if ($conn == null)
            return $this->sendError(500, $db->getLastError());


        try {
            $query = "SELECT service_id as id FROM accounts_services WHERE  account_id=? ORDER BY service_id";
            $sth = $db->prepare($conn, $query);
 
            $sth->execute([$accountId]);            
    
            $data = $sth->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            $this->sendError(500, "Error SQL:" . $e);
            return;
        }

        return $data;
    }      


    public function getClientServices($token,$clientId)
    {
        if (!isset($token))
            return $this->sendError(401, 'Access denied - token');

        $sess = new SessionController();
        $res = $sess->isAuthClient($token);
        if ($res == false)
            return $this->sendError(401, 'Access denied - wrong token');           

        if (!$sess->IsGlobalAdmin())
            return $this->sendError(401, 'Access denied - global');

        $db = new DB();
        $conn = $db->getConnection();
        if ($conn == null)
            return $this->sendError(500, $db->getLastError());


        try {
            $query = "SELECT service_id as id,limit_accounts FROM clients_services WHERE client_id=:CLIENTID ORDER BY service_id";
            $sth = $db->prepare($conn, $query);
            $sth->bindValue(':CLIENTID', $clientId, PDO::PARAM_INT);
            $sth->execute();            
    
            $data = $sth->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            $this->sendError(500, "Error SQL:" . $e);
            return;
        }

        $result['services']= $data;
        return $this->sendResult(200, $result);
    }    


    public function getCountClientServiceResultData($db, $conn, $client_id, $service_id){
        if (!isset($client_id))  return false;        
        if (!isset($service_id))  return false;  


        try {
            $query = "SELECT COUNT(*) as active_accounts FROM accounts_services WHERE service_id=? AND account_id IN ";
            $query.= "(SELECT account_id FROM accounts WHERE client_id=?);";
            $sth = $db->prepare($conn, $query);            
            $sth->execute([$service_id,$client_id]);
 
            $data = $sth->fetch(PDO::FETCH_ASSOC);
            return $data;
        } catch (Exception $e) {
            $this->exceptionWrite($e);
            return false;
        }
    } 
    
    public function getCountAllServiceResultData($db, $conn, $service_id){
        if (!isset($service_id))  return false;  

        try {
            $query = "SELECT COUNT(*) as active_accounts FROM accounts_services WHERE service_id=?;";
            $sth = $db->prepare($conn, $query);            
            $sth->execute([$service_id]);
 
            $data = $sth->fetch(PDO::FETCH_ASSOC);
            return $data;
        } catch (Exception $e) {
            $this->exceptionWrite($e);
            return false;
        }
    }     
    
    
    public function getAllServicesResultData($db, $conn)
    {
        if ($conn == null)
            return $this->sendError(500, $db->getLastError());


        try {
            $query = "SELECT service_id as id,name,description,limit_accounts FROM services ORDER BY service_id;";
            $sth = $db->prepare($conn, $query);
            $sth->execute();
    
            $data = $sth->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            return false;
        }

        return $data;
    }    

    public function getAccessAccountServices($token,$clientId)
    {
        if (!isset($token))
            return $this->sendError(401, 'Access denied - token');

        $sess = new SessionController();
        $res = $sess->isAuthClient($token);
        if ($res == false)
            return $this->sendError(401, 'Access denied - wrong token');           


        $db = new DB();
        $conn = $db->getConnection();
        if ($conn == null)
            return $this->sendError(500, $db->getLastError());


        try {
            $query  = "SELECT services.service_id as id,name,description, clients_services.limit_accounts FROM clients_services ";
            $query .= "LEFT JOIN services ON clients_services.service_id = services.service_id ";
            $query .= "WHERE clients_services.client_id=? ORDER BY name";
            $sth = $db->prepare($conn, $query);
            $sth->execute([$clientId]);            
    
            $data = $sth->fetchAll(PDO::FETCH_ASSOC);

            for ($i=0; $i < count($data); $i++){
                $service_id = $data[$i]['id'];
                $count = $this->getCountClientServiceResultData($db, $conn, $clientId, $service_id);
                if ($count != false)
                    $data[$i]['active_accounts'] = $count['active_accounts'];
                else    
                    $data[$i]['active_accounts'] = -1;
            }
        } catch (Exception $e) {
            $this->sendError(500, "Error SQL:" . $e);
            return;
        }

        $result['services']= $data;
        return $this->sendResult(200, $result);
    }    


    public function getAccountServices($token, $account)
    {
        if (!isset($token))
            return $this->sendError(401, 'Access denied - token');

        if (!isset($account))
            return $this->sendError(401, 'Access denied - token');

        $sess = new SessionController();
        $res = $sess->isAuthClient($token);
        if ($res == false)
            return $this->sendError(401, 'Access denied - wrong token');           

        $db = new DB();
        $conn = $db->getConnection();
        if ($conn == null)
            return $this->sendError(501, $db->getLastError());


        try {
            $query = "SELECT service_id as id FROM accounts_services WHERE account_id=?;";
            $sth = $db->prepare($conn, $query);
            $sth->execute([$account]);
    
            $data = $sth->fetchAll(PDO::FETCH_ASSOC);
            $result['services'] = $data;
            return $this->sendResult(200, $result);
        } catch (Exception $e) {
            $this->sendError(500, "Error SQL:" . $e);
            return;
        }
    }    

    public function insertAccountServiceFromData($conn, $db, $accountId, $service, $clientId) {
        $service_id = $service['id'];
        try {
            $query = "INSERT INTO accounts_services(account_id, service_id,client_id) VALUES (?,?,?);";
            $sth = $db->prepare($conn, $query);

            $sth->execute([$accountId, $service_id, $clientId]);
            return true;
        } catch (Exception $e) {
            $this->exceptionWrite($e);
            $this->sendError(500, "Error SQL:" . $e->getMessage());
            return false;
        }
    }

    
    public function removeAccountServiceFromData($conn, $db, $accountId, $service) {
        $service_id = $service['id'];
        try {
            $query = "DELETE FROM accounts_services WHERE account_id=? AND service_id=? LIMIT 1;";
            $sth = $db->prepare($conn, $query);

            $sth->execute([$accountId, $service_id]);
            return true;
        } catch (Exception $e) {
            $this->exceptionWrite($e);
            $this->sendError(500, "Error SQL:" . $e->getMessage());
            

            return false;
        }
    }   

}

?>
