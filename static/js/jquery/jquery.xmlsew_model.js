/*
File: static/js/jquery/jquery-xmlsew.js

Official site:
-<http://xmlsew.cisary.com/>

Author:
-cisary@me.com>
*/

(function($) { 
"use strict"

var COMMON_DATATYPES=['xs:string','xs:decimal','xs:boolean','xs:float','xs:double','xs:duration','xs:dateTime','xs:time','xs:date','xs:gYearMonth','xs:gYear',
	'xs:gMonthDay','xs:gDay','xs:gMonth','xs:hexBinary','xs:base64Binary','xs:anyURI','xs:NOTATION','xs:normalizedString','xs:token','xs:language','xs:NMTOKEN','xs:NMTOKENS',
	'xs:name','xs:NCName','xs:ID','xs:IDREF','xs:IDREFS','xs:ENTITY','xs:ENTITIES','xs:integer','xs:nonPositiveInteger','xs:negativeInteger','xs:long','xs:unsignedLong',
	'xs:int','xs:unsignedInt','xs:short','xs:unsignedShort','xs:byte','xs:unsignedByte','xs:nonNegativeInteger','xs:positiveInteger']

$.Class("XMLsew",{
	setup : function(el){
		arguments[0] = jQuery(el)
		return arguments
	}
})

XMLsew('XMLSchemaEditorWidget.Model',{
	init : function(args){
		this.arguments = args
	},
	  
})

XMLSchemaEditorWidget.Model("XMLSchemaEditorWidget.Model.Datatypes",
{
	defaults:{
		'xs\\:schema':{'attributeFormDefault':["qualified","unqualified"],
			'blockDefault':["extension","restriction","substitution","#all"],
			'elementFormDefault':["qualified","unqualified"],
			'finalDefault':["extension","restriction","list","union","#all"]
		},
		
		'xs\\:element':{'type':COMMON_DATATYPES,
			'block':["extension","restriction","substitution","#all"],
			'abstract':["true","false"],
			'final':["extension","restriction","#all"],
			'form':["qualified","unqualified"],
			'nillable':["true","false"],
		},
		
		'xs\\:attribute':{'form':["qualified","unqualified"],
			'use':["optional","prohibited","required"],
		},
		
		'xs\\:simpleType':{'final':["restriction","list","union","#all"]},
		
		'xs\\:complexType':{'abstract':["true","false"],
			'block':["extension","restriction","#all"],
			'final':["extension","restriction","#all"],
			'mixed':["true","false"],
		},
		
		'xs\\:any':{'namespace':["##any","##other","##local","##targetNamespace"],
			'processContents':["strict","lax","skip"],
		},
		
		'xs\\:anyAttribute':{'namespace':["##any","##other","##local","##targetNamespace"],
			'processContents':["strict","lax","skip"],
		},
		
		'xs\\:restriction':{'base':COMMON_DATATYPES},
		
		'xs\\:extension':{'base':COMMON_DATATYPES},
		
	}
},
{
	custom:{},
	
	getDefaults:function(element,attribute){
		if (this.Class.defaults[element]==undefined)
			return []
		else if (this.Class.defaults[element][attribute]==undefined)
			return []
		else 
			return this.Class.defaults[element][attribute]
	},
	
	getCustom:function(element,attribute){
		if (this.custom[element]==undefined)
			return []
		else if (this.custom[element][attribute]==undefined)
			return []
		else 
			return this.custom[element][attribute]
	},
	
	setCustom:function(datatypes){
		this.custom=datatypes
	}
})


XMLSchemaEditorWidget.Model('XMLSchemaEditorWidget.Model.XMLSchemaElement',
// static 'Class' property for saving all element types fetched from json file
{
  parsedJSON:{}
},
// Instance's properties and functions
{
	element :{},
	attributes :{},
	children:[],

	// constructor function attributes: el- div element of XMLSchemaElement object and its parameters
	init : function(el,attributes){
		this.element = el
		this.attributes = attributes
		this.children=[]
	},
	
	addChild : function(obj) {
		obj.children.push(this)
	},
	
	removeChild :function(obj) {
		for(var m=0; m<obj.children.length; m++) 	
			if (obj.children[m]==this)
				obj.children.splice(m, 1)
	}
})

})(jQuery)/* end of auto launched $ function in the jQuery namespace */
