<?php

class BaseController
{
	protected $data = null;	
	
    public function SendResult($code, $result)
    {
		header("Access-Control-Allow-Origin: *");
        header("Content-Type: application/json; charset=UTF-8");

        http_response_code($code);
		
		$responde['result'] = $result;
        echo json_encode($responde);
        exit();
	}
	
    public function SendError($code, $msg)
    {
		header("Access-Control-Allow-Origin: *");
        header("Content-Type: application/json; charset=UTF-8");

        http_response_code($code);
		
		$result = array();
        $error = array();
		$error['code'] = $code;
		$error['message'] = $msg;
		$result['error'] = $error;

		
        echo json_encode($result);
        exit();
	}	
	
	public function __construct(){
	}
	
	public function GET($args){
			
	}	
	
 	public function POST($args){

	}

 	public function PUT($args){

	}

 	public function DELETE($args){

	}
}

?>
