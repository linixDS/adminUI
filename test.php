<?php

     function isService($id, $table){
          for ($x=0; $x < count($table); $x++){
              if ($table[$x] == $id) return true;
          }

          return false;
     }

     function getChangedServicesResultData($current, $new){
              $serviceNew = array();
              $serviceDelete = array();

              /* Sprawdzamy bieżące usługi
                 jeśli w nowych usługach czegoś nie znajdziemy to należy usunąć usuługę
              */
              for ($x=0; $x < count($current); $x++){
                  if (!isService($current[$x], $new)) {
                     array_push($serviceDelete, $current[$x]);
                  }
              }

               /* Sprawdzamy nowe usługi
                 jeśli w bieżacych usługach czegoś nie znajdziemy to należy dodać usuługę
              */
              for ($y=0; $y < count($new); $y++){
                  if (!isService($new[$y], $current)) {
                     array_push($serviceNew, $new[$y]);
                  }
              }

              $result = array();
              $result['add'] =  $serviceNew;
              $result['delete'] = $serviceDelete;

              return $result;
     }

     $current = array(1,2,3);
     $new = array(2,4);

     print_r($current);
     echo "<br/>";
     print_r($new);
     echo "<br/>";

     print_r(getChangedServicesResultData($current, $new));

?>