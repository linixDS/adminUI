<?php
	

class SessionController
{
	public function __construct(){
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
			

			if ($ipaddress == "::1")
				return "127.0.0.1";
			else
				return $ipaddress;
	}   


	public function createTokenSessionId($user, $address = null)
	{
		session_start();
		
		$_SESSION['LoginSession'] 		= $user;
		if ($address == null)
			$_SESSION['ConnectionSession'] = $this->getUserIP();
		else
			$_SESSION['ConnectionSession'] = $address;
		return session_id();
	}
	
	
	public function GetAdminUID()
	{
		if (isset($_SESSION['LoginSession']['id']))
			return $_SESSION['LoginSession']['id'];
		else
			return -1;
	}

	public function GetClientID()
	{
		if (isset($_SESSION['LoginSession']['client_id']))
			return $_SESSION['LoginSession']['client_id'];
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
		$result['UserName'] = $_SESSION['LoginSession']['username'];
		if ($_SESSION['LoginSession']['type'] == 'global')
			$result['isGlobalAdmin'] = true;
		else
			$result['isGlobalAdmin'] = false;
		$result['DisplayName'] = $_SESSION['LoginSession']['name'];
		$result['Email'] = $_SESSION['LoginSession']['mail'];
		$result['Connection'] = $_SESSION['ConnectionSession'];
		$result['SessToken'] = session_id();
		
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
