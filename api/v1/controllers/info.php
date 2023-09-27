<?php

include("./core/BaseController.php");
include("./core/DB.php");
include("./core/Session.php");
include("./lib/DomainsClass.php");
include("./lib/ServicesClass.php");

class Controller extends BaseController
{
	protected $data = null;	
	
	public function __construct(){
	}
	
	
	public function GET($args)
    {
        if (!isset($args['token']))
            return $this->sendError(401, 'Access denied -token');
          

        $sess = new SessionController();
        $cid = $sess->GetClientID();


        $res = $sess->isAuthClient($args['token']);
        if ($res == false)
            return $this->sendError(401, 'Access denied - wrong token');
        
        $db = new DB();
        $conn = $db->getConnection();
        if ($conn == null)
            return $this->sendError(501, $db->getLastError());

        $result = array();
        $services = array();
        $domainClass = new DomainsClass(null);
        $data = $domainClass->getCountDomainsRaw($db, $conn);
        if ($data != false){
            array_push($services, $data);
        }

        
        $serviceClass = new ServicesClass(null);
        $allService  =  $serviceClass->getAllServicesResultData($db, $conn);

        foreach ($allService as $row){
            $id = $row['id'];
            $item = array();
            $item['name'] = $row['name'];
            $item['desc'] = "Liczba kont w usłudze ".$row['name'];


            if ($sess->IsGlobalAdmin()) 
                $res = $serviceClass->getCountAllServiceResultData($db, $conn, $id);
            else
                $res = $serviceClass->getCountClientServiceResultData($db, $conn, $cid, $id);

            $item['value'] = $res['active_accounts'];

            array_push($services, $item);
        } 
 




        $result['services'] = $services;


        return $this->sendResult(200, $result);
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

