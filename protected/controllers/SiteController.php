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
	
	public function actionChangepassword()
	{
		if(isset($_POST['ajaxrequest']))
		{
			$model=new NewpasswordForm;
			$model->attributes=$_POST['NewpasswordForm'];
			if($model->validate() && $model->passwordchanged()) {
				$response=array();
				$response['status']='OK';
		
				$response=CJavaScript::jsonEncode($response);
				$this->renderPartial('json',array('json'=>$response), false, true);
				Yii::app()->end();
			} else {
				$response=array();
				$response['status']='ERROR';
				
				$errors=$model->getErrors();
				$message="<p>";
				foreach ( $errors as $attribute => $error) {
					$message.=$error[0]."<br>";
				}
				$message.="</p>";
				$response['message']=$message;
		
				$response=CJavaScript::jsonEncode($response);
				$this->renderPartial('json',array('json'=>$response), false, true);
				Yii::app()->end();
			}
			
		}
		$action='showChangePassword();';
		$this->renderPartial('main',array('action'=> $action),false, true);
	}
	
	public function actionNewpassword()
	{
		if(isset($_POST['ajaxrequest']))
		{
			$model=new NewpasswordForm;
			$model->attributes=$_POST['NewpasswordForm'];
			if($model->validate() && $model->setnewpassword($_POST['keychain'])) {
				$response=array();
				
				
				$response['status']='OK';
		
				$response=CJavaScript::jsonEncode($response);
				$this->renderPartial('json',array('json'=>$response), false, true);
				Yii::app()->end();
			} else {
				$response=array();
				$response['status']='ERROR';
				
				$errors=$model->getErrors();
				$message="<p>";
				foreach ( $errors as $attribute => $error) {
					$message.=$error[0]."<br>";
				}
				$message.="</p>";
				$response['message']=$message;
		
				$response=CJavaScript::jsonEncode($response);
				$this->renderPartial('json',array('json'=>$response), false, true);
				Yii::app()->end();
			}
		}
		$key=Yii::app()->request->getQuery('keychain');
		$action='showNewPassword(\"'.$key.'\");';
		$this->renderPartial('main',array('action'=> $action),false, true);
	}
	
	public function actionForgottenpassword()
	{
		if(isset($_POST['ajaxrequest']))
		{
			$model=new ForgottenpasswordForm;
			$model->attributes=$_POST['ForgottenpasswordForm'];
			
			if($model->validate() && $model->sent()) {
				$response=array();
				$response['status']='OK';
		
				$response=CJavaScript::jsonEncode($response);
				$this->renderPartial('json',array('json'=>$response), false, true);
				Yii::app()->end();
			} else {
				$response=array();
				$response['status']='ERROR';
				
				$errors=$model->getErrors();
				$message="<p>";
				foreach ( $errors as $attribute => $error) {
					$message.=$error[0]."<br>";
				}
				$message.="</p>";
				$response['message']=$message;
		
				$response=CJavaScript::jsonEncode($response);
				$this->renderPartial('json',array('json'=>$response), false, true);
				Yii::app()->end();
			}
		}
		
		$this->renderPartial('main',array('action'=> 'showForgottenPassword();'),false, true);
		
	}

	/**
	 * This is the default 'index' action that is invoked
	 * when an action is not explicitly requested by users.
	 */
	public function actionIndex()
	{
		
		$action="";
		if ((Yii::app()->user->getModel()->role['name']==='user') || (Yii::app()->user->getModel()->role['name']==='administrator')) {
			$action="$('body').xmlsew();";
		}
		else
			$action="showLogin();";
			
	
		$this->renderPartial('main',array('action'=> $action),false, true);
		
		//$this->render('index');
		Yii::app()->end();
		
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
	
	public function actionAdmin()
	{
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
	
	public function actionInvite()
	{
		$model=new InviteForm;
		if(isset($_POST['InviteForm']))
		{
			$model->attributes=$_POST['InviteForm'];
			if($model->validate() && $model->checkemails() && $model->sent())
			{
				//$headers="From: {$model->email}\r\nReply-To: {$model->email}";
				//mail(Yii::app()->params['adminEmail'],$model->subject,$model->body,$headers);
				Yii::app()->user->setFlash('invite','Invitations sent!');
				$this->refresh();
			}
		}
		$this->render('invite',array('model'=>$model));
	}
	
	public function actionNewaccount()
	{
		$model=new NewaccountForm;
		if(isset($_POST['NewaccountForm']))
		{
			$model->attributes=$_POST['NewaccountForm'];
			if($model->validate() && $model->created($_POST['keychain']))
			{
				$response=array();
				$response['status']='OK';
		
				$response=CJavaScript::jsonEncode($response);
				$this->renderPartial('json',array('json'=>$response), false, true);
				Yii::app()->end();
			} else {
				$response=array();
				$response['status']='ERROR';
				
				$errors=$model->getErrors();
				$message="<p>";
				foreach ( $errors as $attribute => $error) {
					$message.=$error[0]."<br>";
				}
				$message.="</p>";
				$response['message']=$message;
		
				$response=CJavaScript::jsonEncode($response);
				$this->renderPartial('json',array('json'=>$response), false, true);
				Yii::app()->end();
			}
			
		}
		$key=Yii::app()->request->getQuery('keychain');
		$action='showNewAccount(\"'.$key.'\");';
		$this->renderPartial('main',array('action'=> $action),false, true);
	}
	

	/**
	 * Displays the login page
	 */
	public function actionLogin()
	{
		$model=new LoginForm;

		// if it is ajax validation request
		if(isset($_POST['ajaxlogin']))
		{
			$model->attributes=$_POST['LoginForm'];
			// validate user input and redirect to the previous page if valid
			if($model->validate() && $model->login()) {
				$response=array();
				$response['status']='OK';
				
				$response=CJavaScript::jsonEncode($response);
				$this->renderPartial('json',array('json'=>$response), false, true);
				Yii::app()->end();
			}
			else {
				$response=array();
				$response['status']='ERROR';
				
				$errors=$model->getErrors();
				$message="<p>";
				foreach ( $errors as $attribute => $error) {
					$message.=$error[0]."<br>";
				}
				$message.="</p>";
				$response['message']=$message;
				
				$response=CJavaScript::jsonEncode($response);
				$this->renderPartial('json',array('json'=>$response), false, true);
				Yii::app()->end();
			}
		
		}

		// collect user input data
		if(isset($_POST['LoginForm']))
		{
			$model->attributes=$_POST['LoginForm'];
			// validate user input and redirect to the previous page if valid
			if($model->validate() && $model->login()) {
				
				//$this->render('login',array('model'=>$model));
				$this->redirect(Yii::app()->user->returnUrl);
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