<?php

/**
 * LoginForm class.
 * LoginForm is the data structure for keeping
 * user login form data. It is used by the 'login' action of 'SiteController'.
 */
class NewpasswordForm extends CFormModel
{
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
			array('password1, password2', 'required'),
			// rememberMe needs to be a boolean
			array('password1', 'compare', 'compareAttribute' => 'password2'),
			// password needs to be authenticated
			array('password1', 'length', 'min'=>3),
		);
	}
	
	public function setnewpassword($keychain){
		$oldkeychain=Forgottenpasswordkeychain::model()->findByAttributes(array('keychain'=>$keychain));
		
		if (sizeof($oldkeychain)==0) {
			$this->addError('keychain','Invalid keychain.');
			return false;
		}
		
		$newpassword=User::model()->getHash($this->password1);
		$sql = 'UPDATE xmlsew_user SET password=:password WHERE id=:id';
		$parameters = array(':password'=>$newpassword,":id"=>$oldkeychain['id_user']);
		Yii::app()->db->createCommand($sql)->execute($parameters);

		$sql = "DELETE FROM xmlsew_forgottenpasswordkeychain WHERE id=:id";
		$parameters = array(":id"=>$oldkeychain['id']);
		Yii::app()->db->createCommand($sql)->execute($parameters);
			
		return true;
	}
	
	public function passwordchanged(){
	
		
		
		$newpassword=User::model()->getHash($this->password1);
		$sql = 'UPDATE xmlsew_user SET password=:password WHERE id=:id';
		$parameters = array(':password'=>$newpassword,":id"=>Yii::App()->user->id);
		Yii::app()->db->createCommand($sql)->execute($parameters);
		
		return true;
	}
}
