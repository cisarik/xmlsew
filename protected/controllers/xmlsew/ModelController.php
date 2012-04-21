<?php

class ModelController extends Controller
{
	public function stripslashes_if_gpc_magic_quotes( $string ) {
	    if(get_magic_quotes_gpc()) {
	        return stripslashes($string);
	    } else {
	        return $string;
	    }
	}

	public function actionElements()
	{
		$elements=Element::model()->findAll();
		$allelements=array();
		$alldefaultvalues=array();
		
		for ($i = 0; $i != sizeof($elements); $i++){
			$el=array();
			$el['escapedname']='xs\:'.$elements[$i]['name'];
			
			$childrenelements=Elementchildren::model()->findAllByAttributes(array('id_element'=>$elements[$i]['id']));
			$children=array();
			for ($j = 0; $j != sizeof($childrenelements); $j++){
				$childrenelement=Element::model()->findByAttributes(array('id'=>$childrenelements[$j]['id_elementchildren']));
				$children[]='xs\:'.$childrenelement['name'];
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
        
      // $a=array();
      // $a[]="xs\\:schema";
        
        //$allelements["XMLSchemaEditorWidget.Model.root"]["escapedname"]="root";
        
   		//$allelements["XMLSchemaEditorWidget.Model.root"]["children"]='xs\:schema';
        
        $allelements["XMLSchemaEditorWidget.Model.extension"]["escapedname"]="xs\:extension";
        $allelements["XMLSchemaEditorWidget.Model.extension_simpleContent"]["escapedname"]="";
        $allelements["XMLSchemaEditorWidget.Model.extension_complexContent"]["escapedname"]="";
        
        $allelements["XMLSchemaEditorWidget.Model.restriction"]["escapedname"]="xs\:restriction";
        $allelements["XMLSchemaEditorWidget.Model.restriction_simpleContent"]["escapedname"]="";
        $allelements["XMLSchemaEditorWidget.Model.restriction_complexContent"]["escapedname"]="";
        $allelements["XMLSchemaEditorWidget.Model.restriction_simpleType"]["escapedname"]="";
        
        
        
        
        
        $allelements=json_encode($allelements);

        //$allelements = CJavaScript::jsonEncode($allelements);
        //$alldefaultvalues = CJavaScript::jsonEncode($alldefaultvalues);
		
		$this->renderPartial('json',array('json'=>$allelements), false, true);
	}

	// Uncomment the following methods and override them if needed
	/*
	public function filters()
	{
		// return the filter configuration for this controller, e.g.:
		return array(
			'inlineFilterName',
			array(
				'class'=>'path.to.FilterClass',
				'propertyName'=>'propertyValue',
			),
		);
	}

	public function actions()
	{
		// return external action classes, e.g.:
		return array(
			'action1'=>'path.to.ActionClass',
			'action2'=>array(
				'class'=>'path.to.AnotherActionClass',
				'propertyName'=>'propertyValue',
			),
		);
	}
	*/
}