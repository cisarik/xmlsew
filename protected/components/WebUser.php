<?php

class WebUser extends CWebUser
{
	protected $_model = null;
	
	public function getModel()
	{
		if (!$this->_model)
		{
			if ($this->id) $this->_model = User::model()->findByPk($this->id);
			else $this->_model = User::model();
		}
		
		return $this->_model;
	}
	
	public function checkAccess($operation, $params = array(), $allowCaching = true)
	{
		return ($this->getModel()->role->name == $operation);
	}
}