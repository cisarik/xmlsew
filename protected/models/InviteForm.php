<?php

/**
 * LoginForm class.
 * LoginForm is the data structure for keeping
 * user login form data. It is used by the 'login' action of 'SiteController'.
 */
class InviteForm extends CFormModel
{
	public $emails;
	private $_emailsarray;
	
	function randomKeychain($l = 32)
	{
	    $c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	    srand((double)microtime()*1000000);
	    $randStr = '';
	    for ($i = 0; $i < $l; $i++) {
	        $randomNumber = rand(1, 30123);
	        $randStr .= $c[($randomNumber % strlen($c))];
	    }
	    return $randStr;
	}
	
	public function rules()
	{
		return array(
			// username and password are required
			array('emails', 'required'),
		);
	}
	
	public function checkemails(){
		$all=explode("\n",$this->emails);

		$validator = new CEmailValidator;
		$validated='';
		$registered='';
		
		for ($i = 0; $i != sizeof($all); $i++){
			if(!$validator->validateValue(trim($all[$i])))
				$validated.=trim($all[$i]).', ';
				
			if (User::model()->exists('email="'.trim($all[$i]).'"')) 
				$registered.=trim($all[$i]).', ';
		}
		
		if ($validated!=='') {
			$validated=substr($validated,0,-2);
			$this->addError('emails',$validated.' not valid!');
			return false;
		}
		
		if ($registered!==''){
			$registered=substr($registered,0,-2);
			$this->addError('emails',$registered.' already registered or invited.');
			return false;
		}
		
		$this->_emailsarray=$all;
		
		return true;
	}
	
	public function sent() {
		for ($i = 0; $i != sizeof($this->_emailsarray); $i++){
	
			$sql = "INSERT INTO xmlsew_user (`id_role`, `email`, `password`, `name`, `member_since`, `status`) VALUES (2,:email,'','','','blocked')";
			$parameters = array(":email"=>$this->_emailsarray[$i]);
			Yii::app()->db->createCommand($sql)->execute($parameters);
			
			$user=User::model()->findByAttributes(array('email'=>$this->_emailsarray[$i]));
			$keychain=$this->randomKeychain(64);
	
			$sql = "INSERT INTO xmlsew_invitationkeychain (`id_user`,`keychain`) VALUES (:id,:keychain)";
			$parameters = array(":id"=>$user['id'],':keychain'=>$keychain);
			Yii::app()->db->createCommand($sql)->execute($parameters);
			
			
			$headers="From: cisary@me.com\r\nReply-To: cisary@me.com";
		
			$subject='Invitation';
		
			$body=<<<EOT
Greetings,

You have been invited to join xmlsew.cisary.com 

To create your account, please click the following link, or copy and paste it
into your web browser:

http://localhost/xmlsew/index.php?r=site/newaccount&keychain=$keychain

Best regards,
	cisary.com management
EOT;
		
			mail($this->_emailsarray[$i],$subject,$body,$headers);
			
		}
		
		return true;
	}
}
