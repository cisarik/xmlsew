<?php

/**
 * This is the model class for table "xmlsew_elementchildren".
 *
 * The followings are the available columns in table 'xmlsew_elementchildren':
 * @property string $id
 * @property string $id_element
 * @property string $id_elementchildren
 *
 * The followings are the available model relations:
 * @property Element $idElement
 * @property Element $idElementchildren
 */
class Elementchildren extends CActiveRecord
{
	/**
	 * Returns the static model of the specified AR class.
	 * @param string $className active record class name.
	 * @return Elementchildren the static model class
	 */
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}
	
	/**
	 * @return string the associated database table name
	 */
	public function tableName()
	{
		return 'xmlsew_elementchildren';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array( 'id_elementchildren', 'required'),
			array('id_elementchildren', 'length', 'max'=>11),
			// The following rule is used by search().
			// Please remove those attributes that should not be searched.
			array('id, id_element, id_elementchildren', 'safe', 'on'=>'search'),
		);
	}

	/**
	 * @return array relational rules.
	 */
	public function relations()
	{
		// NOTE: you may need to adjust the relation name and the related
		// class name for the relations automatically generated below.
		return array(
			'idElement' => array(self::BELONGS_TO, 'Element', 'id_element'),
			'idElementchildren' => array(self::BELONGS_TO, 'Element', 'id_elementchildren'),
		);
	}

	/**
	 * @return array customized attribute labels (name=>label)
	 */
	public function attributeLabels()
	{
		return array(
			'id' => 'ID',
			'id_element' => 'Id Element',
			'id_elementchildren' => 'Id Elementchildren',
		);
	}

	/**
	 * Retrieves a list of models based on the current search/filter conditions.
	 * @return CActiveDataProvider the data provider that can return the models based on the search/filter conditions.
	 */
	public function search()
	{
		// Warning: Please modify the following code to remove attributes that
		// should not be searched.

		$criteria=new CDbCriteria;

		$criteria->compare('id',$this->id,true);
		$criteria->compare('id_element',$this->id_element,true);
		$criteria->compare('id_elementchildren',$this->id_elementchildren,true);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}
	
	function afterFind()
	{
		$childrenelements=Element::model()->findAllByAttributes(array('id'=>$this->id_elementchildren));
		$childrenelementnames='';
		for ($j = 0; $j != sizeof($childrenelements); $j++){
			$childrenelementnames.=$childrenelements[$j]['name'].', ';
		}
		
		$childrenelementnames=substr($childrenelementnames,0,-2);

		$this->id_elementchildren = $childrenelementnames;
		
		return parent::afterFind();
	}
	
	
}