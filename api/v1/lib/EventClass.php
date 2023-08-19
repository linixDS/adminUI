<?php

if(!defined('BASE_CLASS_LOADED')) 
        include("./core/BaseClass.php");

class EventClass extends BaseClass
{
    protected $args = null;

    public function __construct($args)
    {
        $this->args = $args;
    }

    private function event2db($db,$conn, $event_type,$username,$event_desc){
        try {
            $query = "INSERT INTO `admin_panel`.`events_log` (`event_created`,`event_type`,`username`,`event_desc`) VALUES ";
            $query.= "(NOW(), ?, ?, ?);";
			$sth = $db->prepare($conn, $query);
			$sth->execute([$event_type,$username,$event_desc]);

        } catch (Exception $e) {
            $this->sendError(500, "Error SQL 2:" . $e->getMessage());
            return;
        }
    }
    //ENUM(  'addAccount', 'updateAccount', 'removeAccout', 'login', 'logout', 'fail-login')
    
    public function event_add_client($db,$conn, $username, $event_desc){
        $this->event2db($db,$conn, 'addClient', $username, $event_desc);
    }

    public function event_change_client($db,$conn, $username, $event_desc){
        $this->event2db($db,$conn, 'updateClient', $username, $event_desc);
    }
    
    public function event_delete_client($db,$conn, $username, $event_desc){
        $this->event2db($db,$conn, 'deleteClient', $username, $event_desc);
    }
    
    public function event_change_password($db,$conn, $username, $event_desc){
        $this->event2db($db,$conn, 'changePassword', $username, $event_desc);
    }
    
    public function event_add_domain($db,$conn, $username, $event_desc){
        $this->event2db($db,$conn, 'addDomain', $username, $event_desc);
    }

    public function event_delete_domain($db,$conn, $username, $event_desc){
        $this->event2db($db,$conn, 'deleteDomain', $username, $event_desc);
    }
    
    public function event_add_account($db,$conn, $username, $event_desc){
        $this->event2db($db,$conn, 'addAccount', $username, $event_desc);
    }

    public function event_change_account($db,$conn, $username, $event_desc){
        $this->event2db($db,$conn, 'updateAccount', $username, $event_desc);
    }
    
    public function event_delete_account($db,$conn, $username, $event_desc){
        $this->event2db($db,$conn, 'removeAccount', $username, $event_desc);
    }
    
    public function event_login_success($db,$conn, $username, $event_desc){
        $this->event2db($db,$conn, 'login', $username, $event_desc);
    }   
    public function event_login_fail($db,$conn, $username, $event_desc){
        $this->event2db($db,$conn, 'fail-login', $username, $event_desc);
    }       


}

?>