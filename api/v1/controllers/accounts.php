<?php

include("./core/BaseController.php");
include("./core/DB.php");
include("./core/Session.php");
include("./lib/AccountsClass.php");
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
		if (!isset($args['domain']))
			return $this->SendError(401, 'Access denied'); 			
		if (!isset($args['client']))
			return $this->SendError(401, 'Access denied'); 

		$class = new AccountsClass($args);
		$class->getAccounts($args['token'], $args['domain'], $args['client']);
	}	
	
 	public function POST($args){
		if (!isset($args['token']))
			return $this->SendError(401, 'Access denied'); 
		if (!isset($args['account']))
			return $this->SendError(401, 'Access denied'); 			
		if (!isset($args['services']))
			return $this->SendError(401, 'Access denied'); 

		$class = new AccountsClass($args);
		$class->addAccount($args['token'], $args['account'], $args['services']);
	}

 	public function PUT($args){
		if (!isset($args['token']))
			return $this->SendError(401, 'Access denied'); 
		if (!isset($args['account']))
			return $this->SendError(401, 'Access denied'); 			
		if (!isset($args['services']))
			return $this->SendError(401, 'Access denied'); 

		$class = new AccountsClass($args);
		$class->updateAccount($args['token'], $args['account'], $args['services']);
	}

 	public function DELETE($args){
		if (!isset($args['token']))
			return $this->SendError(401, 'Access denied 1'); 
		if (!isset($args['account']))
			return $this->SendError(401, 'Access denied 2'); 			

		$class = new AccountsClass($args);
		$class->deleteAccount($args['token'], $args['account']);
	}       
}


?>
