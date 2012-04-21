<?php

class User extends CActiveRecord
{
	protected $_oldPassword;
	
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}

	public function tableName()
	{
		return 'xmlsew_user';
	}

	public function rules()
	{
		$rules = array(
			array('id_role, email, password, name, member_since', 'required'),
			array('id_role', 'in', 'range'=>array_keys(CHtml::listData(Role::model()->findAll(), 'id', 'name')), 'allowEmpty'=>false),
			array('status', 'in', 'range'=>array('blocked', 'active'), 'allowEmpty'=>false),
			array('email', 'email'),
			array('email, password, name', 'length', 'max'=>32),
			array('id, id_role, email, password, name, member_since, status', 'safe', 'on'=>'search'),
		);
		
		if ($this->getIsNewRecord()) $rules[] = array('password', 'required');
		
		return $rules;
	}

	public function relations()
	{
		return array(
			'role' => array(self::BELONGS_TO, 'Role', 'id_role'),
		);
	}

	public function attributeLabels()
	{
		return array(
			'id' => 'ID',
			'id_role' => 'Role',
			'email' => 'Email',
			'password' => 'Password',
			'name' => 'Name',
			'member_since' => 'Member Since',
			'status' => 'Status',
		);
	}

	public function search()
	{
		$criteria=new CDbCriteria;

		$criteria->compare('id',$this->id);
		$criteria->compare('id_role',$this->id_role);
		$criteria->compare('email',$this->email,true);
		$criteria->compare('password',$this->password,true);
		$criteria->compare('name',$this->name,true);
		$criteria->compare('member_since',$this->member_since,true);
		$criteria->compare('status',$this->status,true);

		return new CActiveDataProvider(get_class($this), array(
			'criteria'=>$criteria,
		));
	}
	
	public function getHash($password)
	{
		return md5("this is salt string for xmlsew" . $password);
	}
	
	public function matchesPassword($password)
	{
		return ($this->getHash($password) == $this->_oldPassword);
	}
	
	function afterFind()
	{
		if ($this->member_since == '0000-00-00')
			$this->member_since = '';
		else
			$this->member_since = date("j.n.Y", strtotime($this->member_since));
		
		$this->_oldPassword = $this->password;
		$this->password = '';
		
		return parent::afterFind();
	}
	
	function beforeSave()
	{
		if (strtotime($this->member_since))
			$this->member_since = date("Y-m-d", strtotime($this->member_since));
		else
			$this->member_since = '0000-00-00';
		
		if (!$this->password)
			$this->password = $this->_oldPassword;
		else
			if ($this->_oldPassword != $this->password) $this->password = $this->getHash($this->password);

		return parent::beforeSave();
	}
}