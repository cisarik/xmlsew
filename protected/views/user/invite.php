<?php
$this->pageTitle=Yii::app()->name . ' - Invite users';
$this->breadcrumbs=array(
'Users'=>array('index'),
	'Invite',
);

$this->menu=array(
	array('label'=>'Invite Users', 'url'=>array('invite')),
	array('label'=>'Create User', 'url'=>array('create')),
	array('label'=>'Manage Users', 'url'=>array('index')),
);
?>

<h1>Invite users</h1>

<?php if(Yii::app()->user->hasFlash('invite')): ?>

<div class="flash-success">
	<?php echo Yii::app()->user->getFlash('invite'); ?>
</div>

<?php else: ?>

<p>
Insert email addresses of users you would like to invite for registration:
</p>

<div class="form">

<?php $form=$this->beginWidget('CActiveForm', array(
	'id'=>'invite-form',
	'enableClientValidation'=>true,
	'clientOptions'=>array(
		'validateOnSubmit'=>true,
	),
)); ?>

	<p class="note">Fields with <span class="required">*</span> are required.</p>

	<div class="row">
		<?php echo $form->labelEx($model,'emails'); ?>
		<?php echo $form->textArea($model,'emails',array('rows' => 10, 'cols' => 30)); ?>
		<?php echo $form->error($model,'emails'); ?>
	</div>

	<div class="row buttons">
		<?php echo CHtml::submitButton('Submit'); ?>
	</div>

<?php $this->endWidget(); ?>

</div><!-- form -->

<?php endif; ?>