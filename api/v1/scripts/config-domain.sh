#!/usr/bin/php
<?php

    if(count($argv) != 3)
    {
        echo "Usage: config-domain <command> <domain-name>\r\n\r\n";
        echo "Commands:\r\n";
        echo "---------------\r\n";
        echo "add\tAdd new domain\r\n";
        echo "remove\tRemove domain\r\n\r\n";
        exit(-1);
    }


    if ($argv[1] != "add" && $argv[1] != "remove"){
        echo "Error: Command not found !\r\n";
        exit(-1);
    }

    $filename = "/etc/sogo/sogo.conf";

    $file = file_get_contents($filename);
    if ($file === false){
          echo "Error: Config file not found !\r\n";
          exit(-1);
    } 


  if ($argv[1] == "add"){
        $replace  = "/*---[ BEGIN DOMAINS HEADER ]---*/\r\n\r\n";
        $replace .= "/*---[ BEGIN ".$argv[2]." ]---*/\r\n";
        $replace .= "\t".$argv[2]." = {\r\n";
        $replace .= "\t\t SOGoMailDomain = ".$argv[2].";\r\n";
        $replace .= "\t\t SOGoEnableDomainBasedUID = YES;\r\n";
        $replace .= "\t\t SOGoUserSources = ( {\r\n";
        $replace .= "\t\t\t type = sql;\r\n";
        $replace .= "\t\t\t SOGoEnableDomainBasedUID = YES;\r\n";
        $replace .= "\t\t\t DomainFieldName = \"domain\";\r\n";
        $replace .= "\t\t\t viewURL = \"mysql://adminUI:adminUI@localhost:3306/admin_panel/sogo_users\";\r\n";
        $replace .= "\t\t\t id = global_".$argv[2].";\r\n";
        $replace .= "\t\t\t displayName = \"Globalna Książka Adresowa\";\r\n";
        $replace .= "\t\t\t canAuthenticate = YES;\r\n";
        $replace .= "\t\t\t isAddressBook = YES;\r\n";
        $replace .= "\t\t}\r\n";
        $replace .= "\t\t);\r\n";
        $replace .= "\t};\r\n";
        $replace .= "/*---[ END ".$argv[2]." ]---*/\r\n";

        $new_content = str_replace("/*---[ BEGIN DOMAINS HEADER ]---*/",$replace, $file);


        file_put_contents($filename, $new_content);
  }
    else {
          $findBegin = "/*---[ BEGIN ".$argv[2]." ]---*/";
          $findEnd = "/*---[ END ".$argv[2]." ]---*/";
          
          $start = strpos($file, $findBegin);
          if ($start === FALSE)
          {
              echo "No found header begin: ".$findBegin."\r\n";
              exit(-1);
          }

          $end = strpos($file, $findEnd);
          if ($end === FALSE)
          {
              echo "No found header end: ".$findEnd."\r\n";
              exit(-1);
          }

          $end = $end + strlen($findEnd);
          $text1 = substr($file, $start, $end-$start);
          $file = str_replace($text1,"", $file);

          file_put_contents($filename, $file);                
    }
?>