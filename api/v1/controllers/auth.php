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
	
 	public function POST($args){
        if ((!isset($args['username'])) || (!isset($args['password'])) )
			return $this->SendError(400, 'Bad request'); 
        
        $db = new DB();
        
        $conn = $db->getConnection();
        if ($conn == null)
            return $this->SendError(500, $db->getLastError()); 
        
        $query = "SELECT id_admin,name,username,type FROM admins WHERE username=:username AND password=md5(:password);";
        $sth = $db->prepare($conn, $query);
        $sth->execute([':username' => $args['username'], 'password' => $args['password']]);
        $data = $sth->fetch(PDO::FETCH_ASSOC);
        
        if ($data == null)
            return $this->SendError(401, 'Wrong password or username'); 
        
        $sess = new SessionController();
        $id = $sess->createTokenSessionId($data);
        
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
