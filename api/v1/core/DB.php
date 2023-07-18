<?php
	

class DB
{
    protected $errors = null;
			
    public function getLastError(){
        return $this->errors;
    }
    
    public function getConnection(){
        try{
            $param = "mysql:dbname=".CONFIG_DB_NAME.";host=".CONFIG_DB_HOST;
            return new PDO($param, CONFIG_DB_USER, CONFIG_DB_PASS);
        } catch (PDOException $e){
            $this->errors = 'ERROR_CONN: ' . $e;
            return null;
        }
    }
    
    public function prepare($dbconn, $query)
    {
        return $dbconn->prepare($query, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
    }

    public function QuerySelect($query)
	{
        $conn = $this->getConnection();
        if ($conn != null)
        {
            try
            {
                $result = $conn->query($query);
                    
                $conn = null;
                return $result;
            } 
            catch (PDOException $e)
            {
                $this->errors = 'ERROR_QUERY: ' . $e;
                return null;
            }
        }
            else
            {
                return null;
            }			
    }
    
    public function GetDomainIdFromName($domain)
    {
        $conn = $this->getConnection();
        if ($conn == null) return null;
        $query = "SELECT id FROM domains WHERE domain=:name LIMIT 1";
        $sth = $this->prepare($conn, $query);
        $sth->execute([':domain' => $domain]);
        return $sth->fetchAll(PDO::FETCH_ASSOC);
    }

};

?>
