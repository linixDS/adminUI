#!/usr/bin/php
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
        print_r($exception);
        exit(-1);
    } 

    include "/srv/www/adminUI/api/v1/config/config.php";
    include "/srv/www/adminUI/api/v1/config/db.php";
    include "/srv/www/adminUI/api/v1/core/DB.php";
    include "/srv/www/adminUI/api/v1/core/BaseClass.php";    
    include "/srv/www/adminUI/api/v1/lib/JobClass.php";  


    $text = "[".date("Y-m-d H:i:s", time())."]\t CHECKING WAITING JOBS:\r\n";  
    echo $text;

    $db = new DB();
    $conn = $db->getConnection();
    if ($conn == null){
        echo "ERROR: ".$db->getLastError();
        exit(-1);
    }

    $class = new JobClass(null);
    $result = $class->getActivedJobs($db, $conn);

    if ($result === FALSE) exit(-1);
    echo "\t\t\t JOBS COUNT: ".count($result)."\r\n";

    for ($idx=0; $idx<count($result);$idx++){
        $jobId = $result[$idx]['id'];
        $created = $result[$idx]['created'];
        $script = SCRIPT_PATH."/".$result[$idx]['runscript'];
        $scriptArgs = $result[$idx]['scriptargs'];

        $exec = $script." ".$scriptArgs;

        $text = "[".date("Y-m-d H:i:s", time())."]\t EXECUTE  script=[".$script."] args=[".$scriptArgs."] - ".$created."\r\n"; 
        echo $text;

        system($exec, $retval);
        echo "\t\t\t RESULT CODE = ".$retval."\r\n";

        $class->removeJob($db,$conn,$jobId);
    }
    




?>
