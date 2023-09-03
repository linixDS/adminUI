<?php

include("./core/BaseController.php");
include("./core/DB.php");
include("./core/Session.php");
include("./lib/JobClass.php");


class Controller extends BaseController
{
	protected $data = null;	
	
	public function __construct(){
	}
	
	
	public function GET($args)
    {
        return $this->SendError(401, 'Access denied'); 	
	}	
	
 	public function POST($args){
		if (!isset($args['token']))
		    return $this->SendError(401, 'Access denied'); 	

        $sess = new SessionController();
        $res = $sess->isAuthClient($args['token']);
        if ($res == false)
            return $this->sendError(401, 'Access denied - wrong token');

        if (!$sess->IsGlobalAdmin()){
            return $this->sendError(401, 'Access denied - Access only GlobalAdmin');
        }

      
        
            
		if (!isset($args['command']))
		    return $this->SendError(401, 'Access denied'); 			
			
        $service = $args['command'];
		if (!isset($service['name']))
		    return $this->SendError(401, 'Access denied - service 1'); 			
        if (!isset($service['action']))
		    return $this->SendError(401, 'Access denied - service 2'); 	       


        $method = "service_".$service['name'];
        if (!method_exists($this, $method))
            return $this->SendError(404, 'Method not found'); 	

        $this->$method($sess, $service['action']);
	}

 	public function PUT($args){
        return $this->SendError(401, 'Access denied'); 			

	}

 	public function DELETE($args){
	    return $this->SendError(401, 'Access denied'); 	
	}
    
    private function service_sogo($session, $action){
		if (!isset($action))
		    return $this->SendError(401, 'Access denied - service 3'); 	
        if ($action != "reload")
            return $this->SendError(404, 'Access denied - service 4'); 	



        $db = new DB();
        
        $conn = $db->getConnection();
        if ($conn == null)
            return $this->SendError(500, $db->getLastError()); 

        $class = new JobClass(null);
        $class->reloadServiceSOGo($db, $conn, $session->GetUserName());

        $service['name'] = "sogo";
        $service['action'] = $action;

        return $this->sendResult(201, $service);
    }
}


?>
