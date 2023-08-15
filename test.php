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

    print_r($detail);
}  


include("./api/v1/config/ldap.php");
include("./api/v1/lib/LdapClass.php");


function  LdapAdd($accountData, $services) {

    $dn = "uid=".$accountData['username'].",dc=system,dc=local";

    if (count($services) > 0){
        $newEntry = [
            "objectClass" => ["inetOrgPerson", "organizationalPerson", "person", "top"],
            "uid" => $accountData['username'],
            "cn" => $accountData['username'],
            "sn" => $accountData['name'],
            "mail" => $accountData['mail'],
            "userPassword" => $accountData['password'],
            "businessCategory" => $services,
        ];

    }
        else {
            $newEntry = [
                "objectClass" => ["inetOrgPerson", "organizationalPerson", "person", "top"],
                "uid" => $accountData['username'],
                "cn" => $accountData['username'],
                "sn" => $accountData['name'],
                "mail" => $accountData['mail'],
                "userPassword" => $accountData['password'],
            ];                
        }


    $ldap = new LdapClass();
    $res =  $ldap->addEntry($dn, $newEntry);
}

$accountData['username'] = 'darek2@test.pl';
$accountData['name'] = 'darek dd';
$accountData['mail'] = 'ddd@sss.pl';
$accountData['password'] = 'password';

$services = [];

LdapAdd($accountData, $services);

?>