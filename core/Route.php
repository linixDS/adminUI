<?php

class Route{


		public function __construct()
		{
		}
		
		public function run()
		{
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

