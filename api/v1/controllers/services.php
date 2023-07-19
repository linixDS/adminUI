<?php

include("./core/BaseController.php");
include("./core/DB.php");
include("./core/Session.php");

class Controller extends BaseController
{
	protected $data = null;	
	
	public function __construct(){
	}
	
	
	
	
	public function GET($args)
    {
        if (!isset($args['token']))
			return $this->SendError(401, 'Access denied'); 
        
        $sess = new SessionController();
        $res = $sess->isAuthClient($args['token']);
        if ($res == false)
            return $this->SendError(401, 'Access denied - wrong token'); 
        
		if (!$sess->IsGlobalAdmin())
			return $this->SendError(401, 'Access denied'); 
		
        $db = new DB();
        
        $conn = $db->getConnection();
        if ($conn == null)
            return $this->SendError(500, $db->getLastError()); 	
		
		$query = "SELECT id,name,description,com_checked,com_disabled FROM services WHERE ACTIVE=1 ORDER BY name;";
		$sth = $db->prepare($conn, $query);
		$sth->execute();

        $data = $sth->fetchAll(PDO::FETCH_ASSOC);	
		
        return $this->SendResult(200, $data); 
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
