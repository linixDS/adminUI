<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);
set_error_handler('error_handler');
set_exception_handler('exception_handler');

// Funkcja do obsługi błędów
function error_handler($errno, $errstr, $errfile, $errline)
{
    throw new ErrorException($errstr, 0, $errno, $errfile, $errline);
}

// Funkcja do obsługi wyjątków
function exception_handler($exception)
{
    $detail = array(
        'error' => $exception->getMessage(),
        'code' => $exception->getCode(),
        'file' => $exception->getFile(),
        'line' => $exception->getLine()
    );

    $result = array();
    $error = array();

    $error['message'] = 'Błąd systemowy.';
    $error['code'] = 501;
    $error['detail'] = $detail;

    $result['error'] = $error;
    
    http_response_code(501); // Ustaw kod odpowiedzi na 500 Internal Server Error lub inny odpowiedni kod błędu.

    // Przesyłamy dane błędu w formie JSON
    header('Content-Type: application/json');
    echo json_encode($result);
    exit;
}    
         
include ("./config/config.php");
include ("./config/db.php");
include ("./core/Route.php");


?>
