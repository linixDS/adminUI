<?php

include("./core/BaseController.php");
include("./core/DB.php");
include("./core/Session.php");
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
        
		$class = new ServicesClass($args);



		if (isset($args['client'])) {
			if (isset($args['account']))
				$class->getAccessAccountServices($args['token'], $args['client']);
			else
				$class->getClientServices($args['token'], $args['client']);
		}
		else{
			if (isset($args['account'])) 
				$class->getAccountServices($args['token'], $args['account']);
			else
				$class->getAllServices($args['token']);
		}

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
