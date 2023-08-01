<?php

include("./core/BaseController.php");
include("./core/DB.php");
include("./core/Session.php");
include("./lib/DomainsClass.php");

class Controller extends BaseController
{
	protected $data = null;	
	
	public function __construct(){
	}
	
	
	public function GET($args)
    {
		if (!isset($args['token']))
			return $this->SendError(401, 'Access denied'); 

		$class = new DomainsClass($args);
		$class->getDomains($args['token']);
	}	
	
 	public function POST($args){
        if (!isset($args['token']))
			return $this->SendError(401, 'Access denied - token'); 
        if (!isset($args['domain']))
			return $this->SendError(401, 'Access denied - data');
		

		$class = new DomainsClass($args);
		$class->addDomain( $args['token'], $args['domain']);
	}

 	public function PUT($args){
        if (!isset($args['token']))
			return $this->SendError(401, 'Access denied - token 2'); 
        if (!isset($args['domain']))
			return $this->SendError(401, 'Access denied - data 2');
		

		$class = new DomainsClass($args);
		$class->updateDomain( $args['token'], $args['domain']); 
	}

 	public function DELETE($args){
        if (!isset($args['token']))
			return $this->SendError(400, 'Access denied - token'); 
		if (!isset($args['domain']))
			return $this->SendError(400, 'Access denied - domain');		

		$class = new DomainsClass($args);
		$class->deleteDomain($args['token'], $args['domain']);
	}       
}


?>
