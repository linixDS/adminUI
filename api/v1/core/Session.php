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


	public function createTokenSessionId($user)
	{
		session_start();
		
		$_SESSION['LoginSession'] 		= $user;
		$_SESSION['ConnectionSession'] = $this->getUserIP();
		
		return session_id();
	}
	
	
	public function GetAdminUID()
	{
		if (isset($_SESSION['LoginSession']['id']))
			return $_SESSION['LoginSession']['id'];
		else
			return -1;
	}
	
	public function GetLoginUID()
	{
		$this->GetAdminUID();
	}

	public function GetUserName()
	{
		if (isset($_SESSION['LoginSession']['username']))
			return $_SESSION['LoginSession']['username'];
		else
			return null;
	}
	
	public function IsGlobalAdmin()
	{
		if (isset($_SESSION['LoginSession']['type']))
		{
			if ($_SESSION['LoginSession']['type'] == "global")
				return true;
			else
				return false;
		}
		else
			return false;
	}	
	
	public function GetUserInfo()
	{
		$result = array();
		$result['Username'] = $_SESSION['LoginSession']['username'];
		$result['AccountType'] = $_SESSION['LoginSession']['type'];
		$result['DisplayName'] = $_SESSION['LoginSession']['name'];
		$result['ClientIP'] = $_SESSION['ConnectionSession'];
		
		return $result;
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

	

	public function destroyToken($token)
	{
		unset($_SESSION['LoginSession'] );
		unset($_SESSION['ConnectionSession'] );
		session_unset();
		session_destroy();
	}

};
	
?>
