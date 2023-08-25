<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
set_error_handler('error_handler');
set_exception_handler('exception_handler');

// Funkcja do obsługi błędów
function error_handler($errno, $errstr, $errfile, $errline)
{
    print_r($errstr);
    throw new ErrorException($errstr, 0, $errno, $errfile, $errline);
}


include("config/config.php");




function goLoginPage($error){
    
    
    $url = "Location: ./login.php";
    if ($error != null){
        $error = str_replace('\'','',$error);
        $url = $url."?message=".$error;
    }

    
    $url = str_replace(PHP_EOL,'',$url);

    header($url);   
    exit();    
}


function exception_handler($exception)
{
    print_r($exception);
    //goLoginPage('Error: '.$exception->toString());
    exit;
}    


function getAddressIP() {
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
;
    
    return $ipaddress;
}



    if ( (!isset($_POST['username'])) || (!isset($_POST['password'])) ){
        goLoginPage(null);
    }



    $username = $_POST['username'];
    $password = $_POST['password'];
    $address  = getAddressIP();
    

    $post_data = array (  
        "username" => $username,  
        "password" => $password,
        "address" => $address);
 

    $json = json_encode($post_data);

    $url = SERVER_API_ADDRESS."/api/v1/login.php";
 

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL,$url);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $json );
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));    
    curl_setopt($ch, CURLOPT_TIMEOUT, 1000);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, True);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, True);

    $result_json = curl_exec($ch);


    if (!curl_errno($ch)) {
        $status=curl_getinfo($ch, CURLINFO_HTTP_CODE);
        if ($status == 200){
            $result = json_decode($result_json, true);
            $token = $result['result']['token'];  
            
            $buffer = file_get_contents("./templates/app.html");
            $text = "const key='".base64_encode($token)."';";

          //  $text = "const key='".$token."';";
            $buffer = str_replace("<TOKEN>", $text, $buffer);
            echo $buffer;
        }
            else {
                $result = json_decode($result_json, true);
                print_r($result);
                if (isset($result['error'])){
                    $message = $result['error']['message'];
                    $mesage = 'sdfsdfsd';
                }
                else
                    $message = "Responde Status Code: ".$status;
                goLoginPage($message);
            }

    }
        else {
            goLoginPage("Nie można połączyć się z usługą!");

        }

    curl_close($ch);


?>