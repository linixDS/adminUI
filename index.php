<?php


error_reporting(E_ALL);
ini_set('display_errors', 1);
/*set_error_handler('error_handler');
set_exception_handler('exception_handler');

// Funkcja do obsługi błędów
function error_handler($errno, $errstr, $errfile, $errline)
{
    throw new ErrorException($errstr, 0, $errno, $errfile, $errline);
}

function exception_handler($exception)
{
    goLoginPage('Error');
    exit;
}    
*/
function goLoginPage($error){
    if ($error != null)
        header('Location: ./login.php?message='.$error);
    else
        header('Location: ./login.php');   
    exit();    
}


    if ( (!isset($_POST['username'])) || (!isset($_POST['password'])) ){
        goLoginPage(null);
    }



    $username = $_POST['username'];
    $password = $_POST['password'];

    $post_data = array (  
        "username" => $username,  
        "password" => $password);
 

    $json = json_encode($post_data);

    $url = "http:/localhost/api/v1/login.php";

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
            $name = $result['result']['user']['name'];    
            
            echo file_get_contents("./templates/app.html");
        }
            else {
                $result = json_decode($result_json, true);
                $message = $result['error']['message'];
                goLoginPage($message);
            }

    }

    curl_close($ch);


?>