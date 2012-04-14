/*
XMLSchemaEditorWidget jquery plugin
v2.0 | 31.3.2012
*/

(function($) { 
"use strict"

var COMMON_DATATYPES=['xs:string','xs:decimal','xs:boolean','xs:float','xs:double','xs:duration','xs:dateTime','xs:time','xs:date','xs:gYearMonth','xs:gYear',
	'xs:gMonthDay','xs:gDay','xs:gMonth','xs:hexBinary','xs:base64Binary','xs:anyURI','xs:NOTATION','xs:normalizedString','xs:token','xs:language','xs:NMTOKEN','xs:NMTOKENS',
	'xs:name','xs:NCName','xs:ID','xs:IDREF','xs:IDREFS','xs:ENTITY','xs:ENTITIES','xs:integer','xs:nonPositiveInteger','xs:negativeInteger','xs:long','xs:unsignedLong',
	'xs:int','xs:unsignedInt','xs:short','xs:unsignedShort','xs:byte','xs:unsignedByte','xs:nonNegativeInteger','xs:positiveInteger']

$.Class("Model",{
	setup : function(el){
		arguments[0] = jQuery(el)
		return arguments
	}
})

Model('XMLSchemaEditorWidget.Model',{
	init : function(args){
		this.arguments = args
	},
	  
})

$.Class('XMLSchemaEditorWidget.Ajax',{},{
	get : function(url,type,dict,func) {
		$.ajax({
				url: url,
				type: "GET",
				dataType:type,
				data: dict,
				beforeSend: function() {
				$('#xmlsew_ajaxloader').show()
			},
				success: func,
				complete :function() {
				$('#xmlsew_ajaxloader').hide()
			},
			cache:false	// this will force requested pages not to be cached by the browser - loading of old versions of files bug FIXED
		})
	},
			
	getJSON : function(url,func) {
		$('#xmlsew_ajaxloader').show()
		$.getJSON(url).complete(func).complete(function(){$('#xmlsew_ajaxloader').hide()})
	},
	
	postJSON : function(url,variable,data,func) {
		$('#xmlsew_ajaxloader').show()
		$.post(url,variable+'='+$.toJSON(data)).complete(func).complete(function(){$('#xmlsew_ajaxloader').hide()})
	}
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


$.Class("View",{
	setup : function(el){
		arguments[0] = jQuery(el)
		return arguments
	}
})

View('XMLSchemaEditorWidget.Model.XMLSchemaElement',
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

View('XMLSchemaEditorWidget.View.XMLSchema',
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
	
	
	load : function(xml,el) {
		var recursion=this
		var parent=el.Class

		for(var i=0; i<parent.children.length; i++) {
			$(xml).find(parent.children[i]).each(function () {
				
				if (!($(this).parent().is($(xml))) )
					return true
				else
					recursion.load(this,recursion.appendElement(recursion.getModelClass(parent.children[i]),el,$(this)))
			})
		}
	},
	
	getTypes_r: function(node,array,shortnamespace){

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
				this.getTypes_r(node.children[k],array,shortnamespace)
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
	
	loadXML:function(xml) {
		this.filename=$(xml).attr('name')
		this.encoding=$(xml).attr('encoding')
		this.version=$(xml).attr('version')
		this.root=new XMLSchemaEditorWidget.Model.root(this.element,{})
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

View('XMLSchemaEditorWidget.View.System',
{

	loadProject : function(name,xmls) {
		this.screen.empty()
		this.openedprojectname=name
		$("#xmlsew_projectname").text(name)
		var $ultab=$.new$('ul').addClass('nav').addClass('nav-tabs').attr('id','schemastabs')
		var $tabs=$.new$('div').addClass('tab-content').attr('id','schemastabscontent')
		this.screen.append($ultab)
		this.screen.append($tabs)
		this.toload={}
		
		var filename,$div1,$div2,$div4,$pre,$code,$li,$a
		for(var k=0; k<xmls.length; k++) {
		
			filename=xmls[k].replace('.xsd','')
			$div1=$.new$('div').addClass('tab-pane').attr('id',filename)
			$div2=$.new$('div').addClass('sewEditor')
			$div4=$.new$('div').addClass('sewCode')
			$pre=$.new$('pre')
			$code=$.new$('code').addClass('xml').addClass('boc-highlight[1]')

			$pre.append($code)
			$div4.append($pre)
			$div1.append($div2)
			$div1.append($div4)
			$tabs.append($div1)

			$li=$.new$('li')
			if (k==0) {
				$div1.addClass('active')
				$li.addClass('active')
			}
			
			$a=$.new$('a').text(xmls[k]).css('cursor','default').attr('href','#'+filename).attr('data-toggle','tab').addClass('nav-a')
			$li.append($a)
			$ultab.append($li)
			
			this.toload["#"+xmls[k].replace('.xsd','')]='static/xsd/projects/'+name+'/'+xmls[k]
		}
		
		this.xmlschemaobject
		var system=this
		var filename,firstline,versionindex,encodingindex,version,encodingall,encoding,wholexml
		
		$.each(this.toload,function(key,val){
		
			new XMLSchemaEditorWidget.Ajax().get(val,'text',{},function(result){
				filename=val.slice(val.lastIndexOf("/")+1,val.length)
				firstline=result.slice(0,result.search(/\n/i))
				versionindex=firstline.search(/version/i)+9
				encodingindex=firstline.search(/encoding/i)+10
				version=firstline.slice(versionindex,versionindex+3)
				encodingall=firstline.slice(encodingindex,firstline.length)
				encoding=encodingall.slice(0,encodingall.search(/"/i))
				
				// add root 'file' element necessary for XMLSchema object to load filename xml version and encoding of xml schema file
				wholexml='<file name="'+filename+'" version="'+version+'" encoding="'+encoding+'">'+result+'</file>'
				
				var xmlschemaobject=new XMLSchemaEditorWidget.View.XMLSchema($(key))

				xmlschemaobject.loadXML(wholexml)
				
				system.openedschemas[filename]=xmlschemaobject

				// find corresponding key in system.toload and delete it because that file is already loaded
				for (var schema in system.toload) 
					if (schema=='#'+filename.replace('.xsd',''))
						delete system.toload[schema]
				
				// if system.toload object has no more keys what means that all files has been loaded launch reloadDatatypes function
				if (Object.keys(system.toload).length === 0)
					system.reloadDatatypes()
			})
		})
	},
	
	openProject:function(name,xmls) {
		var system=this
		system.screen.empty()
		system.screen.show()
		$('div#xmlsew_openprojectmodal').modal('hide')
		system.xmlsewphp.slideUp('fast')
		system.xmlsewphptoggled=false
		
		if (system.openedproject)
			$('#openenedprojectmenu').remove()
		
		system.openedproject=true
		$('div#xmlsew_projectnavbar').slideDown('slow',function(){
			system.loadProject(name,xmls)
			
			$('#xmlsew_project').append(
				$.new$('li').attr('id','openenedprojectmenu').append(
				$.new$('a').css('cursor','default').text('Save').attr('id','xmlsew_projectsave').click(function(event){
					var rawproject={}
					var rawxmls={}
					for (var schema in system.openedschemas) 
						rawxmls[schema]=vkbeautify.xml(system.openedschemas[schema].getXML()).replace(/\\:/g,":")
					
					rawproject[system.openedprojectname]=rawxmls

					new XMLSchemaEditorWidget.Ajax().postJSON('saveproject.php','project',rawproject,
					function(data){
						$('#xmlsew_filesavedmodal').modal('show')
						system.reloadDatatypes()
					})

				})).append(
				$.new$('a').css('cursor','default').text('Rename').click(function(){
					$('#xmlsew_renameprojectmodal_name').attr('value',system.openedprojectname)
					$('#xmlsew_renameprojectmodal').modal('show')
				})
			).append(
				$.new$('a').css('cursor','default').text('Delete').click(function(){
					system.deleteProject()
				})
			).append(
				$.new$('a').css('cursor','default').text('Close').click(function(){
					
					system.screen.slideUp('slow',function(){
						system.screen.empty()
						system.xmlsewphp.slideDown('fast')
						system.xmlsewphptoggled=true
					})
					$('div#xmlsew_projectnavbar').slideUp('slow')
					$('#openenedprojectmenu').remove()
					system.openedproject=false
					system.openedschemas={}

				})
			))
		})
	},
	
	newFile:function(filename) {
		var $div1=$.new$('div').addClass('tab-pane').attr('id',filename)
		var $div2=$.new$('div').addClass('sewEditor')
		var $div4=$.new$('div').addClass('sewCode')
		var $pre=$.new$('pre')
		var $code=$.new$('code').addClass('xml').addClass('boc-highlight[1]')

		$pre.append($code)
		$div4.append($pre)
		$div1.append($div2)
		$div1.append($div4)
		$('div#schemastabscontent').append($div1)

		var $li=$.new$('li')
		
		var $a=$.new$('a').text(filename+'.xsd').css('cursor','default').attr('href','#'+filename).attr('data-toggle','tab').addClass('nav-a')
		$li.append($a)
		$('ul#schemastabs').append($li)
				
		var xmlschemaobject=new XMLSchemaEditorWidget.View.XMLSchema($('#'+filename))
		xmlschemaobject.loadXML('<file name="'+filename+'.xsd'+'" version="1.0" encoding="UTF-8"><xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" elementFormDefault="qualified" targetNamespace=""></xs:schema></file>')
						
		this.openedschemas[filename+'.xsd']=xmlschemaobject
		
		$a.click()
	},
	
	deleteFile:function(){
		var $activeschema=$('#schemastabs').find("li.active")
		
		var system=this
										
		$('div#confirmationModal').confirmModal({
			heading: 'Confirm to delete',
			body: 'Are you sure you want to delete schema '+$activeschema.text()+' ?',
			callback: function () {
				var $nextschema=$('#schemastabs').find("li.active").next()

				if ($nextschema.length==0)
					$nextschema=$('#schemastabs').find("li.active").prev()
					
				if ($nextschema.length==0)
					alert('last')
				else 
					$nextschema.find('a').click()
					
				var file={}
				file["project"]=system.openedprojectname
				file["filename"]=$activeschema.text()
				
				new XMLSchemaEditorWidget.Ajax().postJSON('deletefile.php','file',file,
					function(){
						delete system.openedschemas[$activeschema.text()]
						$('div#'+$activeschema.text().replace('.xsd','')).remove()
						$activeschema.remove()
					})
			}
		})		
	},
	
	renameFile:function(newname){
		var $activeschema=$('#schemastabs').find("li.active")
		var system=this
		var file={}
		file["project"]=system.openedprojectname
		file["filename"]=$activeschema.text()
		
		new XMLSchemaEditorWidget.Ajax().postJSON('deletefile.php','file',file,
			function(){
				var copy = {};
				$.extend(copy,system.openedschemas[$activeschema.text()])
				delete system.openedschemas[$activeschema.text()]
				
				$activeschema.find('a').text(newname)
				system.openedschemas[newname]=copy
			})
	},
	
	uploadedFile:function(path) {
		var filename=path.slice(path.lastIndexOf("/")+1,path.length).replace('.xsd','')
		var $div1=$.new$('div').addClass('tab-pane').attr('id',filename)
		var $div2=$.new$('div').addClass('sewEditor')
		var $div4=$.new$('div').addClass('sewCode')
		var $pre=$.new$('pre')
		var $code=$.new$('code').addClass('xml').addClass('boc-highlight[1]')
		var system=this

		$pre.append($code)
		$div4.append($pre)
		$div1.append($div2)
		$div1.append($div4)
		$('div#schemastabscontent').append($div1)

		var $li=$.new$('li')
		var $a=$.new$('a').text(filename+'.xsd').css('cursor','default').attr('href','#'+filename).attr('data-toggle','tab').addClass('nav-a')
		$li.append($a)
		$('ul#schemastabs').append($li)

		new XMLSchemaEditorWidget.Ajax().get(path,'text',{},function(result){
		
			var name=path.slice(path.lastIndexOf("/")+1,path.length)
			var firstline=result.slice(0,result.search(/\n/i))
			var versionindex=firstline.search(/version/i)+9
			var encodingindex=firstline.search(/encoding/i)+10
			var version=firstline.slice(versionindex,versionindex+3)
			var encodingall=firstline.slice(encodingindex,firstline.length)
			var encoding=encodingall.slice(0,encodingall.search(/"/i))
			
			var wholexml='<file name="'+name+'" version="'+version+'" encoding="'+encoding+'">'+result+'</file>'
			
			var xmlschemaobject=new XMLSchemaEditorWidget.View.XMLSchema($('#'+filename))
			xmlschemaobject.loadXML(wholexml)
			
			system.openedschemas[filename+'.xsd']=xmlschemaobject
			$a.click()
		})
	},
	
	renameProject:function(newname){
		var project={}
		var system=this
		project["oldname"]=system.openedprojectname
		project["newname"]=newname
		
		new XMLSchemaEditorWidget.Ajax().postJSON('renameproject.php','project',project,
			function(data){
				if (data['responseText']=="OK") {
					$('#xmlsew_renameprojectmodal').modal('hide')
					system.openedprojectname=newname
					$("#xmlsew_projectname").text(newname)
					system.loadProjects()
				}
			})
	
	},
	
	deleteProject:function(){
		var system=this
										
		$('div#confirmationModal').confirmModal({
			heading: 'Confirm to delete',
			body: 'Are you sure you want to delete project '+system.openedprojectname+' ?',
			callback: function () {
					
				var project={}
				project["name"]=system.openedprojectname
				
				new XMLSchemaEditorWidget.Ajax().postJSON('deleteproject.php','project',project,
					function(){
							system.screen.slideUp('slow',function(){
							system.screen.empty()
							system.xmlsewphp.slideDown('fast')
							system.xmlsewphptoggled=true
						})
						$('div#xmlsew_projectnavbar').slideUp('slow')
						$('#openenedprojectmenu').remove()
						system.openedproject=false
						system.openedschemas={}
						system.loadProjects()
					})
			}
		})	
	},
	
	loadElements:function(){
		// fetch models - element classes from json file
		new XMLSchemaEditorWidget.Ajax().getJSON('static/json/model.XMLSchemaElement.json',
			function(data){
			
				// parsing response json to javascript Object - dictionary with element models
				XMLSchemaEditorWidget.Model.XMLSchemaElement.parsedJSON=$.parseJSON(data['responseText'])
				
				$.each(XMLSchemaEditorWidget.Model.XMLSchemaElement.parsedJSON, function(key, val) {
		    		XMLSchemaEditorWidget.Model.XMLSchemaElement(key,val,{})
		  		})
		})
	},
	
	loadProjects:function(){
		var system=this
	
		// Load all project names and it's files to #xmlsew_openprojectmodal option element
    	new XMLSchemaEditorWidget.Ajax().getJSON('projects.php',
			function(json){
				var group={}
				
				// Ajax callback returns json object which is parsed and flattened to selectBox plugin format
				$.each($.parseJSON(json['responseText']),function(key,val){
					if (val!=null)
					group[val.toString()]=key.toString()
				})
				
				// Init selectBox with result dictionary and bind change callback of select element 
				$('#xmlsew_openprojectselect').selectBox('options',{'Templates':group}).change( function() {
					system.selectedproject.key=group[$(this).val()] // project name
					system.selectedproject.value=$(this).val().toString().split(',') // xml schema files array
				})
			})
	},
			
	reloadDatatypes:function(){
		
		// loop throughout schemas
		for (var schema in this.openedschemas) {
			var datatypes=[]
			var importedfiles=this.openedschemas[schema].getImportedFiles()
			
			this.openedschemas[schema].getTypes_r(this.openedschemas[schema].root,datatypes,'')
			for (var importedfile in importedfiles) {
				if (this.openedschemas[importedfile]!=undefined)
					this.openedschemas[importedfile].getTypes_r(this.openedschemas[importedfile].root,datatypes,importedfiles[importedfile])
			}
			var elements={}
			var attributes={}
			
			attributes['type']=datatypes
			elements['xs\\:element']=attributes

			this.openedschemas[schema].setDatatypes(elements)
		}
	},

	init : function(element,op){
		var system=this
		this.element=element
		this.selectedproject={}
		this.openedproject=false
		this.openedschemas={}
		this.screen=$.new$('div').attr('id','xmlsew_screen')
		this.xmlsewphp=$.new$('div').attr('id','xmlsewphp').css('margin-top','23px')
		this.xmlsewphp.hide()
		this.xmlsewphptoggled=true
		
		system.loadElements()
		var el=$.new$('div').attr('id','xmlsew')
		element.append(el)
		
		this.xmlsewphp.load('xmlsew.php',function(){
			$('#xmlsewphpcontent').css('height',$(window).height()-147)
			system.xmlsewphp.slideDown('slow')
			$('#xmlsewphpcontent').scrollspy({'offset':118})
			
			$.beautyOfCode.init({
				//theme: 'Django',
				brushes: ['Xml'],
				ready: function() {
					$('.xmlsew_example').each(function(index) {
		    			$(this).find('code').text(vkbeautify.xml($(this).find('code').html()).replace(/\\:/g,":"))
						$(this).beautifyCode('xml', {'gutter':false,'wrap-lines':true})
					})
	    		}
			})
		})
		
		el.append(this.xmlsewphp)
		el.append($.new$('div').attr('id','confirmationModal'))

		var $navigationbar=$.new$('div').attr('id','xmlsew_navigationbar')
		el.append($navigationbar)
		$navigationbar.append($.new$('a').append($.new$('img').attr('src','static/png/logoblueblack.png').css('float','left')).click(function(){
			if (!system.xmlsewphptoggled) {
				if (system.openedproject) 
					$('#xmlsewphpcontent').css('height','300px')
				 else 
				 	$('#xmlsewphpcontent').css('height',$(window).height()-145)
				 
				system.xmlsewphp.slideDown('fast')
			} else {
				system.xmlsewphp.slideUp('fast')
			}
			system.xmlsewphptoggled=!system.xmlsewphptoggled
		}))
		
		$navigationbar.append($.new$('div').addClass('xmlsew_navigationbutton').append(
			$.new$('ul').addClass('dropdown').addClass('dropdown-horizontal').append(
				$.new$('li').append(
					$.new$('a').addClass('dir').text('Project')).append(
					$.new$('ul').attr('id','xmlsew_project').append(
						$.new$('li').append(
						$.new$('a').css('cursor','default').attr('data-toggle','modal').text('New').click(function(){
							$('#xmlsew_newprojectname').attr('value','')
							$newprojectmodal.modal('show')
						})).append(
						$.new$('a').css('cursor','default').attr('data-toggle','modal').text('Open').click(function(){
							$openprojectmodal.modal('show')
						})
						))
					)
					))).append(
			$.new$('div').attr('id','xmlsew_ajaxloader').append($.new$('img').attr('src','static/gif/ajax-loader.gif').css('float','right')))
				
				
		var $newfilemodal=$.new$('div').addClass('modal').addClass('fade').attr('id','xmlsew_newfilemodal')
		var $newfilemodal_action=function(){
			if (system.projectcreated) {
					var file={}
					file["project"]=system.openedprojectname
					file["filename"]=$('#xmlsew_newfile_name').val()+'.xsd'
		
					new XMLSchemaEditorWidget.Ajax().postJSON('createfile.php','file',file,
						function(){
							system.openProject(file["project"],[file["filename"]])
						})
					
					system.loadProjects()
					
					system.projectcreated=false
				}
				else 
					system.newFile($('#xmlsew_newfile_name').val())
				$('#xmlsew_newfile_name').attr('value','')
				
				$newfilemodal.modal('hide')
		}
		$newfilemodal.append(
		$.new$('div').addClass('modal-header').append(
		
			$.new$('a').css('cursor','default').addClass('close').attr('data-dismiss','modal').text('x')).append(
			$.new$('h3').text('New file')).append(
		$.new$('div').addClass('modal-body').append(
			$.new$('p').text('Name')).append(
			$.new$('input').attr('type','text').attr('id','xmlsew_newfile_name').keypress(function(event) {
  				if ( event.which == 13 ) 
  					$newfilemodal_action()
   				})
			).append($.new$('b').text('.xsd'))).append(
		$.new$('div').addClass('modal-footer').append(
			$.new$('a').css('cursor','default').addClass('btn').text('Cancel').click(function(){
				$newfilemodal.modal('hide')
			})).append(
			$.new$('a').css('cursor','default').addClass('btn').addClass('btn-primary').text('Create').click($newfilemodal_action))))
			
		$newfilemodal.modal({'backdrop':true,'show':false,'keyboard':true})
		this.element.append($newfilemodal)
		
		
		
		var $filesavedmodal=$.new$('div').addClass('modal').addClass('fade').attr('id','xmlsew_filesavedmodal')
		var $filesavedmodal_action=function(){
			var project={}
			var files=[]
			project["name"]=system.openedprojectname
			for (var schema in system.openedschemas) 
				files.push(schema)
			project["files"]=files
			
			new XMLSchemaEditorWidget.Ajax().postJSON('downloadproject.php','project',project,function(data){
				$filesavedmodal.modal('hide')
				window.location.href=data['responseText']
			})

		}
		$filesavedmodal.append(
		$.new$('div').addClass('modal-header').append(
		
			$.new$('a').css('cursor','default').addClass('close').attr('data-dismiss','modal').text('x')).append(
			$.new$('h3').text('Project saved')).append(
		$.new$('div').addClass('modal-body').append(
			$.new$('p').text('Would you like to download project?'))).append(
		$.new$('div').addClass('modal-footer').append(
			$.new$('a').css('cursor','default').addClass('btn').text('Cancel').click(function(){
				$filesavedmodal.modal('hide')
			})).append(
			$.new$('a').css('cursor','default').addClass('btn').addClass('btn-primary').text('Download').click($filesavedmodal_action))))
			
		$filesavedmodal.modal({'backdrop':true,'show':false,'keyboard':true})
		this.element.append($filesavedmodal)
		
		
		
		var $renamefilemodal=$.new$('div').addClass('modal').addClass('fade').attr('id','xmlsew_renamefilemodal')
		var $renamefilemodal_action=function(){
			system.renameFile($('#xmlsew_filerename_name').attr('value')+'.xsd')
				$('#xmlsew_filerename_name').attr('value','')
				$renamefilemodal.modal('hide')
		}
		$renamefilemodal.append(
		$.new$('div').addClass('modal-header').append(
		
			$.new$('a').css('cursor','default').addClass('close').attr('data-dismiss','modal').text('x')).append(
			$.new$('h3').text('Rename file')).append(
		$.new$('div').addClass('modal-body').append(
			$.new$('p').text('Name')).append(
			$.new$('input').attr('type','text').attr('id','xmlsew_filerename_name').keypress(function(event) {
  				if ( event.which == 13 ) 
  					$renamefilemodal_action()
   				})
			).append($.new$('b').text('.xsd'))).append(
		$.new$('div').addClass('modal-footer').append(
			$.new$('a').css('cursor','default').addClass('btn').text('Cancel').click(function(){
				$renamefilemodal.modal('hide')
			})).append(
			$.new$('a').css('cursor','default').addClass('btn').addClass('btn-primary').text('Rename').click($renamefilemodal_action))))
			
		$renamefilemodal.modal({'backdrop':true,'show':false,'keyboard':true})
		this.element.append($renamefilemodal)
		
		var $uploadfilemodal=$.new$('div').addClass('modal').addClass('fade').attr('id','xmlsew_renamefilemodal')
		
		$uploadfilemodal.append(
		$.new$('div').addClass('modal-header').append(
		
			$.new$('a').css('cursor','default').addClass('close').attr('data-dismiss','modal').text('x')).append(
			$.new$('h3').text('Upload file')).append(
		$.new$('div').addClass('modal-body').append(
		
			$.new$('form').attr('action','uploadfile.php').attr('id','xmlsew_uploadfileform').attr('method','post').attr('enctype','multipart/form-data').append(
				$.new$('input').attr('type','file').attr('name','file').attr('id','file')).append(
				$.new$('input').attr('type','hidden').attr('name','xmlsew_uploadfileformproject').attr('id','xmlsew_uploadfileformproject')
				)
			).append($.new$('div').attr('id','xmlsew_uploadfileformalert').addClass('alert').addClass('alert-block').addClass('alert-error').addClass('fade').addClass('in').append(
				$.new$('a').attr('href','#').attr('data-dismiss','alert').addClass('close').text('x')).append(
				$.new$('h4').addClass('alert-heading').text('Error!')).append(
				$.new$('p').css('text-align','center').attr('id','xmlsew_uploadfileformalertcontent')).append($.new$('br')).append(
				$.new$('p').css('text-align','center').append($.new$('a').attr('href','#').addClass('btn').addClass('btn-danger').text('Ok').click(function(){
					$('#xmlsew_uploadfileformalert').hide()
				}))))
			).append(
		$.new$('div').addClass('modal-footer').append(
			$.new$('a').css('cursor','default').addClass('btn').text('Cancel').click(function(){
				$uploadfilemodal.modal('hide')
			})).append(
			$.new$('a').css('cursor','default').addClass('btn').addClass('btn-primary').text('Upload').click(function(){
				
				$('#xmlsew_uploadfileformproject').attr('value',system.openedprojectname)
				$('#xmlsew_uploadfileform').submit()
				
			}))))
			
		$uploadfilemodal.modal({'backdrop':true,'show':false,'keyboard':true})
		this.element.append($uploadfilemodal)
		
		$('#xmlsew_uploadfileformalert').hide()
		
		$('#xmlsew_uploadfileform').ajaxForm({
			beforeSubmit: function() {
				$('#xmlsew_ajaxloader').show()
			},
			success: function(responsejson) {
				$('#xmlsew_ajaxloader').hide()
				var response=$.parseJSON(responsejson)
				
				if (response['status']=="OK") {
					$uploadfilemodal.modal('hide')
					
					if (system.projectcreated) {
						system.openProject(system.openedprojectname,[response['path'].slice(response['path'].lastIndexOf("/")+1,response['path'].length)])
						system.projectcreated=false
						system.loadProjects()
					}
					else 
						system.uploadedFile(response['path'])
				}
				else {
					switch(response['status']) {
						case "WRONG_FILE_TYPE":
							$('#xmlsew_uploadfileformalertcontent').text('You have to upload file with .xsd extension.')
						break
						case "FILE_EXISTS":
							$('#xmlsew_uploadfileformalertcontent').text('File with same name is already in this project.')
						break
						case "ERROR":
							$('#xmlsew_uploadfileformalertcontent').text(response['message']+' Please try again.')
						break
					}
					$('#xmlsew_uploadfileformalert').show()
					$('#xmlsew_uploadfileformalert').alert()	
				}
			}
		})
		
		var $formatfilemodal=$.new$('div').addClass('modal').addClass('fade').attr('id','xmlsew_formatfilemodal')
		
		$formatfilemodal.append(
		$.new$('div').addClass('modal-header').append(
		
			$.new$('a').css('cursor','default').addClass('close').attr('data-dismiss','modal').text('x')).append(
			$.new$('h3').text('XML format')).append(
		$.new$('div').addClass('modal-body').append(
			$.new$('p').append(
			$.new$('b').text('Version:').css('margin-right','22px')).append(
			$.new$('select').attr('id','xmlsew_formatfileversion').append(
				$.new$('option').text("1.0")).append(
				$.new$('option').text("1.1")).append(
				$.new$('option').text("2.0")))
			
			).append(
			$.new$('p').append(
			$.new$('b').text('Encoding:').css('margin-right','10px')).append(
			$.new$('select').attr('id','xmlsew_formatfileencoding')
			))
			
			).append(
		$.new$('div').addClass('modal-footer').append(
			$.new$('a').css('cursor','default').addClass('btn').text('Cancel').click(function(){
				$formatfilemodal.modal('hide')
			})).append(
			$.new$('a').attr('href','#').css('cursor','default').addClass('btn').addClass('btn-primary').text('Save').click(function(){

				var actualschema=system.openedschemas[$('#schemastabs').find("li.active").text()]
				
				actualschema.version=$('#xmlsew_formatfileversion option:selected').val()
				actualschema.encoding=$('#xmlsew_formatfileencoding option:selected').val()
				actualschema.reloadXML()
				$formatfilemodal.modal('hide')

			}))))
			
		$formatfilemodal.modal({'backdrop':true,'show':false,'keyboard':true})
		this.element.append($formatfilemodal)
		
		new XMLSchemaEditorWidget.Ajax().getJSON('static/json/encodings.json',
				function(data){
					var encodings=$.parseJSON(data['responseText']).sort()
					var group={}
					for(var o=0; o<encodings.length; o++) 
						group[encodings[o]]=encodings[o]
					$('#xmlsew_formatfileencoding').selectBox('options',group)
			})
			
			
		var $importfilemodal=$.new$('div').addClass('modal').addClass('fade').attr('id','xmlsew_importfilemodal')
		
		$importfilemodal.append(
		$.new$('div').addClass('modal-header').append(
		
			$.new$('a').css('cursor','default').addClass('close').attr('data-dismiss','modal').text('x')).append(
			$.new$('h3').text('Import schema')).append(
		$.new$('div').addClass('modal-body').append(
			$.new$('p').text('File:').append($.new$('select').attr('id','xmlsew_importfile_file'))
			
			).append(
			$.new$('p').text('Namespace:').append($.new$('b').text('xmlns:').css('margin-left','10px')).append(
			$.new$('input').css('width','50px').css('text-align','right').attr('type','text').attr('id','xmlsew_importfile_namespaceshort')).append(
			
			$.new$('input').attr('type','text').attr('id','xmlsew_importfile_namespace')))
			
			
			).append(
		$.new$('div').addClass('modal-footer').append(
			$.new$('a').css('cursor','default').addClass('btn').text('Cancel').click(function(){
				var actualschema=system.openedschemas[$('#schemastabs').find("li.active").text()]

				$importfilemodal.modal('hide')
			})).append(
			$.new$('a').css('cursor','default').addClass('btn').addClass('btn-primary').text('Import').click(function(){

				// get name of currently opened schema file and fetch schema object to the local variable
				var actualschema=system.openedschemas[$('#schemastabs').find("li.active").text()]
				
				// get all needed values for importing new schema file
				var attrname='xmlns:'+$('input#xmlsew_importfile_namespaceshort').val()
				var attrvalue=$('input#xmlsew_importfile_namespace').val()
				var filename=$('select#xmlsew_importfile_file').val()
				
				// append new attributes to selected "actual" schema
				actualschema.$schemaattributesroot.append(actualschema.appendAttribute(attrname,attrvalue,actualschema.$schemaroot))
				
				// set new attribute and value in schema object so that it can be parsed in reloadXML function
				actualschema.root.children[0].attributes[attrname]=attrvalue
				
				// create import element with needed attributes 
				var $newElement=$.new$('xs\\:import').attr("schemalocation",filename).attr("namespace",attrvalue)
				
				// append newly created element to the root of actual schema element
				actualschema.appendElement(XMLSchemaEditorWidget.Model.import,actualschema.root.children[0],$newElement)
				
				// show changes 
				actualschema.reloadXML()
				$('input#xmlsew_importfile_namespaceshort').attr('value','')
				
				// reload datatypes because of importing
				system.reloadDatatypes()
		
				$importfilemodal.modal('hide')
			}))))
			
		$importfilemodal.modal({'backdrop':true,'show':false,'keyboard':true})
		this.element.append($importfilemodal)
		
		var $renameprojectmodal=$.new$('div').addClass('modal').addClass('fade').attr('id','xmlsew_renameprojectmodal')
		var $renameprojectmodal_action=function(){
			system.renameProject($('#xmlsew_renameprojectmodal_name').attr('value'))
		}
		$renameprojectmodal.append(
		$.new$('div').addClass('modal-header').append(
		
			$.new$('a').css('cursor','default').addClass('close').attr('data-dismiss','modal').text('x')).append(
			$.new$('h3').text('Rename project')).append(
		$.new$('div').addClass('modal-body').append(
			$.new$('p').text('Name')).append(
			$.new$('input').attr('type','text').attr('id','xmlsew_renameprojectmodal_name').keypress(function(event) {
  				if ( event.which == 13 ) 
  					$renameprojectmodal_action()
   				})
			)).append(
		$.new$('div').addClass('modal-footer').append(
			$.new$('a').css('cursor','default').addClass('btn').text('Cancel').click(function(){
				$renameprojectmodal.modal('hide')
			})).append(
			$.new$('a').css('cursor','default').addClass('btn').addClass('btn-primary').text('Rename').click($renameprojectmodal_action))))
			
		$renameprojectmodal.modal({'backdrop':true,'show':false,'keyboard':true})
		this.element.append($renameprojectmodal)
			
		var $projectnavbar=$.new$('div').attr('id','xmlsew_projectnavbar').addClass('navbar').addClass('navbar-static').append(
				$.new$('div').addClass('navbar-inner').append(
					$.new$('div').addClass('container').css('width','auto').append(
						$.new$('a').attr('id','xmlsew_projectname').addClass('brand').css({'cursor':'default','width': '108px','font-size':'17px'})).append(
						$.new$('ul').attr('id','fileul').addClass('nav').append(
							$.new$('li').addClass('dropdown').append(
								$.new$('a').css('cursor','default').addClass('dropdown-toggle').attr('data-toggle','dropdown').html('File <b class="caret"></b>')).append(
								$.new$('ul').addClass('dropdown-menu').attr('id','xmlsew_fileul').append(
									$.new$('li').append(
										$.new$('a').css('cursor','default').text('New').click(function(){
											$newfilemodal.modal('show')
										})
									)
								).append(
									$.new$('li').append(
										$.new$('a').css('cursor','default').text('Upload').click(function(){
											$uploadfilemodal.modal('show')
										})
									)
								).append(
									$.new$('li').append(
										$.new$('a').css('cursor','default').text('Delete').click(function(){
											system.deleteFile()
										})
									)
								)
							)).append(
						$.new$('ul').addClass('nav').addClass('pullright').append(
							$.new$('li').attr('id','fat-menu').addClass('dropdown').append(
							$.new$('a').css('cursor','default').addClass('dropdown-toggle').attr('data-toggle','dropdown').html('Edit <b class="caret"></b>')).append(
								$.new$('ul').addClass('dropdown-menu').attr('id','xmlsew_projectul').append(
									$.new$('li').append(
										$.new$('a').css('cursor','default').text('Rename').click(function(){
											$('#xmlsew_filerename_name').attr('value',$('#schemastabs').find("li.active").text().replace('.xsd',''))
											$renamefilemodal.modal('show')
										})
									)
								).append(
									$.new$('li').append(
										$.new$('a').css('cursor','default').text('Format').click(function(){
											var actualschema=system.openedschemas[$('#schemastabs').find("li.active").text()]
											$('#xmlsew_formatfileversion').selectBox('value',actualschema.version)
											$('#xmlsew_formatfileencoding').selectBox('value',actualschema.encoding.toLowerCase())
											$formatfilemodal.modal('show')
										})
									)
								).append(
									$.new$('li').append(
										$.new$('a').css('cursor','default').text('Import').click(function(){
											var group={}
											
											// create dictionary of opened schema files for selectBox options
											for(var schema in system.openedschemas) 
												group[schema]=schema

											$('#xmlsew_importfile_file').selectBox('options',group).change( function() {
											
												// when select changed it is needed to set target namespace according to selected schema
												$('#xmlsew_importfile_namespace').attr('value',system.openedschemas[$(this).val()].getTargetNamespace())
	
											})
											
											// set target namespace for the first time - "bug namespace input type empty when modal showed" FIXED
											$('#xmlsew_importfile_namespace').attr('value',system.openedschemas[$('#xmlsew_importfile_file').val()].getTargetNamespace())
											$importfilemodal.modal('show')
										})
									)
								
								)
							)
						)
					)
				)
			)
		)
		
		$projectnavbar.hide()
		
		var $projectcreatedmodal=$.new$('div').addClass('modal').addClass('fade').attr('id','xmlsew_projectcreatedmodal')
		
		$projectcreatedmodal.append(
		$.new$('div').addClass('modal-header').append(
			$.new$('h3').text('Project successfully created')).append(
		$.new$('div').addClass('modal-body').append(
			$.new$('p').text("But it's now empty so that it's necessary to create some schema files or upload existing ones."))).append(
		$.new$('div').addClass('modal-footer').append(
			$.new$('a').css('cursor','default').addClass('btn').text('Cancel').click(function(){
				// delete created schema?
				$projectcreatedmodal.modal('hide')
			})).append(
			$.new$('a').css('cursor','default').addClass('btn').addClass('btn-primary').text('Create new').click(function(){
				system.projectcreated=true
				system.openedprojectname=$('#xmlsew_newprojectname').val()
				
				$projectcreatedmodal.modal('hide')
				$newfilemodal.modal('show')
			})).append(
			$.new$('a').css('cursor','default').addClass('btn').addClass('btn-primary').text('Upload').click(function(){
				system.projectcreated=true
				system.openedprojectname=$('#xmlsew_newprojectname').val()
				
				$projectcreatedmodal.modal('hide')
				$uploadfilemodal.modal('show')
			}))))
			
		$projectcreatedmodal.modal({'backdrop':true,'show':false})
		this.element.append($projectcreatedmodal)
		
		
		var $newprojectmodal=$.new$('div').addClass('modal').addClass('fade').attr('id','xmlsew_newprojectmodal')
		var $newprojectmodal_action=function(){
			var project={}
			project["name"]=$('#xmlsew_newprojectname').val()
		
			new XMLSchemaEditorWidget.Ajax().postJSON('createproject.php','project',project,
				function(){
					$newprojectmodal.modal('hide')
					$projectcreatedmodal.modal('show')
				})
		}
		$newprojectmodal.append(
		$.new$('div').addClass('modal-header').append(
		
			$.new$('a').css('cursor','default').addClass('close').attr('data-dismiss','modal').text('x')).append(
			$.new$('h3').text('New project')).append(
		$.new$('div').addClass('modal-body').append(
			$.new$('p').text('Name')).append(
			$.new$('input').attr('type','text').attr('id','xmlsew_newprojectname').keypress(function(event) {
  				if ( event.which == 13 ) 
  					$newprojectmodal_action()
   				})
			)).append(
		$.new$('div').addClass('modal-footer').append(
			$.new$('a').css('cursor','default').addClass('btn').text('Cancel').click(function(){
				$newprojectmodal.modal('hide')
			})).append(
			$.new$('a').css('cursor','default').addClass('btn').addClass('btn-primary').text('Create').click($newprojectmodal_action))))
			
		$newprojectmodal.modal({'backdrop':true,'show':false})
		this.element.append($newprojectmodal)
		

		var $openprojectmodal=$.new$('div').addClass('modal').addClass('fade').attr('id','xmlsew_openprojectmodal')
		var $openprojectmodal_action=function(){
			system.openProject(system.selectedproject.key,system.selectedproject.value)
		}
		$openprojectmodal.append(
		$.new$('div').addClass('modal-header').append(
		
			$.new$('a').css('cursor','default').addClass('close').attr('data-dismiss','modal').text('x')).append(
			$.new$('h3').text('Open project')).append(
		$.new$('div').addClass('modal-body').append(
			$.new$('p').css('text-align','center').append(
			$.new$('select').attr('id','xmlsew_openprojectselect').attr('multiple','multiple')))).append(
		$.new$('div').addClass('modal-footer').append(
			$.new$('a').css('cursor','default').addClass('btn').text('Cancel').click(function(){
				$openprojectmodal.modal('hide')
			})).append(
			$.new$('a').css('cursor','default').addClass('btn').addClass('btn-primary').text('Open').click($openprojectmodal_action))))
			
		$openprojectmodal.modal({'backdrop':true,'show':false})
		this.element.append($openprojectmodal)
	
		el.append($.new$('div').attr('id','xmlsew_screen').append($.new$('br')).append(
			$projectnavbar).append(this.screen))
		
		// Show navigation bar and set it's effects on mouse events
		$('#xmlsew_navigationbar').fadeTo('slow', 0.6, function() {
			$('#xmlsew_navigationbar').mouseenter(function(){
				$('#xmlsew_navigationbar').fadeTo('fast', 1.0)
			})
			$('#xmlsew_navigationbar').mouseleave(function(){
				$('#xmlsew_navigationbar').fadeTo('fast', 0.6)
			})	
		})
		
		// Use bootstrap and jquery plugins for classes influences all needed elements of schema editor
		$('.tabs a:last').tab('show') // bootstrap tabs for project files
    	$('.dropdown-toggle').dropdown() // main 'Project', 'Add Atribute' and 'Add Element' drop down menus
    	$('select').selectBox() // selectBox plugin for select elements
      	$('.typeahead').typeahead() // typeahead for datatypes auto complete menu initialization
    	
    	system.loadProjects()
	}
})

})(jQuery)/* end of auto launched $ function in the jQuery namespace */

// main plugin function for initialization
$.fn.xmlsew = function(op){
    
    return (!this.length) ? this : (this[0].xmlsew || (
      function(el){
      		
			// calling contractor of widget's System class 
			new XMLSchemaEditorWidget.View.System($(el),op)	
    })(this[0]))
}
