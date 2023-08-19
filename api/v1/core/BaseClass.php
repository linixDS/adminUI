<?php


define('BASE_CLASS_LOADED', true);


class BaseClass {

    public function SaveResponde($value){
        $logger = new LoggerClient();
        $logger->saveResponde($value);
    } 

    public function debugWrite($name, $value){
        $logger = new LoggerClient();
        $logger->saveDebug($name, $value);
    }

    
    public function exceptionWrite($value){
        $logger = new LoggerClient();
        $logger->saveException($value);
    }      


    public function sendError($statusCode, $message)
    {
		header("Access-Control-Allow-Origin: *");
        header("Content-Type: application/json; charset=UTF-8");

        http_response_code($statusCode);
		
		$result = array();
        $error = array();
		$error['code'] = $statusCode;
		$error['message'] = $message;
		$result['error'] = $error;
		
        echo json_encode($result);

        $this->exceptionWrite($message);

        exit();
    }

    public function sendResult($statusCode, $data)
    {
		header("Access-Control-Allow-Origin: *");
        header("Content-Type: application/json; charset=UTF-8");

        http_response_code($statusCode);
		
		$result = array();
		$result['result'] = $data;

		
        $json = json_encode($result);
        $this->SaveResponde($json);

        echo $json;
        exit();
    }

};
?>