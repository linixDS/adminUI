<?php

include("./core/BaseController.php");
include("./core/DB.php");
include("./core/Session.php");
include("./lib/MailsClass.php");

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

		$class = new MailsClass($args);
		$class->getMails($args['token'], $args['domain'], $args['client']);
	}	
	
 	public function POST($args){
	}

 	public function PUT($args){

	}

 	public function DELETE($args){

	}       
}


?>
