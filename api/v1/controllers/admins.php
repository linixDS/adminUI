<?php

include("./core/BaseController.php");
include("./core/DB.php");
include("./core/Session.php");
include("./lib/ServicesClass.php");
include("./lib/DomainsClass.php");
include("./lib/AdminsClass.php");

class Controller extends BaseController
{
	protected $data = null;	
	
	public function __construct(){
	}
	
	
	public function GET($args) {

	}	
	
 	public function POST($args){
                if (!isset($args['token']))
                                return $this->SendError(401, 'Access denied - token'); 
                if (!isset($args['services']))
                                return $this->SendError(401, 'Access denied - services'); 
                if (!isset($args['admin']))
                                return $this->SendError(401, 'Access denied - admin');
                if (!isset($args['domain']))
                                return $this->SendError(401, 'Access denied - domain empty');                       

                $class = new DomainsClass(null);
                $ret = $class->getDomain($args['token'], $args['domain'], false);
                if (isset($ret['error']))
                        return $this->SendError(501, $ret); 

                $registerAdmins = $class->getAdminInDomain($args['token'], $ret['id_domain']);
                if ($registerAdmins == -1)
                        return $this->SendError(501, "Błąd w odczycie liczby administratorów przypisanych do domeny"); 
                if ($registerAdmins >= $ret['limit_admins'])
                        return $this->SendError(401, "Przekroczono dopuszczalną liczbę administratorów przypisanych do domeny."); 

                $classAdm = new AdminsClass(null);
                $classAdm->addAdminDedicated($args['token'], $ret, $args['admin'], $args['services']) ;
	}

 	public function PUT($args){
                return $this->SendError(401, 'Access denied'); 
	}

 	public function DELETE($args){

	}       
}


?>
