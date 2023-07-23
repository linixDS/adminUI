<?php

if(!defined('BASE_CLASS_LOADED')) 
    include("./core/BaseClass.php");

class ServicesClass extends BaseClass
{
    protected $args = null;

    public function __construct($args)
    {
        $this->args = $args;
    }


    public function getAllServices($token)
    {
        if (!isset($token))
            return $this->sendError(401, 'Access denied - token');

        $sess = new SessionController();
        $res = $sess->isAuthClient($token);
        if ($res == false)
            return $this->sendError(401, 'Access denied - wrong token');           

        if (!$sess->IsGlobalAdmin())
            return $this->sendError(401, 'Access denied - global');

        $db = new DB();
        $conn = $db->getConnection();
        if ($conn == null)
            return $this->sendError(500, $db->getLastError());


        try {
            $query = "SELECT id,name,description,com_checked,com_disabled FROM services WHERE ACTIVE=1 ORDER BY name;";
            $sth = $db->prepare($conn, $query);
            $sth->execute();
    
            $data = $sth->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            $this->sendError(500, "Error SQL:" . $e);
            return;
        }

        return $this->sendResult(200, $data);
    }

    public function getDomainServices($token, $domain)
    {
        if (!isset($token))
            return $this->sendError(401, 'Access denied - token');

        if (!isset($domain))
            return $this->sendError(401, 'Access denied - token');

        $sess = new SessionController();
        $res = $sess->isAuthClient($token);
        if ($res == false)
            return $this->sendError(401, 'Access denied - wrong token');           

        $db = new DB();
        $conn = $db->getConnection();
        if ($conn == null)
            return $this->sendError(501, $db->getLastError());


        try {
            $query = "SELECT service_id FROM domain_services WHERE domain_id=(SELECT id FROM domains WHERE domain=:domainName LIMIT 1);";
            $sth = $db->prepare($conn, $query);
            $sth->bindValue(':domainName', $domain, PDO::PARAM_STR);
            $sth->execute();
    
            $data = $sth->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            $this->sendError(500, "Error SQL:" . $e);
            return;
        }

        return $this->sendResult(200, $data);
    }    


}

?>
