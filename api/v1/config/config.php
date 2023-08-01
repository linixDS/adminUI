<?php
     define("CONFIG_DEBUG", "1");

     if (CONFIG_DEBUG == "1")
     {
         ini_set('display_errors', '1');
         ini_set('display_startup_errors', '1');
         error_reporting(E_ALL);
     }

     define("CONFIG_LOG_PATH", "/logs/");
?>