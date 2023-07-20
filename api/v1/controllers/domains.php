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
        if (!isset($args['services']))
			return $this->SendError(401, 'Access denied - access'); 		

		$domain = $args['data'];

		if ( (!isset($domain['domain'])) || (!isset($domain['comment'])) || (!isset($domain['limit_mails'])) || (!isset($domain['limit_admins'])) )
			return $this->SendError(401, 'Access denied - domain'); 
		
		
        $sess = new SessionController();
        $res = $sess->isAuthClient($args['token']);
        if ($res == false)
            return $this->SendError(401, 'Access denied - wrong token'); 
		
        $uid = $sess->GetAdminUID();
		if (!$sess->IsGlobalAdmin()) 	return $this->SendError(401, 'Access denied - global'); 

		$db = new DB();
        $conn = $db->getConnection();
        if ($conn == null)
            return $this->SendError(500, $db->getLastError()); 			
		
		$name = $domain['domain'];
		$comment = $domain['comment'];
		$services = $args['services'];
		$limit_mails = $domain['limit_mails'];
		$limit_admins = $domain['limit_admins'];
		$query = '';

		try{
			$db->BeginTransaction($conn);
			$query = "INSERT INTO domains (domain,comment,limit_admins,limit_mails) VALUES (:domain,:comment,:limit_admins,:limit_mails);";
			$sth = $db->prepare($conn, $query);
			$sth->execute([':domain' => $name, ':comment' => $comment, ':limit_admins' => $limit_admins, ':limit_mails' => $limit_mails]);
			
			$domain_id = $db->GetLastInsertId($conn);

			$query = "INSERT INTO domain_services (domain_id,service_id) VALUES ";
			for ($i=0; $i < count($services); $i++) {
				$service_id = $services[$i];
				$query .= '('.$domain_id. ','.$service_id.')';
				if ($i < count($services)-1 ){
					$query .= ',';
				}
				else
					$query .= ';';
			}

			$sth2 = $db->prepare($conn, $query);
			$sth2->execute();

			$db->Commit($conn);
		} catch (Exception $e){
			$db->Rollback($conn);
			$this->SendError(500,"Error SQL:".$e); 
			return;
		}
		
		return $this->SendResult(201,$domain );
        
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
