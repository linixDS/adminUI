<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

     function isService($id, $table){
         foreach ($table as $value)
              if ($value['id'] == $id) return true;

         return false;
     }

     function getCurrentService($id, $table){
         foreach ($table as $value){
               if ($value['id'] == $id) return $value;
         }
  
         return null;      
     }

     function getChangedServicesResultData($current, $new){
              $serviceNew = array();
              $serviceDelete = array();
              $serviceUpdate = array();

              /* Sprawdzamy bieżące usługi
                 jeśli w nowych usługach czegoś nie znajdziemy to należy usunąć usuługę
              */

              foreach ($current as $value) {
                  if (!isService($value['id'], $new)) 
                     array_push($serviceDelete, $value);
              }
   

               /* Sprawdzamy nowe usługi
                 jeśli w bieżacych usługach czegoś nie znajdziemy to należy dodać usuługę
              */
              foreach ($new as $value) {
               if (!isService($value['id'], $current)) 
                  array_push($serviceNew, $value);
           }

              foreach ($new as $value) {
                  $curr = getCurrentService($value['id'], $current);
                  if ($curr != null){
                     if ($curr['limit_accounts'] != $value['limit_accounts'])
                     array_push($serviceUpdate, $value);
                  }
               }

              $result = array();
              $result['add'] =  $serviceNew;
              $result['delete'] = $serviceDelete;
              $result['update'] = $serviceUpdate;

              return $result;
     }

     $current = array( 
                        array('id'=>1,'limit_accounts'=>2),
                        array('id'=>2,'limit_accounts'=>2),
                     );
     $new = array(
                     array('id'=>1,'limit_accounts'=>5),
                     array('id'=>3,'limit_accounts'=>2),
     );


     function test($current){
            foreach ($current as $value){
               echo ($value['id']);
               echo "<br>";
            }
     }

     echo "CURRENT: <br/>";
     print_r($current);
     echo "<br/>NEW</br>";
     print_r($new);
     echo "<br/>";
     echo "RESULT";
     echo "<br/>";
     
     $res = var_export(getChangedServicesResultData($current, $new), true);
     //echo $res;



?>