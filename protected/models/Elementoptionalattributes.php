<?php

/**
 * This is the model class for table "xmlsew_elementoptionalattributes".
 *
 * The followings are the available columns in table 'xmlsew_elementoptionalattributes':
 * @property string $id
 * @property string $id_attribute
 * @property string $id_element
 *
 * The followings are the available model relations:
 * @property Element $idElement
 * @property Attribute $idAttribute
 */
class Elementoptionalattributes extends CActiveRecord
{
	/**
	 * Returns the static model of the specified AR class.
	 * @param string $className active record class name.
	 * @return Elementoptionalattributes the static model class
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
		return 'xmlsew_elementoptionalattributes';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('id_attribute, id_element', 'required'),
			array('id_attribute, id_element', 'length', 'max'=>11),
			// The following rule is used by search().
			// Please remove those attributes that should not be searched.
			array('id, id_attribute, id_element', 'safe', 'on'=>'search'),
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
			'idAttribute' => array(self::BELONGS_TO, 'Attribute', 'id_attribute'),
		);
	}

	/**
	 * @return array customized attribute labels (name=>label)
	 */
	public function attributeLabels()
	{
		return array(
			'id' => 'ID',
			'id_attribute' => 'Id Attribute',
			'id_element' => 'Id Element',
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
		$criteria->compare('id_attribute',$this->id_attribute,true);
		$criteria->compare('id_element',$this->id_element,true);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}
}