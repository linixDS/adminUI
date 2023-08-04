<?php

class BaseController
{
	protected $data = null;	
	
    public function SaveResponde($value){
        $logger = new LoggerClient();
        $logger->saveResponde($value);
    } 

    public function SendResult($code, $result)
    {
		header("Access-Control-Allow-Origin: *");
        header("Content-Type: application/json; charset=UTF-8");

        http_response_code($code);
		
		$responde['result'] = $result;
        $json = json_encode($responde);
		$this->SaveResponde($json);

		echo $json;
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

		
        $json = json_encode($result);
		$this->SaveResponde($json);

		echo $json;
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
