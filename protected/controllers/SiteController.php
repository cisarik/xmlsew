<?php

class SiteController extends Controller
{

	private function ajaxOK()
	{
		$response=array();
		$response['status']='OK';
		$response=CJavaScript::jsonEncode($response);
		$this->renderPartial('json',array('json'=>$response), false, true);
		Yii::app()->end();
	}
	
	private function ajaxERROR($model)
	{	
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
				$this->ajaxOK();
			} else {
				$this->ajaxERROR($model);
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
				$this->ajaxOK();
				/*
				$response=array();
				
				
				$response['status']='OK';
		
				$response=CJavaScript::jsonEncode($response);
				$this->renderPartial('json',array('json'=>$response), false, true);
				Yii::app()->end();*/
			} else {
				$this->ajaxERROR($model);
				/*
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
				*/
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
				$this->ajaxOK();
				/*
				$response=array();
				$response['status']='OK';
		
				$response=CJavaScript::jsonEncode($response);
				$this->renderPartial('json',array('json'=>$response), false, true);
				Yii::app()->end();
				*/
			} else {
				$this->ajaxERROR($model);
				/*
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
				*/
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
		Yii::app()->end();
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
	
	public function actionNewaccount()
	{
		$model=new NewaccountForm;
		if(isset($_POST['NewaccountForm']))
		{
			$model->attributes=$_POST['NewaccountForm'];
			if($model->validate() && $model->created($_POST['keychain']))
			{
				$this->ajaxOK();
				/*
				$response=array();
				$response['status']='OK';
		
				$response=CJavaScript::jsonEncode($response);
				$this->renderPartial('json',array('json'=>$response), false, true);
				Yii::app()->end();*/
			} else {
				$this->ajaxERROR($model);
				/*
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
				*/
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
				$this->ajaxOK();
				/*
				$response=array();
				$response['status']='OK';
				
				$response=CJavaScript::jsonEncode($response);
				$this->renderPartial('json',array('json'=>$response), false, true);
				Yii::app()->end();
				*/
			}
			else {
				$this->ajaxERROR($model);
				/*
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
				*/
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
	
	public function filters()
	{
	    return array(
	        'https', // Force https
	        'accessControl',
	    );
	}
	
	public function accessRules()
	{
	        return array(
	        		array('allow',
						'actions'=>array('login','newaccount','contact','index','newpassword','forgottenpassword','error','admin','about','page','captcha'),
						'users'=>array('*'),
					),
	        
	                array('allow',
	                        'actions'=>array('logout','changepassword','invite'),
	                        'roles'=>array('user','administrator'),
	                ),
	       
	                array('deny',
	                        'users'=>array('*'),
	                ),
	        );
	}
}