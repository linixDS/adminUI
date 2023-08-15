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


    private function LdapRemoveService($accountData, $service_name) {

        $dn = "uid=".$accountData['username'].",ou=users,dc=system,dc=local";

        $Entry = [
                    "objectClass" => ["inetOrgPerson", "organizationalPerson", "person", "top"],
                    "changetype" => 'modify',
                    "delete" => 'businessCategory',
                    "businessCategory" => $service_name,
        ];

        $ldap = new LdapClass(null);
        $res =  $ldap->addEntry($dn, $Entry);
    }

    private function LdapDeleteUser($accountData){
        $dn = "uid=".$accountData['username'].",ou=users,dc=system,dc=local";
        $ldap = new LdapClass(null);
        $res =  $ldap->delete($dn);
    }

    
    
    private function LdapEditUser($accountData, $services) {

        $convertName = Array("name" => "sn", "password" => "userPassword", "mail" => "mail");

        $username = $accountData['username'];
        $dn = "uid=".$username.",ou=users,dc=system,dc=local";

        if (isset($accountData['username']))   unset($accountData['username']);
        if (isset($accountData['id']))   unset($accountData['id']);        
        $ldapModifications = [];

        foreach ($accountData as $attribute => $value) {

            if (isset($convertName[$attribute])){
                $attribName = $convertName[$attribute];
                $attribValue = $value;

                $ldapModifications[] = [
                    'attrib' => $attribName,
                    'modtype' => LDAP_MODIFY_BATCH_REPLACE,
                    'values' => [$attribValue],
                ];
            }
        }

        $addListService = $services['add'];
        if (count($addListService) > 0){
            foreach ($addListService as $value) {
                    $add = [
                        'attrib' => 'businessCategory',
                        'modtype' => LDAP_MODIFY_BATCH_ADD,
                        'values' => [$value],
                    ];
                    array_push($ldapModifications, $add);

            } 
        }
        
        $delListService = $services['del'];
        if (count($delListService) > 0){
            foreach ($delListService as $value) {
                    $add = [
                        'attrib' => 'businessCategory',
                        'modtype' => LDAP_MODIFY_BATCH_REMOVE,
                        'values' => [$value],
                    ];
                    array_push($ldapModifications, $add);

            } 
        }           

        $ldap = new LdapClass(null);
        $res =  $ldap->modifyEntry($dn, $ldapModifications);
    }       

    private function LdapAdd($accountData, $services) {

        $dn = "uid=".$accountData['username'].",ou=users,dc=system,dc=local";

        if (count($services) > 0){
            $newEntry = [
                "objectClass" => ["inetOrgPerson", "organizationalPerson", "person", "top"],
                "uid" => $accountData['username'],
                "cn" => $accountData['username'],
                "sn" => $accountData['name'],
                "mail" => $accountData['mail'],
                "userPassword" => $accountData['password'],
                "businessCategory" => $services,
            ];

        }
            else {
                $newEntry = [
                    "objectClass" => ["inetOrgPerson", "organizationalPerson", "person", "top"],
                    "uid" => $accountData['username'],
                    "cn" => $accountData['username'],
                    "sn" => $accountData['name'],
                    "mail" => $accountData['mail'],
                    "userPassword" => $accountData['password'],
                ];                
            }


        $ldap = new LdapClass(null);
        $res =  $ldap->addEntry($dn, $newEntry);
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

            $query = "SELECT account_id as id,username,name,active,mail,created FROM accounts WHERE domain_id=? AND client_id=? ORDER BY username;";
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
            (!isset($accountData['domain'])) || (!isset($accountData['username'])) || (!isset($accountData['mail'])) )
            return $this->sendError(401, 'Nieprawidłowe zapytanie - data account');

        $sess = new SessionController();
        $res = $sess->isAuthClient($token);
        if ($res == false)
            return $this->sendError(401, 'Access denied - wrong token');


        $name = $accountData['name'];
        $username = $accountData['username'];
        $password = $accountData['password'];
        $mail = $accountData['mail'];
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


        $classService = new ServicesClass(null);            
        $allService = $classService->getAllServicesResultData($db, $conn);
        if ($allService == false)
            return $this->sendError(501, 'Błąd ładowania modułu Usług;');


        $serviceAdd = array();

        for ($i = 0; $i < count($services); $i++) {
            $service_id = $services[$i]['id'];
    
            $key = array_search($service_id, array_column($allService, 'id'));
            if ($key !== false) {
                $foundItem = $allService[$key];
                $service_name = $foundItem['name'];

                array_push($serviceAdd, $service_name);
            }
        }


        $query = '';

        try {
            $db->BeginTransaction($conn);
            $query  = "INSERT INTO accounts (username,password,name,mail,domain_id,client_id) VALUES ";
            $query .= "(:USERNAME, :PASSWORD, :NAME, :MAIL, :DOMAINID, :CLIENTID);";
 
            $sth = $db->prepare($conn, $query);
            $sth->bindValue(':USERNAME', $username, PDO::PARAM_STR);
            $sth->bindValue(':PASSWORD', $password, PDO::PARAM_STR);
            $sth->bindValue(':NAME', $name, PDO::PARAM_STR);
            $sth->bindValue(':MAIL', $mail, PDO::PARAM_STR);
            $sth->bindValue(':DOMAINID', $domain_id, PDO::PARAM_INT);
            $sth->bindValue(':CLIENTID', $client_id, PDO::PARAM_INT);
            $sth->execute();

            $account_id = $db->GetLastInsertId($conn);

            if (count($services) > 0){
                $query = "INSERT INTO accounts_services (account_id,service_id) VALUES ";
                for ($i = 0; $i < count($services); $i++) {
                    $service_id = $services[$i]['id'];
    
                    $query .= '(' . $account_id . ',' . $service_id.')';
                    if ($i < count($services) - 1) {
                        $query .= ',';
                    } else
                        $query .= ';';
                }

                $sth2 = $db->prepare($conn, $query);
                $sth2->execute();
            }
           
            $this->LdapAdd($accountData, $serviceAdd);


            $accountData['id'] = $account_id;
            $accountData['active'] = 1;            

            $db->Commit($conn);

            return $this->sendResult(201, $accountData);
        } catch (Exception $e) {
            $db->Rollback($conn);

            if (str_contains($e,'Duplicate entry'))
                $this->sendError(409, "Podana nazwa konta jest już używana.");    
            else                
                $this->sendError(501, "Error SQL:" . $e);
            return;
        }
    }  


    public function updateAccount($token, $accountData, $servicesData){
        if (!isset($token))
            return $this->sendError(401, 'Access denied - token');
        if (!isset($accountData))
            return $this->sendError(401, 'Access denied - data 1');  
        if (!isset($servicesData))
            return $this->sendError(401, 'Access denied - data 2');             
            
        $account = $accountData;
        $services = $servicesData;

        if ((!isset($account['name'])) || (!isset($account['username'])) || (!isset($account['id'])) || (!isset($account['client'])) )
            return $this->sendError(401, 'Access denied - account');

        if (isset($account['passowrd'])){
            $password = $account['password'];
            if (strlen($password) < 12)
                return $this->sendError(401, 'Access denied - incorrect value');
        }

        $sess = new SessionController();
        $res = $sess->isAuthClient($token);
        if ($res == false)
            return $this->sendError(401, 'Access denied - wrong token');


        $db = new DB();
        $conn = $db->getConnection();
        if ($conn == null)
            return $this->sendError(501, $db->getLastError());

        $classService = new ServicesClass(null);            
        $allService = $classService->getAllServicesResultData($db, $conn);
        if ($allService == false)
            return $this->sendError(501, 'Błąd ładowania modułu Usług;');

        $id = $account['id'];
        $name = $account['name'];
        $client = $account['client'];

        $query = '';

        try {
            $db->BeginTransaction($conn);

            $query = "UPDATE accounts SET name=:NAMEACCOUNT";
            if (isset($account['mail']))
                $query .= ",mail=:MAIL";
            if (isset($account['password']))
                $query .= ",password=:PASSWORD";
            
            $query .= " WHERE account_id=:ACCOUNTID LIMIT 1;";

            $sth = $db->prepare($conn, $query);

            $sth->bindValue(':NAMEACCOUNT', $name, PDO::PARAM_STR);
            $sth->bindValue(':ACCOUNTID', $id, PDO::PARAM_INT);
            if (isset($account['mail']))
                $sth->bindValue(':MAIL', $account['mail'], PDO::PARAM_STR);
            if (isset($passowrd))
                $sth->bindValue(':PASSWORD', $password, PDO::PARAM_STR);

            $sth->execute();
                        

            $classService = new ServicesClass(null);
            $currentServices = $classService->getAccountServicesResultData($id);
            $actions = $classService->getChangedServicesResultData($currentServices, $servicesData);
           
            $servicesAddName = [];
            $servicesDelName = [];

            if (count($actions['add']) > 0){
                    $values = $actions['add']; 
                    foreach ($values as $item) {
                        $key = array_search($item['id'], array_column($allService, 'id'));
                        if ($key !== false) {
                            $service_name = $allService[$key]['name'];
                            array_push($servicesAddName, $service_name);
                        }

                        $res = $classService->insertAccountServiceFromData($conn, $db, $id, $item);   
                    }
            }

            if (count($actions['delete']) > 0){
                    $values = $actions['delete']; 
                    foreach ($values as $item) {
                        $key = array_search($item['id'], array_column($allService, 'id'));
                        if ($key !== false) {
                            $service_name = $allService[$key]['name'];

                            array_push($servicesDelName, $service_name);
                        }                        
                        $res = $classService->removeAccountServiceFromData($conn, $db, $id, $item);   
                    }
            }                

            $serviceChange['add'] = $servicesAddName;
            $serviceChange['del'] = $servicesDelName;

            $this->LdapEditUser($account, $serviceChange);

            $db->Commit($conn);
            return $this->sendResult(200, $accountData);
        } catch (Exception $e) {
            $db->Rollback($conn);
           
            $this->sendError(501, "Error SQL:" . $e);
            return;
        }
    }
    
    public function deleteAccount($token, $accountData) {
        if (!isset($token))
            return $this->sendError(401, 'Access denied - token');
        if (!isset($accountData))
            return $this->sendError(401, 'Access denied - accountData');

        if ((!isset($accountData['id'])) || (!isset($accountData['username'])) || (!isset($accountData['client'])) )
            return $this->sendError(401, 'Nieprawidłowe zapytanie - data account');


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

        $username = $accountData['username'];
      
        $query = '';

        try {
            
            $query  = "DELETE FROM accounts WHERE username=:USERNAME LIMIT 1;";
 
            $sth = $db->prepare($conn, $query);
            $sth->bindValue(':USERNAME', $username, PDO::PARAM_STR);

            $sth->execute();


            $this->LdapDeleteUser($accountData);
            return $this->sendResult(200, $accountData);
        } catch (Exception $e) {
             if (str_contains($e,' Integrity constraint violation: 1451'))
                $this->sendError(409, "Nie można usunąc konta, ponieważ konto jest powiązane z usługami. Najpierw wyłącz wszystkie usługi.");    
            else                
                $this->sendError(501, "Error SQL:" . $e);
            return;
        }
    }      

}

?>