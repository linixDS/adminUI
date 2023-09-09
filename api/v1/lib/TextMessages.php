<?php



function GetMessage($preffix)
{
	if ($ErrorCode != null)
			$code = $ErrorCode;
		else
			$code = $preffix;

	if (file_exists('.\messages\pl-messages.php'))
	{
		$MessageArray = @require(".\messages\pl-messages.php");

		if (isset($MessageArray[$preffix]))
		{
			$msg = $MessageArray[$preffix];
			if ($msg[0] == 'E')
			{
				return "Błąd " . $code . ": " .$msg; 
			}
				else
			return $msg;
		}
			else
			return "BŁĄD: " .$preffix;
	}
		else{
			return "BŁĄD: " . $preffix;
		}
}

function _E($preffix) {
	return GetMessage($preffix);
}

function GetMessageWithParam($preffix, $param)
{
	$code = $preffix;

	if (file_exists('.\messages\pl-messages.php'))
	{
		$MessageArray = @require(".\messages\pl-messages.php");

		if (isset($MessageArray[$preffix]))
		{
			$msg = $MessageArray[$preffix];
			
			return sprintf($msg,$param);
		}
			else
			return "BŁĄD: " . $code . " | E0000-0002: TEXT MESSAGE NO FOUND";
	}
		else{
			return "BŁĄD: " . $code . " | E0000-0001: FILE MESSAGES NO FOUND";
		}
}




?>