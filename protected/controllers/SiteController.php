<?php

class SiteController extends Controller
{



	/**
	 * Declares class-based actions.
	 */
	public function actions()
	{
		return array(
			// captcha action renders the CAPTCHA image displayed on the contact page
			'captcha'=>array(
				'class'=>'CCaptchaAction',
				'backColor'=>0xFFFFFF,
			),
			// page action renders "static" pages stored under 'protected/views/site/pages'
			// They can be accessed via: index.php?r=site/page&view=FileName
			'page'=>array(
				'class'=>'CViewAction',
			),
		);
	}

	/**
	 * This is the default 'index' action that is invoked
	 * when an action is not explicitly requested by users.
	 */
	public function actionIndex()
	{
	
		
		$elements=Element::model()->findAll();
		$allelements=array();
		$alldefaultvalues=array();
		
		for ($i = 0; $i != sizeof($elements); $i++){
			$el=array();
			$el['escapedname']='xs\\:'.$elements[$i]['name'];
			
			$childrenelements=Elementchildren::model()->findAllByAttributes(array('id_element'=>$elements[$i]['id']));
			$children=array();
			for ($j = 0; $j != sizeof($childrenelements); $j++){
				$childrenelement=Element::model()->findByAttributes(array('id'=>$childrenelements[$j]['id_elementchildren']));
				$children[]='xs\\:'.$childrenelement['name'];
			}
			$el['children']=$children;
			
			$allatributes=array();
			$elementoptionalattributes=Elementoptionalattributes::model()->findAllByAttributes(array('id_element'=>$elements[$i]['id']));
			$optionalattributes=array();
			for ($j = 0; $j != sizeof($elementoptionalattributes); $j++){
				$optionalattribute=Attribute::model()->findByAttributes(array('id'=>$elementoptionalattributes[$j]['id_attribute']));
				$optionalattributes[]=$optionalattribute['name'];
				$allatributes[$optionalattribute['id']]=$optionalattribute['name'];
			}
			
			$elementrequiredattributes=Elementrequiredattributes::model()->findAllByAttributes(array('id_element'=>$elements[$i]['id']));
			$requiredattributes=array();
			for ($j = 0; $j != sizeof($elementrequiredattributes); $j++){
				$requiredattribute=Attribute::model()->findByAttributes(array('id'=>$elementrequiredattributes[$j]['id_attribute']));
				$requiredattributes[]=$requiredattribute['name'];
				$allatributes[$requiredattribute['id']]=$requiredattribute['name'];
			}
			
			$attributes=array();
			$attributes['optional']=$optionalattributes;
			$attributes['required']=$requiredattributes;
			$el['attributes']=$attributes;
			$allelements['XMLSchemaEditorWidget.Model.'.$elements[$i]['name']]=$el;
			
			
			$attributesvalues=array();
			foreach ( $allatributes as $attributeid => $attributename) {
				$defaultvalues=Elementattributedefaultvalues::model()->findAllByAttributes(array('id_element'=>$elements[$i]['id'],'id_attribute'=>$attributeid));
				
				$attributevalues=array();
				for ($j = 0; $j != sizeof($defaultvalues); $j++){
					$defaultattributevalue=Attributedefaultvalue::model()->findByAttributes(array('id'=>$defaultvalues[$j]['id_attributedefaultvalue']));
					$attributevalues[]=$defaultattributevalue['name'];
				}
				
				if (sizeof($attributevalues)>0) {
					$attributesvalues[$attributename]=$attributevalues;
				}
			}
			
			if (sizeof($attributesvalues)>0) {
				$alldefaultvalues['xs\\:'.$elements[$i]['name']]=$attributesvalues;
			}
        }

        $allelements = CJavaScript::jsonEncode($allelements);
        $alldefaultvalues = CJavaScript::jsonEncode($alldefaultvalues);
		
		//$this->renderPartial('json',array('json'=>$allelements), false, true);
		
		//$this->renderPartial('json',array('json'=>$alldefaultvalues), false, true);
				
		//Yii::app()->end();
	
		
	
		// renders the view file 'protected/views/site/index.php'
		// using the default layout 'protected/views/layouts/main.php'
		$this->render('index');
	}

	/**
	 * This is the action to handle external exceptions.
	 */
	public function actionError()
	{
		if($error=Yii::app()->errorHandler->error)
		{
			if(Yii::app()->request->isAjaxRequest)
				echo $error['message'];
			else
				$this->render('error', $error);
		}
	}

	/**
	 * Displays the contact page
	 */
	public function actionContact()
	{
		$model=new ContactForm;
		if(isset($_POST['ContactForm']))
		{
			$model->attributes=$_POST['ContactForm'];
			if($model->validate())
			{
				$headers="From: {$model->email}\r\nReply-To: {$model->email}";
				mail(Yii::app()->params['adminEmail'],$model->subject,$model->body,$headers);
				Yii::app()->user->setFlash('contact','Thank you for contacting us. We will respond to you as soon as possible.');
				$this->refresh();
			}
		}
		$this->render('contact',array('model'=>$model));
	}

	/**
	 * Displays the login page
	 */
	public function actionLogin()
	{
		$model=new LoginForm;

		// if it is ajax validation request
		if(isset($_POST['ajax']) && $_POST['ajax']==='login-form')
		{
			echo CActiveForm::validate($model);
			Yii::app()->end();
		}

		// collect user input data
		if(isset($_POST['LoginForm']))
		{
			$model->attributes=$_POST['LoginForm'];
			// validate user input and redirect to the previous page if valid
			if($model->validate() && $model->login()) {
				$this->renderPartial('logged');
				Yii::app()->end();
				}
		}
		// display the login form
		$this->render('login',array('model'=>$model));
	}

	/**
	 * Logs out the current user and redirect to homepage.
	 */
	public function actionLogout()
	{
		Yii::app()->user->logout();
		$this->redirect(Yii::app()->homeUrl);
	}
}