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
			$query = "SELECT domain,comment,created,limit_admins,limit_mails FROM domains ORDER BY domain;";
			$sth = $db->prepare($conn, $query);
			$sth->execute();
		}
		else{
			$query = "SELECT domain,comment,created,limit_admins,limit_mails FROM domains WHERE id IN (SELECT domain_id FROM domain_admin WHERE admin_id=:uid) ORDER BY domain;";
			$sth = $db->prepare($conn, $query);
			$sth->execute([':uid' => $uid]);
		}
		
        $data = $sth->fetchAll(PDO::FETCH_ASSOC);	
		
        return $this->SendResult(200, $data); 
	}	
	
 	public function POST($args){
        if (!isset($args['token']))
			return $this->SendError(401, 'Access denied - token'); 
        if (!isset($args['data']))
			return $this->SendError(401, 'Access denied - data');
        if (!isset($args['access']))
			return $this->SendError(401, 'Access denied - access'); 		
		
		$domain = $args['data'];
		if ( (!isset($domain['domain'])) || (!isset($domain['comment'])) || (!isset($domain['limit_mails'])) || (!isset($domain['limit_admins'])) )
			return $this->SendError(401, 'Access denied - domain'); 
		
		$access = json_encode($args['access']);
		
        $sess = new SessionController();
        $res = $sess->isAuthClient($args['token']);
        if ($res == false)
            return $this->SendError(401, 'Access denied - wrong token'); 
		
        $uid = $sess->GetAdminUID();
		if (!$sess->IsGlobalAdmin())
			return $this->SendError(401, 'Access denied - global'); 

		$db = new DB();
        $conn = $db->getConnection();
        if ($conn == null)
            return $this->SendError(500, $db->getLastError()); 			
		
		$name = $domain['domain'];
		$comment = $domain['comment'];
		$limit_mails = $domain['limit_mails'];
		$limit_admins = $domain['limit_admins'];
		try{
			$query = "INSERT INTO domains (domain,comment,created,limit_admins,limit_mails) VALUES (:domain,:comment,NOW(),:limit_admins,:limit_mails);";
			$sth = $db->prepare($conn, $query);
			$sth->execute([':domain' => $name, ':comment' => $comment, ':limit_admins' => $limit_admins, ':limit_mails' => $limit_mails]);
		} catch (PDOException $e){
			$this->SendError(500, $db->getLastError()); 
		}
		
		return $this->SendResult(201, $domain);
        
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
