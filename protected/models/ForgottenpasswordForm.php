<?php

/**
 * LoginForm class.
 * LoginForm is the data structure for keeping
 * user login form data. It is used by the 'login' action of 'SiteController'.
 */
class ForgottenpasswordForm extends CFormModel
{
	public $email;
	
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
	
	
	/**
	 * Declares the validation rules.
	 * The rules state that username and password are required,
	 * and password needs to be authenticated.
	 */
	public function rules()
	{
		return array(
			array('email', 'email'),
			array('email', 'required'),
			array('email', 'isregistered'),
		);
	}


	/**
	 * Authenticates the password.
	 * This is the 'authenticate' validator as declared in rules().
	 */
	public function isregistered($attribute,$params)
	{
		if (sizeof(User::model()->findByAttributes(array('email'=>$this->email)))==0) 
			$this->addError('email','Email is not registered.');
		
	}
	
	public function sent()
	{
		$user=User::model()->findByAttributes(array('email'=>$this->email));
		$username=$user['name'];
		
		$keychain=$this->randomKeychain(64);
	
		$sql = "insert into xmlsew_forgottenpasswordkeychain (`id_user`,`keychain`) values (:id,:keychain)";

		$parameters = array(":id"=>$user['id'],':keychain'=>$keychain);

		Yii::app()->db->createCommand($sql)->execute($parameters);
		
		
		
		$headers="From: webmaster@cisary.com\r\nReply-To: webmaster@cisary.com";
		
		$subject='Resetting your password';
		
		$body=<<<EOT
Greetings,

You are receiving this email because you (or someone pretending to be you) requested that your password be reset on the xmlsew.cisary.com site.  If you do not 
wish to reset your password, please ignore this message.

To reset your password, please click the following link, or copy and paste it
into your web browser:

https://xmlsew.cisary.com/index.php?r=site/newpassword&keychain=$keychain

Your username, in case you've forgotten: $username

Best regards,
	cisary.com management
EOT;
		
		mail($this->email,$subject,$body,$headers);
	
		return true;
	}
}
