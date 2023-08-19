<?php

if(!defined('BASE_CLASS_LOADED')) 
        include("./core/BaseClass.php");

class ClientsClass extends BaseClass
{
    protected $args = null;

    public function __construct($args)
    {
        $this->args = $args;
    }

    public function getClients($token){
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
            $query = "SELECT clients.client_id as id,name,nip,city,mail,limit_admins as admins,IF(size>0,size div 1024,0) as quota FROM clients ";
            $query.= "LEFT JOIN clients_quota ON (clients_quota.client_id=clients.client_id) ORDER BY name;";
			$sth = $db->prepare($conn, $query);
			$sth->execute();
            $data = $sth->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            $this->sendError(500, "Error SQL:" . $e);
            return;
        }

        $result['clients'] = $data;
        return $this->sendResult(200, $result);
    }


    public function getLimitAdminsResultData($db,$conn,$client){
        try {
            $query = "SELECT limit_admins as admins FROM clients WHERE client_id=? LIMIT 1;";
			$sth = $db->prepare($conn, $query);
			$sth->execute([$client]);
            $data = $sth->fetch(PDO::FETCH_ASSOC);
            return $data;
        } catch (Exception $e) {
            return false;
        }
    }    

    public function getCurrentClient($token){
        if (!isset($token))
            return $this->sendError(401, 'Access denied');

        $sess = new SessionController();
        $res = $sess->isAuthClient($token);
        if ($res == false)
            return $this->sendError(401, 'Access denied - wrong token');
        
        $cid = $sess->GetClientID();

        $db = new DB();
        $conn = $db->getConnection();
        if ($conn == null)
            return $this->sendError(501, $db->getLastError());

        try {
            $query = "SELECT clients.client_id as id,name,nip,city,mail,limit_admins as admins,IF(size>0,size div 1024,0) as quota FROM clients ";
            $query.= "LEFT JOIN clients_quota ON (clients_quota.client_id=clients.client_id) WHERE client_id=? LIMIT 1;";
			$sth = $db->prepare($conn, $query);
			$sth->execute([$cid]);
            $data = $sth->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            $this->sendError(500, "Error SQL:" . $e);
            return;
        }

        $result['clients'] = $data;
        return $this->sendResult(201, $result);
    }    

    public function addClient($token, $clientData, $serviceData){
        if (!isset($token))
            return $this->sendError(401, 'Access denied - token');
        if (!isset($clientData))
            return $this->sendError(401, 'Access denied - data');  
        if (!isset($serviceData))
            return $this->sendError(401, 'Access denied - data');             
            
        $client = $clientData;
        $services = $serviceData;

        if ((!isset($client['name'])) || (!isset($client['nip'])) || (!isset($client['city'])) || 
            (!isset($client['mail'])) || (!isset($client['admins'])) || (!isset($client['quota'])))
            return $this->sendError(401, 'Access denied - client');

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

        $name = $client['name'];
        $nip = $client['nip'];
        $city = $client['city'];
        $mail = $client['mail'];
        $admins = $client['admins'];
        $quota = $client['quota'];

        $query = '';

        try {
            $db->BeginTransaction($conn);

            $query = "INSERT INTO clients (name,nip,city,mail,limit_admins) VALUES (:NAMECLIENT,:NIP,:CITY,:MAIL,:ADMINS);";
            $sth = $db->prepare($conn, $query);

            $sth->bindValue(':NAMECLIENT', $name, PDO::PARAM_STR);
            $sth->bindValue(':NIP', $nip, PDO::PARAM_STR);
            $sth->bindValue(':CITY', $city, PDO::PARAM_STR);
            $sth->bindValue(':MAIL', $mail, PDO::PARAM_STR);
            $sth->bindValue(':ADMINS', $admins, PDO::PARAM_INT);

            $sth->execute();

            $client_id = $db->GetLastInsertId($conn);
         
            if ($quota > 0){
                $quota = $quota * 1024;

                $query = "INSERT INTO clients_quota (client_id,size) VALUES (?,?);";
                $sth2 = $db->prepare($conn, $query);
                $sth2->execute([$client_id, $quota]);
            }


            $query = "INSERT INTO clients_services (client_id,service_id,limit_accounts) VALUES ";
            for ($i = 0; $i < count($services); $i++) {
                $service_id = $services[$i]['id'];
                $limits = $services[$i]['limit_accounts'];
 
                $query .= '(' . $client_id . ',' . $service_id . ',' . $limits . ')';
                if ($i < count($services) - 1) {
                    $query .= ',';
                } else
                    $query .= ';';
            }

            $sth2 = $db->prepare($conn, $query);
            $sth2->execute();
             
            $db->Commit($conn);

            $client['id'] = $client_id;

            return $this->sendResult(201, $client);
        } catch (Exception $e) {
            $db->Rollback($conn);

            if (str_contains($e,'Duplicate entry'))
                $this->sendError(409, "Duplikacja numeru NIP: Podanany numer NIP został wcześniej wprowadzony.");    
            else                
                $this->sendError(501, "Error SQL:" . $e);
            return;
        }
    }


    public function updateClient($token, $clientData, $servicesData){
        if (!isset($token))
            return $this->sendError(401, 'Access denied - token');
        if (!isset($clientData))
            return $this->sendError(401, 'Access denied - data');  
        if (!isset($servicesData))
            return $this->sendError(401, 'Access denied - data');             
            
        $client = $clientData;
        $services = $servicesData;

        if ((!isset($client['name'])) || (!isset($client['nip'])) || (!isset($client['city'])) || 
            (!isset($client['mail'])) || (!isset($client['admins'])) || (!isset($client['quota'])) )
            return $this->sendError(401, 'Access denied - client');

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

        $id = $client['id'];
        $name = $client['name'];
        $nip = $client['nip'];
        $city = $client['city'];
        $mail = $client['mail'];
        $admins = $client['admins'];
        $quota = $client['quota'];

        $query = '';

        try {
            $db->BeginTransaction($conn);

            $query = "UPDATE clients SET name=:NAMECLIENT,city=:CITY,mail=:MAIL,limit_admins=:ADMINS WHERE client_id=:CLIENTID";
            $sth = $db->prepare($conn, $query);

            $sth->bindValue(':NAMECLIENT', $name, PDO::PARAM_STR);
            $sth->bindValue(':CLIENTID', $id, PDO::PARAM_INT);
            $sth->bindValue(':CITY', $city, PDO::PARAM_STR);
            $sth->bindValue(':MAIL', $mail, PDO::PARAM_STR);
            $sth->bindValue(':ADMINS', $admins, PDO::PARAM_INT);

            $sth->execute();
            
            if ($quota > 0){
                $quota = $quota * 1024;

                $query = "UPDATE clients_quota SET size=? WHERE client_id=? LIMIT 1;";
                $sth = $db->prepare($conn, $query);
                $sth->execute([$quota, $id]);

                if ($sth->rowCount() == 0){
                    $query = "INSERT INTO clients_quota (client_id,size) VALUES (?,?);";
                    $sth = $db->prepare($conn, $query);
                    $sth->execute([$id,$quota]);
                }
            }            

            $classService = new ServicesClass(null);
            $currentServices = $classService->getClientServicesResultData($id);
            $actions = $classService->getChangedServicesResultData($currentServices, $servicesData);
                

            if (count($actions['add']) > 0){
                    $values = $actions['add']; 
                    foreach ($values as $item) {
                        $res = $classService->insertClientServiceFromData($conn, $db, $id, $item);   
                    }
            }

            if (count($actions['update']) > 0){
                    $values = $actions['update']; 
                    foreach ($values as $item) {
                        $res = $classService->updateClientServiceFromData($conn, $db, $id, $item);   
                    }
            }

            if (count($actions['delete']) > 0){
                    $values = $actions['delete']; 
                    foreach ($values as $item) {
                        $res = $classService->removeClientServiceFromData($conn, $db, $id, $item);   
                    }
            }                



            $db->Commit($conn);
            return $this->sendResult(200, $client);
        } catch (Exception $e) {
            $db->Rollback($conn);
           
            $this->sendError(501, "Error SQL:" . $e);
            return;
        }
    }


    public function deleteClient($token, $clientData){
        if (!isset($token))
            return $this->sendError(401, 'Access denied - token');
        if (!isset($clientData))
            return $this->sendError(401, 'Access denied - data');  
           

        $client = $clientData;
  
        if ((!isset($client['name'])) || (!isset($client['nip'])) || (!isset($client['city'])) || (!isset($client['mail'])))
            return $this->sendError(401, 'Access denied - client');

        if (strlen($client['nip']) < 10)
            return $this->sendError(401, 'Access denied - NIP');
    

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

        $query = '';
        $nip = $client['nip'];
        try {
            $db->BeginTransaction($conn);

            $query = "DELETE FROM clients_quota WHERE client_id IN (SELECT client_id FROM clients WHERE nip=?);";
            $sth = $db->prepare($conn, $query);
            $sth->execute([$nip]);    

            $query = "DELETE FROM clients WHERE nip=? LIMIT 1;";
            $sth = $db->prepare($conn, $query);
            $sth->execute([$nip]);

            $db->Commit($conn);
            return $this->sendResult(200, $clientData);
        } catch (Exception $e) {
            $db->Rollback($conn);

            if (str_contains($e,'Integrity constraint violation: 1451'))
                $this->sendError(409, "Nie można usunąc kontrahenta. Kontrahent powiązany jest z usługami,kontami itp.");    
            else                
                $this->sendError(501, "Error SQL:" . $e);
           
            $this->sendError(501, "Error SQL:" . $e);
            return;
        }
    }    


}

?>