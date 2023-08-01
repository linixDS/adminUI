<?php


include("./lib/LoggerClient.php");

class Route{


        public function SendResult($code, $result)
        {
               header("Access-Control-Allow-Origin: *");
               header("Content-Type: application/json; charset=UTF-8");

               http_response_code($code);
               echo json_encode($result);
               exit();
        }

        public function SetResultError($msg, $code)
        {
               $result = array();
               $error = array();
               $error['code'] = $code;
               $error['message'] = $msg;
               $result['error'] = $error;

               return $result;
        }

		public function __construct()
		{
			$logger = new LoggerClient();
			$logger->saveRequest();
		}
		
		public function run($action, $accessMethod = 'ALL')
		{
			$method = $_SERVER['REQUEST_METHOD'];
			if ( ($accessMethod != "ALL") && ($accessMethod != $method) )
			{
				$result = $this->SetResultError("No access", 401);
				$this->SendResult(401, $result); 
				return;
			}


			if (file_exists("./controllers/".$action.".php"))
					{
				require("./controllers/".$action.".php");

				
				
				$obj = new Controller();

				if (method_exists($obj, $method))
							{
							   if ($method != "GET") {
											$request_data = file_get_contents('php://input'); 
											$request = (array)json_decode($request_data, true);
							   }
							   switch ($method)
							   {
									  case "GET":
												   $obj->$method($_GET);
												   break;
									  case "POST":
												   $obj->$method($request);
												   break;
									  case "PUT":
												   $obj->$method($request);
												   break;
									  case "DELETE":
												   $obj->$method($request);
												   break;
									  default:
											  $result = $this->SetResultError("Bad request", 400);
											  $this->SendResult(400, $result);
							   }

							}
			}
					  else {
							$result = $this->SetResultError("Bad request", 400);
							$this->SendResult(400, $result);
					  }

		}
	
};

?>

