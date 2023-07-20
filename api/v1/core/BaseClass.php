<?php

class BaseClass {

    protected $
    
    
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
        exit();
    }

};
?>