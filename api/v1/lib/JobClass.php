<?php

if(!defined('BASE_CLASS_LOADED')) 
        include("./core/BaseClass.php");

class JobClass extends BaseClass
{
    protected $args = null;

    public function __construct($args)
    {
        $this->args = $args;
    }

    private function insertRecord($db,$conn, $script, $args, $username, $desc, $now = true){
        try {
            $query = "INSERT INTO `admin_panel`.`jobs_work` (`startJob`,`runscript`,`scriptargs`,`username`,`desc`) VALUES ";
            if ($now)
                $query.= "(NOW(), ?, ?, ?, ?);";
            else
                $query.= "(DATE_ADD(NOW(), INTERVAL 48 HOUR), ?, ?, ?, ?);";
            
			$sth = $db->prepare($conn, $query);
			$sth->execute([$script, $args, $username, $desc]);

        } catch (Exception $e) {
            $this->sendError(500, "Error SQL 2:" . $e->getMessage());
            return;
        }
    }  

    private function deleteRecord($db,$conn, $username){
        try {
            $query = "DELETE FROM `admin_panel`.`jobs_work` WHERE username=?;";
			$sth = $db->prepare($conn, $query);
			$sth->execute([$username]);

        } catch (Exception $e) {
            $this->sendError(500, "Error SQL 2:" . $e->getMessage());
            return;
        }
    }  


    public function changeStructureDomain($db,$conn, $action, $domain){
        try {
            $desc = "Change struture domain(".$domain.") in service sogo";
            $argument = $action." ".$domain;
            $this->insertRecord($db, $conn, "config-domain.sh", $argument, "SYSTEM", $desc, false);
        } catch (Exception $e) {
            $this->sendError(500, "Error SQL 1:" . $e);
            return;
        }
    }  


    public function removeAccount($db,$conn, $accountName, $adminName){
        try {
            $names = explode('@',$accountName);
            $mailLocation = $names[1].'/'.$names[0];
            $desc = "Remove account ".$accountName." from admin ".$adminName;
            $this->insertRecord($db, $conn, 'remove-mail.sh', $mailLocation, $accountName, $desc, false);
        } catch (Exception $e) {
            $this->sendError(500, "Error SQL 1:" . $e);
            return;
        }
    }   

    public function cancelRemoveAccount($db,$conn, $accountName){
        try {
            $this->deleteRecord($db, $conn, $accountName);
        } catch (Exception $e) {
            $this->sendError(500, "Error SQL 1:" . $e);
            return;
        }
    }   

    public function reloadServiceSOGo($db,$conn, $adminName){
        try {
            $desc = "Reload service sogo from admin ".$adminName;
            $this->insertRecord($db, $conn, 'sogo-reload.sh', '', $adminName, $desc);
        } catch (Exception $e) {
            $this->sendError(500, "Error SQL 1:" . $e);
            return;
        }
    }       

}

?>