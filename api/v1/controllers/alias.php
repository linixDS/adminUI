<?php

include("./core/BaseController.php");
include("./core/DB.php");
include("./core/Session.php");
include("./lib/AliasClass.php");

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


		$class = new AliasClass(null);
		$class->getAliasFromMail($args['token'], $args['mail']);
	}	
	
 	public function POST($args){
		if (!isset($args['token']))
			return $this->SendError(401, 'Access denied 1'); 
		if (!isset($args['alias']))
			return $this->SendError(401, 'Access denied 2'); 
		
		$class = new AliasClass(null);
		$class->addAlias($args['token'], $args['alias']);			
	}

 	public function PUT($args){

	}

 	public function DELETE($args){
		if (!isset($args['token']))
			return $this->SendError(401, 'Access denied 1'); 
		if (!isset($args['alias']))
			return $this->SendError(401, 'Access denied 2'); 
		
		$class = new AliasClass(null);
		$class->removeAlias($args['token'], $args['alias']);	
	}       
}


?>
