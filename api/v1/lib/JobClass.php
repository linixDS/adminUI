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

    private function insertRecord($db,$conn, $script, $args, $username, $desc){
        try {
            $query = "INSERT INTO `admin_panel`.`jobs_work` (`created`,`runscript`,`scriptargs`,`username`,`desc`) VALUES ";
            $query.= "(NOW(), ?, ?, ?, ?);";
			$sth = $db->prepare($conn, $query);
			$sth->execute([$script, $args, $username, $desc]);

        } catch (Exception $e) {
            $this->sendError(500, "Error SQL 2:" . $e->getMessage());
            return;
        }
    }  


    public function removeAccount($db,$conn, $accountName, $adminName){
        try {
            $names = explode('@',$accountName);
            $mailLocation = MAIL_PATH.'/'.$names[1].'/'.$names[0];
            $desc = "Remove account ".$accountName." from admin ".$adminName;
            $this->insertRecord($db, $conn, 'remove-mail', $mailLocation, $accountName, $desc);
        } catch (Exception $e) {
            $this->sendError(500, "Error SQL 1:" . $e);
            return;
        }
    }   

 


}

?>