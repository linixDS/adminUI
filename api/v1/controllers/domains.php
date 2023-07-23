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

		if (!isset($args['domain']))
			$class->getDomains($args['token']);
		else
			$class->getDomain($args['token'], $args['domain'], true);
	}	
	
 	public function POST($args){
        if (!isset($args['token']))
			return $this->SendError(401, 'Access denied - token'); 
        if (!isset($args['data']))
			return $this->SendError(401, 'Access denied - data');
        if (!isset($args['services']))
			return $this->SendError(401, 'Access denied - access'); 		

		$class = new DomainsClass($args);
		$class->addDomain( $args['token'], $args['data'], $args['services'] );
	}

 	public function PUT($args){
        return $this->SendError(401, 'Access denied'); 
	}

 	public function DELETE($args){
        if (!isset($args['token']))
			return $this->SendError(400, 'Bad request - token is empty'); 
        

	}       
}


?>
