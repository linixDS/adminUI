<?php

	define('LOGGER_CLASS_LOADED', true);

	class LoggerClient
	{
		const EXT_ERROR 	= ".ERR";
		const EXT_LOG		= ".LOG";
		const EXT_REQUEST	= ".REQ";
		
		
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
		
		private function writeDebugLog($filename, $message){
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

		
		public function saveHttpRequestToFile($user)
		{
			$filename = CONFIG_CLIENT_LOG.$user.self::EXT_REQUEST;
			$header = "---[ BEGIN TRANSMISSION ]-----------\r\n";
			$msg = "  URI=".$this->request_uri."\r\n";
			$msg .= "  HEAD=".$this->request_data."\r\n\r\n";
			$msg .= $this->responde_code." --[".date("Y-m-d H:i:s", time())."]-----\r\n";
			$msg .= "  HEAD=".$this->responde_data."\r\n---[ END TRANSMISSION ]-----------\r\n\r\n";
						
			return $this->writeLog($filename,"REQ","", $this->request_time, $msg, $header);
		}
		
		public function writeError($user, $write_to_log = false, $write_request = false){
			$filename = CONFIG_CLIENT_LOG.$user;
			if ($this->responde_data == null && ) return false;

			$post = (array)json_decode($this->responde_data);
	
	
			if (!isset($post['message'])) return false;
	
			if ($write_to_log){
				$msg = "Message: ".$post['message']." (Code=".$post['errorCode'].")\r\n";
				$this->writeLog($filename.self::EXT_LOG,$this->responde_code,"ERROR", $this->request_time, $msg);
				$msg .= "  URI=".$this->request_uri."\r\n  HEAD=".$this->request_data."\r\n";
			}
				else
			$msg = "Message: ".$post['message']." (Code=".$post['errorCode'].")\r\n  URI=".$this->request_uri."\r\n  HEAD=".$this->request_data."\r\n";
			
			if ($write_request)
				$this->saveHttpRequestToFile($user);
			
			return $this->writeLog($filename.self::EXT_ERROR,$this->responde_code,"ERROR", $this->request_time, $msg);
		}
		
		public function writeExceptionAPI($){
			$filename = CONFIG_LOG_PATH.$user;
			$filename2= CONFIG_LOG_PATH."EXCEPTION.ERR";
			
			if ($this->responde_data == null) return false;

			$post = (array)json_decode($this->responde_data);
	
	
			if (!isset($post['message'])) return false;
	
			$msg = "Message: ".$post['message']." (Code=".$post['errorCode'].")\r\n";
			$this->writeLog($filename.self::EXT_LOG,$this->responde_code,"ERROR", $this->request_time, $msg);
			$msg .= "  URI=".$this->request_uri."\r\n  HEAD=".$this->request_data."\r\n";
			
			$this->saveHttpRequestToFile($user);
			$this->writeLog($filename2.self::EXT_ERROR,$this->responde_code,"ERROR", $this->request_time, $msg);
			
			return $this->writeLog($filename.self::EXT_ERROR,$this->responde_code,"ERROR", $this->request_time, $msg);
		}
		
		public function writeLogin($user, $write_request = false){
			$filename = CONFIG_CLIENT_LOG.$user.self::EXT_LOG;
			if ($this->responde_data == null) return false;

			$post_res = (array)json_decode($this->responde_data);
			$post_req = (array)json_decode($this->request_data);
			$sess = (array)$post_res['session'];
	
	
			$msg = " GET ".$this->request_uri."\r\n";		
			$msg .= " _LOGIN=".$user."\r\n _APZ=".$sess['apz_name']."\r\n _SessionID=".$post_res['token']."\r\n _VersionAPI=".$post_req['version']."\r\n";

			if ($write_request)
				$this->saveHttpRequestToFile($user);
			
			return $this->writeLog($filename,$this->responde_code,"INFO", $this->request_time, $msg);			
		}

		public function writeInfo($user, $msg, $write_request = false){
			$filename = CONFIG_CLIENT_LOG.$user.self::EXT_LOG;
			if ($this->responde_data == null) return false;

			$msg = " Message: ".$msg."\r\n GET ".$this->request_uri."\r\n";
			if ($write_request && )
				$this->saveHttpRequestToFile($user);
			
			return $this->writeLog($filename,$this->responde_code,"INFO", $this->request_time, $msg);			
		}
		

		public function writeDebug($user, $msg){
			$filename = CONFIG_CLIENT_LOG.$user.self::EXT_LOG;

						
			return $this->writeDebugLog($filename,$msg);			
		}
		
		public function masterLog($filename, $msg, $write_request = false){
			$filename = CONFIG_CLIENT_LOG.$filename.self::EXT_LOG;

			$msg = " Message: ".$msg."\r\n GET ".$this->request_uri."\r\n";
			
			return $this->writeLog($filename, 201,"INFO", $this->request_time, $msg);			
		}
		
	}

?>