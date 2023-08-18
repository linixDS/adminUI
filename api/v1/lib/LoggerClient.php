<?php

	define('LOGGER_CLASS_LOADED', true);

	class LoggerClient
	{
		private $request_time;
		private $request_from;
		private $request_uri = null;
		private $request_data = null;
		private $responde_data = null;
		private $responde_code = null;
		
		
		public function __construct ()
		{
			$this->request_time= time();
			$this->request_uri = "//{$_SERVER['HTTP_HOST']}{$_SERVER['REQUEST_URI']}";
			$this->request_data= file_get_contents('php://input');;
			$this->request_from= $this->getAddressIP();
		}
		
		public function setResponde($code, $data)
		{
			$this->responde_code = $code;
			$this->responde_data = $data;
		}
		
		public function setRequest($data)
		{
			$this->request_data = $data;
		}
		
		public function getAddressIP() {
				$ipaddress = '';
				if (isset($_SERVER['HTTP_CLIENT_IP']))
					$ipaddress = $_SERVER['HTTP_CLIENT_IP'];
				else if(isset($_SERVER['HTTP_X_FORWARDED_FOR']))
					$ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
				else if(isset($_SERVER['HTTP_X_FORWARDED']))
					$ipaddress = $_SERVER['HTTP_X_FORWARDED'];
				else if(isset($_SERVER['HTTP_X_CLUSTER_CLIENT_IP']))
					$ipaddress = $_SERVER['HTTP_X_CLUSTER_CLIENT_IP'];
				else if(isset($_SERVER['HTTP_FORWARDED_FOR']))
					$ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
				else if(isset($_SERVER['HTTP_FORWARDED']))
					$ipaddress = $_SERVER['HTTP_FORWARDED'];
				else if(isset($_SERVER['REMOTE_ADDR']))
					$ipaddress = $_SERVER['REMOTE_ADDR'];
				else
					$ipaddress = 'UNKNOWN';
				
				return $ipaddress;
		}
		
		private function writeLog($filename, $httpcode, $type, $time, $message, $header = ""){
			if (file_exists($filename)){
				$handle = fopen($filename,"a+");
			}
				else
					$handle = fopen($filename, "w");
			
			if ($handle){
				$txt = $header.$httpcode." --[".date("Y-m-d H:i:s", $time)."]-----| ".strtoupper($type)." (".$this->request_from.")\r\n".$message."\r\n";  
				fwrite($handle, $txt);
				fclose($handle);
				return true;
			}
				
			return false;
		}



		private function writeLog2($filename, $message){
			if (file_exists($filename)){
				$handle = fopen($filename,"a+");
			}
				else
					$handle = fopen($filename, "w");
			
			if ($handle){
				$txt = "---[".date("Y-m-d H:i:s", $time)."]-----|  (".$this->request_from.")\r\n".$message."\r\n\r\n";  
				fwrite($handle, $txt);
				fclose($handle);
				return true;
			}
				
			return false;
		}		

		private function writeLogDebug($filename, $message){
			if (file_exists($filename)){
				$handle = fopen($filename,"a+");
			}
				else
					$handle = fopen($filename, "w");
			
			if ($handle){
				$txt = $message."\r\n";  
				fwrite($handle, $txt);
				fclose($handle);
				return true;
			}
				
			return false;
		}				
		

		
		public function saveRequest()
		{
			$filename = getcwd().CONFIG_LOG_PATH."access.log";

			$header = "---[ BEGIN TRANSMISSION ]-----------\r\n";
			$msg  = "  URI=".$this->request_uri."\r\n";
			$msg .= "  HEAD=".$this->request_data."\r\n";
			$msg .= " ---[ END TRANSMISSION ]-----------\r\n";
						
			return $this->writeLog($filename,"REQ","", $this->request_time, $msg, $header);
		}

		public function saveResponde($json)
		{
			$filename = getcwd().CONFIG_LOG_PATH."access.log";
					
			return $this->writeLog($filename,"RES","", $this->request_time, $json, '');
		}		

		public function saveQuery($pdo_sth)
		{
			$filename = getcwd().CONFIG_LOG_PATH."query_db.log";
			$query =  $pdo_sth->debugDumpParams();
			return $this->writeLog2($filename, $query);
		}

		public function saveException($error)
		{
			$filename = getcwd().CONFIG_LOG_PATH."exceptions.log";
			$message = "EXCEPTION => \t";
			$message .= var_export($error, true);
			return $this->writeLogDebug($filename, $message);
		}	
		
		
		
		public function saveDebug($name, $value)
		{
			$filename = getcwd().CONFIG_LOG_PATH."debug.log";
			$message = "[".$name."] => ";
			$message .= json_encode($value);
			return $this->writeLogDebug($filename, $message);
		}
		
		public function saveFailedLog($login, $address)
		{
			$filename = getcwd().CONFIG_LOG_PATH."failed-auth.log";

			if (file_exists($filename)){
				$handle = fopen($filename,"a+");
			}
				else
					$handle = fopen($filename, "w");
			
			if ($handle){
				$txt = sprintf("%s - %s - FAILED AUTH: %s\r\n", $address, date("Y-m-d H:i:s", time()), $login) ;
				fwrite($handle, $txt);
				fclose($handle);
				return true;
			}

		}			
		
		

		
	}

?>