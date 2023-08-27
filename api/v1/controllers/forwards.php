<?php

include("./core/BaseController.php");
include("./core/DB.php");
include("./core/Session.php");
include("./lib/ForwardsClass.php");

class Controller extends BaseController
{
	protected $data = null;	
	
	public function __construct(){
	}
	
	
	public function GET($args)
    {
		if (!isset($args['token']))
			return $this->SendError(401, 'Access denied 1'); 
		if (!isset($args['mail']))
			return $this->SendError(401, 'Access denied 2'); 			


		$class = new ForwardsClass(null);
		$class->getForwardsFromMail($args['token'], $args['mail']);
	}	
	
 	public function POST($args){
		if (!isset($args['token']))
			return $this->SendError(401, 'Access denied 1'); 
		if (!isset($args['forward']))
			return $this->SendError(401, 'Access denied 2'); 
		
		$class = new ForwardsClass(null);
		$class->addForward($args['token'], $args['forward']);			
	}

 	public function PUT($args){

	}

 	public function DELETE($args){
		if (!isset($args['token']))
			return $this->SendError(401, 'Access denied 1'); 
		if (!isset($args['forward']))
			return $this->SendError(401, 'Access denied 2'); 
		
		$class = new ForwardsClass(null);
		$class->removeForward($args['token'], $args['forward']);	
	}       
}


?>
