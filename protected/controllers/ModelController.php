<?php

class ModelController extends Controller
{

	public function actionGet()
	{
		$response = Yii::app()->cache->get('json_model');
		
		if ($response === false)
		{
			
			$elements=Element::model()->findAll();
			$allelements=array();
			$alldefaultvalues=array();
			
			for ($i = 0; $i != sizeof($elements); $i++){
				$el=array();
				$el['escapedName']='xs\:'.$elements[$i]['name'];
				
				$childrenelements=Elementchildren::model()->findAllByAttributes(array('id_element'=>$elements[$i]['id']));
				$children=array();
				for ($j = 0; $j != sizeof($childrenelements); $j++){
					$childrenelement=Element::model()->findByAttributes(array('id'=>$childrenelements[$j]['id_elementchildren']));
					$children[]='xs\:'.str_replace('_', '',$childrenelement['name']);
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
					$alldefaultvalues['xs\:'.$elements[$i]['name']]=$attributesvalues;
				}
	        }
	        
	        $data=Yii::app()->request->getQuery('data');
	
	        $allelements["XMLSchemaEditorWidget.Model.extension"]["escapedName"]="xs\:extension";
	        $allelements["XMLSchemaEditorWidget.Model.extension_simpleContent"]["escapedname"]="";
	        $allelements["XMLSchemaEditorWidget.Model.extension_complexContent"]["escapedname"]="";
	        
	        $allelements["XMLSchemaEditorWidget.Model.restriction"]["escapedName"]="xs\:restriction";
	        $allelements["XMLSchemaEditorWidget.Model.restriction_simpleContent"]["escapedName"]="";
	        $allelements["XMLSchemaEditorWidget.Model.restriction_complexContent"]["escapedName"]="";
	        $allelements["XMLSchemaEditorWidget.Model.restriction_simpleType"]["escapedName"]="";
	        
	        $allelements["XMLSchemaEditorWidget.Model._length"]["escapedName"]="xs\:length";
	        $allelements["XMLSchemaEditorWidget.Model._whiteSpace"]["escapedName"]="xs\:whiteSpace";
		
			$attributesvalues=array();
			
			$defaultvalues=Elementattributedefaultvalues::model()->findAllByAttributes(array('id_element'=>9,'id_attribute'=>31));
				
				$attributevalues=array();
				for ($j = 0; $j != sizeof($defaultvalues); $j++){
					$defaultattributevalue=Attributedefaultvalue::model()->findByAttributes(array('id'=>$defaultvalues[$j]['id_attributedefaultvalue']));
					$attributevalues[]=$defaultattributevalue['name'];
				}
				
			$attributesvalues['base']=$attributevalues;
				
			$alldefaultvalues['xs\:restriction']=$attributesvalues;
			$alldefaultvalues['xs\:extension']=$attributesvalues;
			
			$response=array();
			$response['defaultvalues']=$alldefaultvalues;
			$response['elements']=$allelements;
			$response = json_encode($response);
			
			Yii::app()->cache->set('json_model', $response);
		}
		
		$this->renderPartial('json',array('json'=>$response), false, true);

		Yii::app()->end();
	}
	
	public function filters()
	{
	        return array(
	                'accessControl',
	        );
	}
	
	public function accessRules()
	{
	        return array(
	                array('allow',
	                        'actions'=>array('get'),
	                        'roles'=>array('user','administrator'),
	                ),
	       
	                array('deny',
	                        'users'=>array('*'),
	                ),
	        );
	}
}