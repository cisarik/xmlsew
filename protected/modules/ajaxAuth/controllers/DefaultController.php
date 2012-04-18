<?php

class DefaultController extends Controller
{
	public function actionLogin()
	{
		$this->renderPartial('login');
	}

	public function actionIndex()
	{
		$this->render('index');
	}
}