<?php



class DomainController
{
    protected $args = null;
    protected $error = array();

    public function __construct($args)
    {
        $this->args = $args;
    }

    public function getDomains($token)
    {
        if (!isset($token))
            return $this->sendError(401, 'Access denied');

        $sess = new SessionController();
        $res = $sess->isAuthClient($token);
        if ($res == false)
            return $this->sendError(401, 'Access denied - wrong token');

        $uid = $sess->GetAdminUID();
        if ($uid == -1)
            return $this->sendError(401, 'Access denied');

        $db = new DB();
        $conn = $db->getConnection();
        if ($conn == null)
            return $this->sendError(500, $db->getLastError());

        if ($sess->IsGlobalAdmin()) {
            $query = "SELECT domain,comment,created,limit_admins,limit_mails FROM domains ORDER BY domain;";
            $sth = $db->prepare($conn, $query);
            $sth->execute();
        } else {
            $query = "SELECT domain,comment,created,limit_admins,limit_mails FROM domains WHERE id IN (SELECT domain_id FROM domain_admin WHERE admin_id=:uid) ORDER BY domain;";
            $sth = $db->prepare($conn, $query);
            $sth->execute([':uid' => $uid]);
        }

        $data = $sth->fetchAll(PDO::FETCH_ASSOC);

        return $this->sendResult(200, $data);
    }



    public function addDomain($token, $domainData, $services)
    {
        if (!isset($token))
            return $this->sendError(401, 'Access denied - token');
        if (!isset($domainData))
            return $this->sendError(401, 'Access denied - data');
        if (!isset($services))
            return $this->sendError(401, 'Access denied - access');

        $domain = $domainData;

        if ((!isset($domain['domain'])) || (!isset($domain['comment'])) || (!isset($domain['limit_mails'])) || (!isset($domain['limit_admins'])))
            return $this->sendError(401, 'Access denied - domain');

        $sess = new SessionController();
        $res = $sess->isAuthClient($token);
        if ($res == false)
            return $this->sendError(401, 'Access denied - wrong token');

        $uid = $sess->GetAdminUID();
        if (!$sess->IsGlobalAdmin())
            return $this->sendError(401, 'Access denied - global');

        $db = new DB();
        $conn = $db->getConnection();
        if ($conn == null)
            return $this->sendError(500, $db->getLastError());

        $name = $domain['domain'];
        $comment = $domain['comment'];
        $limit_mails = $domain['limit_mails'];
        $limit_admins = $domain['limit_admins'];
        $query = '';

        try {
            $db->BeginTransaction($conn);
            $query = "INSERT INTO domains (domain,comment,limit_admins,limit_mails) VALUES (:domain,:comment,:limit_admins,:limit_mails);";
            $sth = $db->prepare($conn, $query);
            $sth->execute([':domain' => $name, ':comment' => $comment, ':limit_admins' => $limit_admins, ':limit_mails' => $limit_mails]);

            $domain_id = $db->GetLastInsertId($conn);

            $query = "INSERT INTO domain_services (domain_id,service_id) VALUES ";
            for ($i = 0; $i < count($services); $i++) {
                $service_id = $services[$i];
                $query .= '(' . $domain_id . ',' . $service_id . ')';
                if ($i < count($services) - 1) {
                    $query .= ',';
                } else
                    $query .= ';';
            }

            $sth2 = $db->prepare($conn, $query);
            $sth2->execute();

            $db->Commit($conn);
        } catch (Exception $e) {
            $db->Rollback($conn);
            $this->sendError(500, "Error SQL:" . $e);
            return;
        }

        return $this->sendResult(201, $domain);
    }

    public function updateDomain($args)
    {
        return $this->sendError(401, 'Access denied');
    }

    public function deleteDomain($token)
    {
        if (!isset($token))
            return $this->sendError(400, 'Bad request - token is empty');
    }


}

?>
