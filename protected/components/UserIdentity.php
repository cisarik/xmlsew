<?php

class UserIdentity extends CUserIdentity
{
	private $_id;
	const ERROR_STATUS_BANNED = 5;
	
	public function getId()
	{
		return $this->_id;
	}
	
	public function authenticate()
	{
		$u = User::model()->findByAttributes( array('name'=>$this->username) );

		if (!$u)
			$this->errorCode = self::ERROR_USERNAME_INVALID;
		else if( !$u->matchesPassword($this->password) )
			$this->errorCode = self::ERROR_PASSWORD_INVALID;
		else if( $u->status == 'blocked')
			$this->errorCode = self::ERROR_STATUS_BANNED;
		else
		{
			$this->_id = $u->id;
			$this->username = $u->name;
			//$this->setState('id', $user->model->id);
			$this->errorCode = self::ERROR_NONE;
		}
		
		return !$this->errorCode;
	}
}