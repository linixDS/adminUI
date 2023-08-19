<?php

if(!defined('BASE_CLASS_LOADED')) 
        include("./core/BaseClass.php");

class QuotaClass extends BaseClass
{
    protected $args = null;

    public function __construct($args)
    {
        $this->args = $args;
    }

    public function getClientQuota($db,$conn, $clientId){
        if (!isset($clientId))
            return $this->sendError(401, 'Access denied');


        try {
            $query = "SELECT IF(size>0,size div 1024,0) as quota FROM clients_quota WHERE client_id=? LIMIT 1;";
			$sth = $db->prepare($conn, $query);
			$sth->execute([$clientId]);

            $data = $sth->fetch(PDO::FETCH_ASSOC);
            if ($sth->rowCount()==0)
                return 0;
            else
                return $data['quota'];
        } catch (Exception $e) {
            $this->sendError(500, "Error SQL:" . $e);
            return;
        }
    }

    public function getUsageQuota($db,$conn, $clientId){
        if (!isset($clientId))
            return $this->sendError(401, 'Access denied');


        try {
            $query = "SELECT SUM(size) as size FROM accounts_quota WHERE account_id IN (SELECT account_id FROM accounts WHERE client_id=?)";
			$sth = $db->prepare($conn, $query);
			$sth->execute([$clientId]);

            $data = $sth->fetch(PDO::FETCH_ASSOC);
            if ($sth->rowCount()==0)
                return 0;
            else
                return $data['size'];
        } catch (Exception $e) {
            $this->sendError(500, "Error SQL:" . $e);
            return;
        }
    }   

    public function getQuota($db,$conn, $clientId){
        if (!isset($clientId))
            return $this->sendError(401, 'Access denied');

        $quota = $this->getClientQuota($db, $conn,$clientId);
        $usage = $this->getUsageQuota($db, $conn, $clientId);

        if ($usage > 0) $usage = floor($usage / 1024);

        if ($quota > 0 && $quota > $usage)
            $free = $quota-$usage;
        else
            $free = 0;

        $result['limit'] = $quota;
        $result['usage'] = $usage;
        $result['free'] = $free;
        return $result;
    }      


}

?>