<?php

include("./core/BaseController.php");
include("./core/DB.php");
include("./core/Session.php");
include("./lib/AdminsClass.php");
include("./lib/ClientsClass.php");

class Controller extends BaseController
{
	protected $data = null;	
	
	public function __construct(){
	}
	
	
	public function GET($args) {
                if (!isset($args['token']))
                        return $this->SendError(401, 'Access denied - token'); 
                     
                $class = new AdminsClass(null);
                if (!isset($args['client']))
                        $class->getAllAdmins($args['token']) ;
                else
                        $class->getCountAdmins($args['token'], $args['client']) ;
	}	
	
 	public function POST($args){
                if (!isset($args['token']))
                        return $this->SendError(400, 'Nieprawidłowe zapytanie - token'); 
                if (!isset($args['admin']))
                        return $this->SendError(400, 'Nieprawidłowe zapytanie - admin');
                    

                $class = new AdminsClass(null);
                $class->addAdmin($args['token'], $args['admin']) ;
	}

 	public function PUT($args){
                if (!isset($args['token']))
                        return $this->SendError(400, 'Nieprawidłowe zapytanie - token'); 
                if (!isset($args['admin']))
                        return $this->SendError(400, 'Nieprawidłowe zapytanie - admin');
                    

                $class = new AdminsClass(null);
                $class->updateAdmin($args['token'], $args['admin']) ;
	}

 	public function DELETE($args){
                if (!isset($args['token']))
                        return $this->SendError(400, 'Nieprawidłowe zapytanie - token'); 
                if (!isset($args['admin']))
                        return $this->SendError(400, 'Nieprawidłowe zapytanie - admin');
                    

                $class = new AdminsClass(null);
                $class->deleteAdmin($args['token'], $args['admin']) ;
	}       
}


?>
