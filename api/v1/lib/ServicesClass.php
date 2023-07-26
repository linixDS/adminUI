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
        for ($x=0; $x < count($table); $x++){
            if ($table[$x] == $id) return true;
        }

        return false;
    }

    public function getChangedServicesResultData($current, $new){
        $serviceNew = array();
        $serviceDelete = array();

            /* Sprawdzamy bieżące usługi
               jeśli w nowych usługach czegoś nie znajdziemy to należy usunąć usuługę
            */
        for ($x=0; $x < count($current); $x++){
            if (!isService($current[$x], $new)) {
                   array_push($serviceDelete, $current[$x]);
            }
        }

             /* Sprawdzamy nowe usługi
               jeśli w bieżacych usługach czegoś nie znajdziemy to należy dodać usuługę
            */
        for ($y=0; $y < count($new); $y++){
            if (!isService($new[$y], $current)) {
                   array_push($serviceNew, $new[$y]);
            }
        }

        $result = array();
        $result['add'] =  $serviceNew;
        $result['delete'] = $serviceDelete;

        return $result;
   }   


    public function getAdminServicesResultData($account) {
        $db = new DB();
        $conn = $db->getConnection();
        if ($conn == null)
            return null;

        try {
            $query = "SELECT id,onRegisterUser,onDeleteUser FROM services ";
            $query.= "WHERE id IN (SELECT service_id FROM account_services WHERE active=1 AND account_id=:ADMIN_ID);";

            $sth = $db->prepare($conn, $query);
            $sth->bindValue(':ADMIN_ID', $adminId, PDO::PARAM_INT);
            $sth->execute();

            return $sth->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
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
            $query = "SELECT id,name,description,com_checked,com_disabled FROM services WHERE ACTIVE=1 ORDER BY name;";
            $sth = $db->prepare($conn, $query);
            $sth->execute();
    
            $data = $sth->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            $this->sendError(500, "Error SQL:" . $e);
            return;
        }

        return $this->sendResult(200, $data);
    }

    public function getDomainServices($token, $domain)
    {
        if (!isset($token))
            return $this->sendError(401, 'Access denied - token');

        if (!isset($domain))
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
            $query = "SELECT service_id FROM domain_services WHERE active=1 AND domain_id=(SELECT id_domain FROM domains WHERE domain=:domainName LIMIT 1);";
            $sth = $db->prepare($conn, $query);
            $sth->bindValue(':domainName', $domain, PDO::PARAM_STR);
            $sth->execute();
    
            $data = $sth->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            $this->sendError(500, "Error SQL:" . $e);
            return;
        }

        return $this->sendResult(200, $data);
    }    
}

?>
