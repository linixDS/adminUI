<?php

include("./core/BaseController.php");
include("./core/DB.php");
include("./core/Session.php");

class Controller extends BaseController
{
	protected $data = null;	
	
	public function __construct(){
	}
	
	public function GET($args)
    {

        if (!isset($args['token']))
			return $this->SendError(401, 'Access denied 2'); 
        
        $sess = new SessionController();
        $res = $sess->isAuthClient($args['token']);

        if ($res == false)
            return $this->SendError(401, 'Access denied - wrong token'); 
        
   
        $result = $sess->GetUserInfo();
        return $this->SendResult(200, $result); 
	}	
	

    private function fail2ban($login, $address) {

            if(!defined('LOGGER_CLASS_LOADED')) 
                include("./lib/LoggerClient.php");
            $log = new LoggerClient();
            $log->saveFailedLog($login, $address);            

    }

 	public function POST($args){
        $sess = new SessionController();
        if ((!isset($args['username'])) || (!isset($args['password'])) ){
            $this->fail2ban('No argument', $sess->getUserIP());
            return $this->SendError(400, 'Bad request'); 
        }
			
        
        $db = new DB();
        
        $conn = $db->getConnection();
        if ($conn == null)
            return $this->SendError(500, $db->getLastError()); 
        
        $event = new EventClass(null);
        
        $query = "SELECT admin_id as id,name,username,type,client_id,mail FROM admins WHERE username=:username AND password=md5(:password);";
        $sth = $db->prepare($conn, $query);
        $sth->execute([':username' => $args['username'], 'password' => $args['password']]);
        $data = $sth->fetch(PDO::FETCH_ASSOC);

        
        $address = $sess->getUserIp();
        if (isset($args['address']))
            $address = $args['address'];

        if ($data == null) {
            $this->fail2ban($args['username'], $sess->getUserIP());
            $event->event_login_fail($db, $conn, $args['username'], "Address IP ".$address);
            return $this->SendError(401, 'Wrong password or username'); 
        }

        $query = "UPDATE admins SET last_login=NOW() WHERE admin_id=?;";
        $sth = $db->prepare($conn, $query);
        $id = $data['id'];
        $sth->execute([$id]);
        
        $id = $sess->createTokenSessionId($data, $address);
        $event->event_login_success($db, $conn, $args['username'], "Address IP ".$address);
        
        $result = array();
        $result['token'] = $id;
        $result['user'] = $data;
        
        return $this->SendResult(200, $result); 
        
	}

 	public function PUT($args){
        return $this->SendError(401, 'Access denied'); 
	}

 	public function DELETE($args){
        if (!isset($args['token']))
			return $this->SendError(400, 'Bad request - token is empty'); 
        
        $sess = new SessionController();
        $res = $sess->isAuthClient($args['token']);
        if ($res == false)
            return $this->SendError(401, 'Access denied - wrong token'); 

        $sess->destroyToken($args['token']);
        $result = array();
        $result['message'] = 'End session';
        $result['time'] = time();
        return $this->SendResult(200, $result); 
	}       
}


?>
