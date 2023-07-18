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
        
   
        $uid = $sess->GetAdminUID();
		if ($uid == -1)
			return $this->SendError(401, 'Access denied'); 
		
        $db = new DB();
        
        $conn = $db->getConnection();
        if ($conn == null)
            return $this->SendError(500, $db->getLastError()); 	
		
		if ($sess->IsGlobalAdmin()) {
			$query = "SELECT domain,comment,created FROM domains ORDER BY domain;";
			$sth = $db->prepare($conn, $query);
			$sth->execute();
		}
		else{
			$query = "SELECT domain,comment,created FROM domains WHERE id IN (SELECT domain_id FROM domain_admin WHERE admin_id=:uid) ORDER BY domain;";
			$sth = $db->prepare($conn, $query);
			$sth->execute([':uid' => $uid]);
		}
		
        $data = $sth->fetchAll(PDO::FETCH_ASSOC);	
		
        return $this->SendResult(200, $data); 
	}	
	
 	public function POST($args){

			return $this->SendError(400, 'Bad request'); 
        

        
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
