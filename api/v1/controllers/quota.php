<?php

include("./core/BaseController.php");
include("./core/DB.php");
include("./core/Session.php");
include("./lib/QuotaClass.php");

class Controller extends BaseController
{
	protected $data = null;	
	
	public function __construct(){
	}
	
	
	public function GET($args)
    {
        if (!isset($args['token']))
            return $this->sendError(401, 'Access denied -token');
        if (!isset($args['client']))
            return $this->sendError(401, 'Access denied - client');            

        $sess = new SessionController();
        $res = $sess->isAuthClient($args['token']);
        if ($res == false)
            return $this->sendError(401, 'Access denied - wrong token');
        
        $db = new DB();
        $conn = $db->getConnection();
        if ($conn == null)
            return $this->sendError(501, $db->getLastError());

        $class = new QuotaClass(null);
        $result['quota'] = $class->getQuota($db,$conn, $args['client']);
        return $this->sendResult(200, $result);
	}	
	
 	public function POST($args){
		return $this->SendError(401, 'Access denied'); 
	}

 	public function PUT($args){
        return $this->SendError(401, 'Access denied'); 
	}

 	public function DELETE($args){
		return $this->SendError(401, 'Access denied');
	}       
}

?>
