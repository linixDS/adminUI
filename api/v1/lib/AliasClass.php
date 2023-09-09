<?php

if(!defined('BASE_CLASS_LOADED')) 
        include("./core/BaseClass.php");

class AliasClass extends BaseClass
{
    protected $args = null;

    public function __construct($args)
    {
        $this->args = $args;
    }

    private function getAccountId($db, $conn, $mail){
        $sess = new SessionController();

        try {
            if ($sess->IsGlobalAdmin()){
                $query = "SELECT account_id FROM accounts WHERE (username=:USERNAME) LIMIT 1;";
                $sth = $db->prepare($conn, $query);
                $sth->bindValue(':USERNAME', $mail, PDO::PARAM_STR);
                $sth->execute();
            }
            else {
                $cid = $sess->GetClientID();
                $query = "SELECT account_id FROM accounts WHERE (username=:USERNAME AND client_id=:CLIENTID) LIMIT 1;";
                $sth->bindValue(':USERNAME', $mail, PDO::PARAM_STR);
                $sth->bindValue(':CLIENTID', $cid, PDO::PARAM_INT);
                $sth = $db->prepare($conn, $query);
                $sth->execute();
            }

            if ($sth->rowCount() == 0){
                $error = "Konto pocztowe ".$mail." nie istnieje lub jest przypisane do innego klienta.";
                $this->sendError(404, $error);
            }
            $data = $sth->fetch(PDO::FETCH_ASSOC);
            return $data['account_id'];
        } catch (Exception $e) {
            $this->sendError(500, "Error SQL:" . $e);
            return false;
        }
    } 


    public function getAliasFromMail($token, $mail){
        if (!isset($token))
            return $this->sendError(401, 'Access denied 3');
        if (!isset($mail))
            return $this->sendError(401, 'Access denied 4');
        if (!is_numeric($mail))
            return $this->sendError(401, 'Error type data');

        $sess = new SessionController();
        $res = $sess->isAuthClient($token);
        if ($res == false)
            return $this->sendError(401, 'Access denied - wrong token');
        

        $db = new DB();
        $conn = $db->getConnection();
        if ($conn == null)
            return $this->sendError(501, $db->getLastError());

        try {
            if (!$sess->IsGlobalAdmin()){
                $query = "SELECT forward_id as id, address as alias FROM mail_forwardings WHERE ";
                $query.= "(account_id=(SELECT account_id FROM accounts WHERE account_id=? AND client_id=?)) AND (alias=1);";
                $sth = $db->prepare($conn, $query);
                $sth->execute([$mail]);

            }
                else {
                    $query = "SELECT forward_id as id, address as alias FROM mail_forwardings WHERE ";
                    $query.= "(account_id=?) AND (alias=1);";
                    $sth = $db->prepare($conn, $query);
                    $sth->execute([$mail]);                  
                }

            $data = $sth->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            $this->sendError(500, "Error SQL:" . $e);
            return;
        }

        $result['alias'] = $data;
        return $this->sendResult(200, $result);
    }


      

    public function addAlias($token, $alias){
        if (!isset($token))
            return $this->sendError(401, 'Access denied - token');
        if (!isset($alias))
            return $this->sendError(401, 'Access denied - data');  
           
            
        if ((!isset($alias['mail'])) || (!isset($alias['alias'])) )
            return $this->sendError(401, 'Access denied - alias data');

        $sess = new SessionController();
        $res = $sess->isAuthClient($token);
        if ($res == false)
            return $this->sendError(401, 'Access denied - wrong token');

        $db = new DB();
        $conn = $db->getConnection();
        if ($conn == null)
            return $this->sendError(501, $db->getLastError());

        $address = $alias['alias'];
        $forward = $alias['mail'];
        $account_id = $this->getAccountId($db, $conn, $forward);

        $query = '';

        try {
            $query = "INSERT INTO mail_forwardings (account_id,address,forwarding,alias) VALUES (:ACCOUNTID,:ALIASNAME,:MAIL,1);";
            $sth = $db->prepare($conn, $query);

            $sth->bindValue(':ALIASNAME', $address, PDO::PARAM_STR);
            $sth->bindValue(':MAIL', $forward, PDO::PARAM_STR);
            $sth->bindValue(':ACCOUNTID', $account_id, PDO::PARAM_INT);

            $sth->execute();

            $alias_id = $db->GetLastInsertId($conn);
         
            $retAlias['id'] = $alias_id;
            $retAlias['alias'] = $address;


            return $this->sendResult(201, $retAlias);
        } catch (Exception $e) {
            if (str_contains($e,'Duplicate entry'))
                $this->sendError(409, "Duplikacja aliansu: Podanany alias  został wcześniej wprowadzony.");    
            else                
                $this->sendError(501, "Error SQL:" . $e);
            return;
        }
    }


    public function removeAlias($token, $alias){
        if (!isset($token))
            return $this->sendError(401, 'Access denied - token');
        if (!isset($alias))
            return $this->sendError(401, 'Access denied - data');  
           
            
        if ((!isset($alias['mail'])) || (!isset($alias['alias'])) )
            return $this->sendError(401, 'Access denied - alias data');

        $sess = new SessionController();
        $res = $sess->isAuthClient($token);
        if ($res == false)
            return $this->sendError(401, 'Access denied - wrong token');

        $db = new DB();
        $conn = $db->getConnection();
        if ($conn == null)
            return $this->sendError(501, $db->getLastError());

        $address = $alias['alias'];
        $forward = $alias['mail'];
        $account_id = $this->getAccountId($db, $conn, $forward);

        $query = '';

        try {
            $query = "DELETE FROM  mail_forwardings WHERE (account_id=:ACCOUNTID AND address=:ALIASNAME);";
            $sth = $db->prepare($conn, $query);

            $sth->bindValue(':ALIASNAME', $address, PDO::PARAM_STR);
            $sth->bindValue(':ACCOUNTID', $account_id, PDO::PARAM_INT);

            $sth->execute();

            if ($sth->rowCount() == 1){
                $retAlias['alias'] = $address;
                return $this->sendResult(200, $retAlias);
            }
                else {
                    $error = "Alians nie został usunięty.";
                    $this->sendError(404, $error);
                } 
        } catch (Exception $e) {
            if (str_contains($e,'Duplicate entry'))
                $this->sendError(409, "Duplikacja aliansu: Podanany alias  został wcześniej wprowadzony.");    
            else                
                $this->sendError(501, "Error SQL:" . $e);
            return;
        }
    }
  


}

?>