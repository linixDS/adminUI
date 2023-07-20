<?php
    $json = "{\"token\":\"tkn7im3d7312kc95h5ls9th4gv\",\"data\":{\"domain\":\"asdasd\",\"comment\":\"\",\"limit_mails\":100,\"limit_admins\":100},\"services\":[1,2,3,4]}";
    $args = json_decode($json, true);


    $domain_id = 10;
    try{

        $query = "INSERT INTO domains_services (domain_id,service_id) VALUES ";
        for ($idx=0; $idx < count($args['services']); $idx++) {
            $service_id = $args['services'][$idx];
            $query .= '('.$domain_id. ','.$service_id.')';
            if ($idx < count($args['services'])-1 ){
                $query .= ',';
            }
                else
                $query .= ';';
        }

        echo $query;
    }catch ( Exception $e) {

    }


?>