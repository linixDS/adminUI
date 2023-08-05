<?php

include("./core/BaseController.php");
include("./core/DB.php");
include("./core/Session.php");
include("./lib/ClientsClass.php");
include("./lib/ServicesClass.php");

class Controller extends BaseController
{
	protected $data = null;	
	
	public function __construct(){
	}
	
	
	public function GET($args)
    {
		if (!isset($args['token']))
		    return $this->SendError(401, 'Access denied'); 

		$class = new ClientsClass($args);
		if (!isset($args['client']))
    		$class->getClients($args['token']);
		else
			$class->getCurrentClient($args['token']);
	}	
	
 	public function POST($args){
		if (!isset($args['token']))
		    return $this->SendError(401, 'Access denied'); 
		if (!isset($args['client']))
		    return $this->SendError(401, 'Access denied'); 	
		if (!isset($args['services']))
		    return $this->SendError(401, 'Access denied'); 			
			
		$class = new ClientsClass($args);
		$class->addClient($args['token'], $args['client'], $args['services']);			
	}

 	public function PUT($args){
		if (!isset($args['token']))
		    return $this->SendError(401, 'Access denied'); 
		if (!isset($args['client']))
		    return $this->SendError(401, 'Access denied'); 	
		if (!isset($args['services']))
		    return $this->SendError(401, 'Access denied'); 			
			
		$class = new ClientsClass($args);
		$class->updateClient($args['token'], $args['client'], $args['services']);			

	}

 	public function DELETE($args){
		if (!isset($args['token']))
		    return $this->SendError(401, 'Access denied'); 
		if (!isset($args['client']))
		    return $this->SendError(401, 'Access denied'); 	
		
			
		$class = new ClientsClass($args);
		$class->deleteClient($args['token'], $args['client']);	
	}       
}


?>
