<?php
	

class SessionController
{
	public function __construct(){
	}
	
	public function getComputerName()
	{
		$ip = $this->getUserIP();
		$name = gethostbyaddr($_SERVER['REMOTE_ADDR']);
		if (strlen($name) > 3)
		{
			$pos = strpos($name, '.');
			if ($pos === false)
				$convert = $name;
			else
				$convert = substr($name, 0, $pos);
			
			return $convert;
		}
			else
				return $ip;
	}
	
	public function getUserIP() 
	{
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

	

	public function isAuthClient($token)
	{
		if(!defined('AUTHCLIENT_LOADED')) {
			define('AUTHCLIENT_LOADED', true);
			session_id($token);
			session_start();
			
			if ( (!isset($_SESSION['LoginSession'])) || (!isset($_SESSION['ConnectionSession'])) )
				return false;
		
			if ($_SESSION['ConnectionSession'] ==  $this->getUserIP())
				return true;
			else
				return false;
		}
			else
			return true;
	}


};
	
?>
