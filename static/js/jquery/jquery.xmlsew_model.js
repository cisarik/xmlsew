/*
File: static/js/jquery/jquery-xmlsew.js

Official site:
-<http://xmlsew.cisary.com/>

Author:
-cisary@me.com>
*/

(function($) { 
"use strict"

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
	defaults:{}
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
