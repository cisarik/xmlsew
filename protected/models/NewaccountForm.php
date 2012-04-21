<?php

/**
 * LoginForm class.
 * LoginForm is the data structure for keeping
 * user login form data. It is used by the 'login' action of 'SiteController'.
 */
class NewaccountForm extends CFormModel
{
	public $username;
	public $password1;
	public $password2;

	/**
	 * Declares the validation rules.
	 * The rules state that username and password are required,
	 * and password needs to be authenticated.
	 */
	public function rules()
	{
		return array(
			// username and password are required
			array('password1, password2, username', 'required'),
			// rememberMe needs to be a boolean
			array('password1', 'compare', 'compareAttribute' => 'password2'),
			// password needs to be authenticated
			array('password1', 'length', 'min'=>3),
		);
	}
	
	public function created($keychain){

		if (!(Invitationkeychain::model()->exists('keychain="'.$keychain.'"'))) {
			$this->addError('keychain','Invalid keychain.');
			return false;
		}
		
		if (User::model()->exists('name="'.$this->username.'"')) {
			$this->addError('username','Username already registered.');
			return false;
		}
		
		$password=User::model()->getHash($this->password1);
		
		$oldkeychain=Invitationkeychain::model()->findByAttributes(array('keychain'=>$keychain));
		
		$currentdate=date("Y-m-d");
		
		$sql = "UPDATE xmlsew_user SET password=:password, name=:username, member_since=:date, status='active' WHERE id=:id";
		$parameters = array(':password'=>$password,':username'=>$this->username,":date"=>$currentdate,":id"=>$oldkeychain['id_user']);
		Yii::app()->db->createCommand($sql)->execute($parameters);
		
		$sql = "DELETE FROM xmlsew_invitationkeychain WHERE id=:id";
		$parameters = array(":id"=>$oldkeychain['id']);
		Yii::app()->db->createCommand($sql)->execute($parameters);
			
		return true;

	}
}
