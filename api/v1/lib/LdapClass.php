<?php

if(!defined('BASE_CLASS_LOADED')) 
        include("./core/BaseClass.php");

class LdapClass extends BaseClass
{
    protected $error = '';

    protected $args = null;

    public function __construct($args)
    {
        $this->args = $args;
    }

    private function LdapConnect(){
        $this->error = "";
        // Inicjowanie połączenia LDAP
        try{
            $ldapConnection = ldap_connect(CONFIG_LDAP_HOST, CONFIG_LDAP_PORT);
            ldap_set_option($ldapConnection, LDAP_OPT_PROTOCOL_VERSION, 3);  
            
            return $ldapConnection;
        }
        catch (Exception $e) 
        {
            $this->sendError(501, "Error LDAP: Nie można nawiązać połączenia z serwerem LDAP ".$e->getMessage());
            return null;
        }

        return $ldapConnection;
    }

    public function getError(){
        return $this->error;
    }

    public function addEntry($dn, $newEntry, $ldapConnection = null){ 

        $result = false;
        if ($ldapConnection == null)
            $ldapConnection = $this->LdapConnect();

        if ($ldapConnection) {
            try{
                $bindResult = ldap_bind($ldapConnection, CONFIG_LDAP_USER, CONFIG_LDAP_PASS);
            
                if ($bindResult) {
                    // Dodawanie nowego wpisu
                    $addResult = ldap_add($ldapConnection, $dn, $newEntry);
                    
                    if ($addResult) {
                        $result = true;
                    } else {
                        $this->sendError(501, "Error LDAP: ".ldap_error($ldapConnection));
                        
                    }
                } else {
                    $this->sendError(501, "Error LDAP: ".ldap_error($ldapConnection));
                }
                
                // Zamykanie połączenia LDAP
                ldap_close($ldapConnection);
                return $result;
            } 
            catch (Exception $e) {
                ldap_close($ldapConnection);
                $this->sendError(501, "Error LDAP: ".$e->getMessage());
            }
        }
    }


    public function modifyEntry($dn, $entry, $ldapConnection = null){ 

        $result = false;
        if ($ldapConnection == null)
            $ldapConnection = $this->LdapConnect();
        
        if ($ldapConnection) {
            try{
                $bindResult = ldap_bind($ldapConnection, CONFIG_LDAP_USER, CONFIG_LDAP_PASS);
            
                if ($bindResult) {
                    $addResult = ldap_modify_batch($ldapConnection, $dn, $entry);
                    
                    if ($addResult) {
                        $result = true;
                    } else {
                        $this->sendError(501, "Error LDAP: ".ldap_error($ldapConnection));
                        
                    }
                } else {
                    $this->sendError(501, "Error LDAP: ".ldap_error($ldapConnection));
                }
                
                // Zamykanie połączenia LDAP
                ldap_close($ldapConnection);
                return $result;
            } 
            catch (Exception $e) {
                ldap_close($ldapConnection);
                $this->sendError(501, "Error LDAP: ".$e->getMessage());
            }
        }
    }    


    public function delete($dn,  $ldapConnection = null){ 

        $result = false;
        if ($ldapConnection == null)
            $ldapConnection = $this->LdapConnect();
        
        if ($ldapConnection) {
            try{
                $bindResult = ldap_bind($ldapConnection, CONFIG_LDAP_USER, CONFIG_LDAP_PASS);
            
                if ($bindResult) {
                    $addResult = ldap_delete($ldapConnection, $dn);
                    
                    if ($addResult) {
                        $result = true;
                    } else {
                        $this->sendError(501, "Error LDAP: ".ldap_error($ldapConnection));
                        
                    }
                } else {
                    $this->sendError(501, "Error LDAP: ".ldap_error($ldapConnection));
                }
                
                // Zamykanie połączenia LDAP
                ldap_close($ldapConnection);
                return $result;
            } 
            catch (Exception $e) {
                ldap_close($ldapConnection);
                $this->sendError(501, "Error LDAP: ".$e->getMessage());
            }
        }
    }      
};

?>