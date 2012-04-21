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

XMLsew('XMLSchemaEditorWidget.View.XMLSchema',
{
	getModelClass : function(element){
		var xmlsewclass
		$.each(XMLSchemaEditorWidget.Model.XMLSchemaElement.parsedJSON, function(key, val) {
    		if (element==(val['escapedName'])) {
    			eval("xmlsewclass="+key)
    		}
  		})
  		return xmlsewclass
	},

	appendAttribute: function(attributename,value,$parentelement) {
		var schema=this

		var $table=$.new$('table')
		var $tr=$.new$('tr')
		$table.append($tr)
		
		var $input=$.new$('input').attr({'type':'text','value':value})
		var parent=$parentelement.data('controller').Class.escapedName
		
		// set class of input for jquery selector for loading custom element types
		if ((parent=='xs\\:element') && (attributename=='type'))
			$input.addClass('xmlsew_element_type_input')
		
		var $td=$.new$('td').css('width','80px').css('text-align','left')
		var $b=$.new$('b').text(attributename).css('margin-left','13px')
		$td.append($b)
		$tr.append($td)

		$input.attr({'data-provide':'typeahead','data-items':'4','data-source':$.toJSON(this.datatypes.getDefaults(parent,attributename))})
		
		var $td2=$.new$('td')
		$td2.append($input)
		$tr.append($td2)

		var $button=$.new$('a').text('X').css({'margin-left':'5px','color':'black','font-weight':'bold','cursor':'default'})
		
		$table.hover(function(){
		
			$td2.append($button)
			$button.click(function(){
				
				$parentelement.data('availableAttributes').push($b.text())
				$tr.fadeOut(300, function() { $tr.remove() })

				for (var key in $parentelement.data('controller').attributes) 
					if (key==$b.text())
						delete $parentelement.data('controller').attributes[key]
				
				// reloading xml view because an attribute is being deleted
				schema.reloadXML()
			})
		},
		
		function(){
			$button.remove()
		})	
		
		// observe value of the input
		$input.change(function(event){
		
				// set timeout to check if value isn't going to change again
				// this is needed because of typeahead's plugin 
				// bug which triggers 'change' event before actual change 
				// so it has value of what user type not value chosen from typeahead menu
				setTimeout(function() {

					// get attributes from object assigned to element and change its value
					$parentelement.data('controller').attributes[$b.text()]=$input.attr('value')
				
					// reload xml view 
					schema.reloadXML()
				},700)
		})
		
		return $table
	},
	
	appendElement: function(modelClass,el,xml) {
		var parent=this
		var attributesArray=[]
		var optionalAttributesArray=[]
		var dict={}
		var availableAttributesArray=[]
		var $newElement = $.new$('div').addClass('sewElement')
		var $title=$.new$('div').addClass('sewElementTitle').text(modelClass.shortName)
		var $description = $.new$('div').addClass('sewElementContent')
		var $descriptionUl = $.new$('span').addClass('sewAttributeContent')
		
		// there are three types of restriction so change modelClass variable according to parent element
		if (modelClass==XMLSchemaEditorWidget.Model.restriction) {
		
				eval('modelClass=XMLSchemaEditorWidget.Model.restriction_'+el.Class.shortName)
				modelClass.escapedName="xs\\:restriction"
		}

		// change modelClass to right form according to parent element
		if (modelClass==XMLSchemaEditorWidget.Model.extension) {
				eval('modelClass=XMLSchemaEditorWidget.Model.extension_'+el.Class.shortName)
				modelClass.escapedName="xs\\:extension"
		}
		
		// create instation of modelClass for mapping element
		var a=new modelClass($newElement,dict)
		
		$description.append($descriptionUl)
		$newElement.append($description)
		$title.data('controller', a)
				
		for(var j=0; j<modelClass.attributes.required.length; j++) {
			attributesArray.push(modelClass.attributes.required[j])
		}
		
		if (xml!=undefined) {
			for(var j=0; j<modelClass.attributes.optional.length; j++) {
				attributesArray.push(modelClass.attributes.optional[j])
			}

			// bug of not adding custom namespace needed for import of other schema FIXED:
			if (modelClass==XMLSchemaEditorWidget.Model.schema) {
			
				// create regular expression for testing if attribute of schema is namespace
				var namespace=new RegExp("xmlns:")
				
				// for all attributes of the schema main element
				for(var u=0; u<$(xml)[0].attributes.length; u++) 
					// if regular expression returns true and namespace is not default "xmlns:xs" add it and its value as attribute
					if (namespace.test($(xml)[0].attributes[u].name) && ($(xml)[0].attributes[u].name!="xmlns:xs")) {
						$descriptionUl.append(this.appendAttribute($(xml)[0].attributes[u].name,$(xml).attr($(xml)[0].attributes[u].name),$title))
						
						// bug custom namespace xmlns:xxx not loaded but appended FIXED
						a.attributes[$(xml)[0].attributes[u].name]=$(xml).attr($(xml)[0].attributes[u].name)
					}

				this.targetnamespace=$(xml).attr('targetNamespace')
				this.$schemaroot=$title
				this.$schemaattributesroot=$descriptionUl
			}
		}
		else 
			for(var j=0; j<modelClass.attributes.optional.length; j++) {
				optionalAttributesArray.push(modelClass.attributes.optional[j])
			}
		
		if (xml!=undefined)
			for(var j=0; j<attributesArray.length; j++) 
				if (xml.attr(attributesArray[j])!=undefined) {
					dict[attributesArray[j]]=xml.attr(attributesArray[j])
					$descriptionUl.append(this.appendAttribute(attributesArray[j],xml.attr(attributesArray[j]),$title))
				}
				else 
					availableAttributesArray.push(attributesArray[j])
				
		else {
			for(var j=0; j<attributesArray.length; j++) {
				dict[attributesArray[j]]=''
				$descriptionUl.append(this.appendAttribute(attributesArray[j],'',$title))
			}
			for(var j=0; j<optionalAttributesArray.length; j++) 
				availableAttributesArray.push(optionalAttributesArray[j])
		}
		
		var $options=$.new$('span').addClass('sewElementContent')

		$title.append($options)
		
		var $newTitleIcon = $.new$('img').attr({'src':'static/png/'+modelClass.shortName.toLowerCase()+'.png'}).css({'float':'left','margin-left':'1px','margin-top':'1px'})
		var $deletebutton = $.new$('a').text('X').css({'float':'right','color':'white','font-weight':'bold','margin-right':'4px','cursor':'default'})
		
		$title.data('toggled',false)
		$title.click(function(){
			if ($(this).data('toggled')) {
				$(this).parent().find('div').slideDown('fast')
				$title.data('toggled',false)
				$(this).parent().find('hr').remove()
			}
			else {
				$newTitleIcon.attr({'src':'static/png/'+modelClass.shortName.toLowerCase()+'.png'})
				$(this).parent().find('div').slideUp('fast')
				$title.data('toggled',true)
				$(this).parent().append($.new$('hr'))
			}
		})
		
		$newTitleIcon.click(function(){
			if ($title.data('toggled')) {
			$newTitleIcon.attr({'src':'static/png/'+modelClass.shortName.toLowerCase()+'.png'})
			$title.parent().find('div').slideDown('fast')
			$title.data('toggled',false)
			$title.parent().find('hr').remove()
			
			}
		})
		
		$newTitleIcon.hover(function(){
			if ($title.data('toggled')) 
				$newTitleIcon.attr({'src':'static/png/'+modelClass.shortName.toLowerCase()+'_hover.png'})
			
		},
		function(){
			$newTitleIcon.attr({'src':'static/png/'+modelClass.shortName.toLowerCase()+'.png'})
		})
		
		
		$deletebutton.click(function(){
			$newElement.fadeOut(300, function() { $newElement.remove() })
			a.removeChild(el)
			parent.reloadXML()
		})
		
		$newElement.prepend($title)
		$newElement.prepend($newTitleIcon)
		
		if (modelClass!=XMLSchemaEditorWidget.Model.schema)
			$newElement.prepend($deletebutton)
		
		el.element.append($newElement)	
		
		a.addChild(el)

		$title.data('availableAttributes', availableAttributesArray)
		
		$title.hover(function(){
			$newTitleIcon.attr({'src':'static/png/'+modelClass.shortName.toLowerCase()+'_hover.png'})
			$(this).css({'background-color':'black'})
		
			var $elementsUl = $.new$('ul').addClass('dropdown').addClass('dropdown-horizontal').css({'margin-left':'-24px'})
			var $elementsTitle=$.new$('a').text('Add Element').addClass('dir')
			var $elementsUl2 =$.new$('ul')
			var $elementsLi2=$.new$('li')
			$elementsUl2.append($elementsLi2)
			var $elementsLi=$.new$('li').append($elementsTitle).append($elementsUl2)
			$elementsUl.append($elementsLi)
			
			var $attributesUl = $.new$('ul').addClass('dropdown').addClass('dropdown-horizontal')
			var $attributesTitle=$.new$('a').text('Add Atribute').addClass('dir')
			var $attributesUl2 =$.new$('ul')
			var $attributesLi2=$.new$('li')
			$attributesUl2.append($attributesLi2)
			var $attributesLi=$.new$('li').append($attributesTitle).append($attributesUl2)
			$attributesUl.append($attributesLi)
			
			var $obal=$.new$('div').addClass('blueBordered')
			$(this).find('span').append($obal)
		
			if ($(this).data('controller').Class.children.length>0) {
				for(var k=0; k<$(this).data('controller').Class.children.length; k++) {
					var $aa=$.new$('a').text($(this).data('controller').Class.children[k].replace('\\',''))
					$elementsLi2.append($aa)
								
					$aa.click(function(event){
						event.stopImmediatePropagation()
						parent.appendElement(parent.getModelClass(this.text.replace(':','\\:')),a)
						parent.reloadXML()
					})
				}
				$obal.append($elementsUl)
			}
												
			if ($(this).data('availableAttributes').length>0) {					
				for(var k=0; k<$(this).data('availableAttributes').length; k++) {
					var $bb=$.new$('a').html($(this).data('availableAttributes')[k])
					$attributesLi2.append($bb)
					var availableAttributes=$(this).data('availableAttributes')
					$bb.click(function(event){
						event.stopImmediatePropagation()
						var attributeName=$(this).html()
						$descriptionUl.append(parent.appendAttribute(attributeName,'',$title))
						
						$title.data('controller').attributes[attributeName]=''
						
						for(var m=0; m<availableAttributes.length; m++) 
						if (availableAttributes[m]==attributeName)
							availableAttributes.splice(m, 1);
						
						$bb.parent().toggle()
						parent.reloadXML()
					})
				}
				$obal.append($attributesUl)
			}
		},
		
		function(){
			$(this).find('span').html('')
			$(this).css({'background-color':'grey'})
			$newTitleIcon.attr({'src':'static/png/'+modelClass.shortName.toLowerCase()+'.png'})
		})
		
		return a
	},
	
	
	
	getTypes: function(node,array,shortnamespace){

		// loop throughout all child objects of the current node
		for(var k=0; k<node.children.length; k++) {
		
			// if element contains simpleType or complexType definition push its name to the array passed as parameter
			if ((node.children[k].Class == XMLSchemaEditorWidget.Model.simpleType) | (node.children[k].Class == XMLSchemaEditorWidget.Model.complexType)) 
				if (node.children[k].attributes['name']!=undefined)
					if (shortnamespace.length!=0)
						array.push(shortnamespace+':'+node.children[k].attributes['name'])
					else
						array.push(node.children[k].attributes['name'])
			// if node has children set node and new element as parameter for recursive call
			if (node.children[k].children.length>0)
				this.getTypes(node.children[k],array,shortnamespace)
		}		
	},
	
	getXML_r :function(node,$element){
	
		// loop throughout all child objects of the current node
		for(var k=0; k<node.children.length; k++) {
		
			// get element escaped name - polymorphism of used classes
			var $e=$.new$(node.children[k].Class.escapedName)
			
			// set all key:value pairs of the element node
			for (var key in node.children[k].attributes)
				$e.attr(key,node.children[k].attributes[key])
				
			// append parent element - add newly created element n
			$element.append($e)
			
			// if node has children set node and new element as parameter for recursive call
			if (node.children[k].children.length>0)
				this.getXML_r(node.children[k],$e)
		}
	},
	
	getXML:function() {
		var $e=$.new$('root')
		this.getXML_r(this.root,$e)
		return "<?xml version=\""+this.version+"\" encoding=\""+this.encoding+"\" ?>"+$e.html()
	},
	
	getImportedFiles:function() {
		var dict={}
		
		// loop for all children elements of root 'schema' element which is children[0]
		for(var i=0; i<this.root.children[0].children.length; i++) 
		
			// ig element is xs:import
			if (this.root.children[0].children[i].Class==XMLSchemaEditorWidget.Model.import) 
				
				// find corresponding attribute and add keypair filename:schema namespace shortname 
				for (var attribute in this.root.children[0].attributes)
					if (this.root.children[0].attributes[attribute]===this.root.children[0].children[i].attributes['namespace'])
						dict[this.root.children[0].children[i].attributes['schemaLocation']]=attribute.replace('xmlns:','')
						
		return dict
	},
	
	load : function(xml,el) {
		var recursion=this
		var parent=el.Class

		for(var i=0; i<parent.children.length; i++) {
			$(xml).find(parent.children[i]).each(function () {
				
				if (!($(this).parent().is($(xml))) )
					return true
				else {
					console.log(parent.children[i])
					recursion.load(this,recursion.appendElement(recursion.getModelClass(parent.children[i]),el,$(this)))
				}
			})
		}
	},
	
	loadXML:function(xml) {
		this.filename=$(xml).attr('name')
		this.encoding=$(xml).attr('encoding')
		this.version=$(xml).attr('version')
		this.root=new XMLSchemaEditorWidget.Model.root(this.element,{})
		console.log(XMLSchemaEditorWidget.Model.XMLSchemaElement.parsedJSON)
		this.load($(xml),this.root)
		
		
		this.initXML()
	},

	reloadXML:function(){
		var $pre=$.new$('pre')
		var $code=$.new$('code').addClass('xml').addClass('boc-highlight[1]')
		$pre.append($code)
		$(this.code).empty().append($pre)
		this.initXML()
		
		// refresh target namespace property in case it has changed - bug "empty namespace input type" FIXED
		this.targetnamespace=this.root.children[0].attributes["targetNamespace"]
	},
	
	initXML:function(){
		var $preelement=$(this.code).find('pre')
		var $codeelement=$($preelement).find('code')
		var schema=this
		
		$.beautyOfCode.init({
			//theme: 'Django',
			brushes: ['Xml'],
			ready: function() {
				$($codeelement).text(vkbeautify.xml(schema.getXML()).replace(/\\:/g,":"))
				$($preelement).beautifyCode('xml', {'gutter':false,'wrap-lines':true})
    		}
		})
	},
	
	getTargetNamespace:function(){
		return this.targetnamespace
	},
	
	setDatatypes:function(datatypes){
		this.datatypes.setCustom(datatypes)
		var datasource=$.toJSON(this.datatypes.getDefaults('xs\\:element','type').concat(this.datatypes.getCustom('xs\\:element','type')))
		$('div#'+this.filename.replace('.xsd','')+' .xmlsew_element_type_input').attr('data-source',datasource)
	},
	
	init : function(el){
		this.element=$(el).find('div.sewEditor')
		this.code=$(el).find('div.sewCode')
		this.datatypes=new XMLSchemaEditorWidget.Model.Datatypes()
		this.targetnamespace=""
	}
})


})(jQuery)/* end of auto launched $ function in the jQuery namespace */
