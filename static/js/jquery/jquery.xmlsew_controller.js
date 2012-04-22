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

$.Class('XMLSchemaEditorWidget.Controller.Ajax',{},{
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

XMLsew('XMLSchemaEditorWidget.Controller.UI',
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
		
			new XMLSchemaEditorWidget.Controller.Ajax().get(val,'text',{},function(result){
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

					console.log(rawproject)
					new XMLSchemaEditorWidget.Controller.Ajax().postJSON('index.php?r=filesystem/saveproject','project',rawproject,
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
				
				new XMLSchemaEditorWidget.Controller.Ajax().postJSON('index.php?r=filesystem/deletefile','file',file,
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
		
		new XMLSchemaEditorWidget.Controller.Ajax().postJSON('index.php?r=filesystem/deletefile','file',file,
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

		new XMLSchemaEditorWidget.Controller.Ajax().get(path,'text',{},function(result){
		
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
		
		new XMLSchemaEditorWidget.Controller.Ajax().postJSON('index.php?r=filesystem/renameproject','project',project,
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
				
				new XMLSchemaEditorWidget.Controller.Ajax().postJSON('index.php?r=filesystem/deleteproject','project',project,
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
	
	loadModel:function(){
		// fetch models - element classes from json file
		
		new XMLSchemaEditorWidget.Controller.Ajax().getJSON('index.php?r=model/get',
			function(data){
			
				var response=$.parseJSON(data['responseText'])
				
				XMLSchemaEditorWidget.Model.Datatypes.defaults=response['defaultvalues']
			
				// parsing response json to javascript Object - dictionary with element models
				XMLSchemaEditorWidget.Model.XMLSchemaElement.parsedJSON=response['elements']
				
				$.each(XMLSchemaEditorWidget.Model.XMLSchemaElement.parsedJSON, function(key, val) {
					//console.log(key+':'+val['children'])
		    		XMLSchemaEditorWidget.Model.XMLSchemaElement(key,val,{})
		  		})
		})
	},
	
	loadProjects:function(){
		var system=this
	
		// Load all project names and it's files to #xmlsew_openprojectmodal option element
    	new XMLSchemaEditorWidget.Controller.Ajax().getJSON('index.php?r=filesystem/projects',
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
			
			this.openedschemas[schema].getTypes(this.openedschemas[schema].root,datatypes,'')
			for (var importedfile in importedfiles) {
				if (this.openedschemas[importedfile]!=undefined)
					this.openedschemas[importedfile].getTypes(this.openedschemas[importedfile].root,datatypes,importedfiles[importedfile])
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
		
		system.loadModel()
		
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
		
		$navigationbar.append($.new$('a').attr('href','index.php?r=site/logout').text("Logout").css({'float':'right','color':'white','font-size':'15px','margin-right':'7px','margin-left':'10px'})).append($.new$('a').attr('href','index.php?r=site/admin').text("Administration").css({'float':'right','color':'white','font-size':'15px','margin-right':'7px','margin-left':'10px'})).append($.new$('a').attr('href','index.php?r=site/changepassword').text("Change password").css({'float':'right','color':'white','font-size':'15px','margin-right':'7px','margin-left':'10px'})).append($.new$('div').addClass('xmlsew_navigationbutton').append(
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
		
					new XMLSchemaEditorWidget.Controller.Ajax().postJSON('index.php?r=filesystem/createfile','file',file,
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
			
			new XMLSchemaEditorWidget.Controller.Ajax().postJSON('index.php?r=filesystem/downloadproject','project',project,function(data){
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
		
			$.new$('form').attr('action','index.php?r=filesystem/uploadfile').attr('id','xmlsew_uploadfileform').attr('method','post').attr('enctype','multipart/form-data').append(
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
		
		new XMLSchemaEditorWidget.Controller.Ajax().getJSON('static/json/encodings.json',
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
		
			new XMLSchemaEditorWidget.Controller.Ajax().postJSON('index.php?r=filesystem/createproject','project',project,
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
			new XMLSchemaEditorWidget.Controller.UI($(el),op)	
    })(this[0]))
}
