<!-- 

File: index.php

XMLSchemaEditorWidget
v2.0 | 13.04.2012
-->
<?php header('Content-Type: text/html; charset=utf-8'); ?>
<!DOCTYPE html> <!-- html 5 doctype-->
<html>
<head>

<title>XMLSchema editor</title>

<!-- meta tags -->
<meta charset=utf-8 />
<meta http-equiv="content-type" content="text/html; charset=UTF-8">                                
<meta name="author" content="Michal Cisárik VSB-TUO (cisary,com)">
<meta name="menu-author" content="Tom@Lwis (http://www.lwis.net/free-css-drop-down-menu/)">

<!-- css styles -->
<style type="text/css">
/* Page css reseting styles: */
@import "static/css/html_defaults.css";
@import "static/css/html5_defaults.css";
/* Dropdown menu layout */
@import "static/css/dropdown.css";
/* Dropdown nenu theme */
@import "static/css/dropdown_default_advanced.css";
/* Widget elements style */
@import "static/css/widget.css";
/* Widget elements style */
@import "static/css/bootstrap.min.css";
@import "static/css/jquery.selectBox.css";
</style>

<!-- Internet Explorer compatibility for jquery include -->
<!--[if IE]>
  <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
<![endif]-->

<!-- jQuery with query.include plugin for lazyload other script files --> 
<script type="text/javascript" src="static/js/jquery/jquery-1.7.1.min.js"></script>
<script type="text/javascript" src="static/js/jquery/jquery.include.js"></script>
</head>

<body>
<script type="text/javascript">
(function($) { 

// use javascript without ';'
"use strict"

// include XML Schema editor widget jquery plugin with all dependencies
$.include('static/js/jquery/jquery.xmlsew.js', 
	function() {
	
		// initialization after successfull loading
		$("document").ready(function() {
		
				// init widget in the body element
				$('body').xmlsew()
			})
		},
		
		[	// twitter bootstrap and its plugins
			$.include('static/js/bootstrap/bootstrap.min.js'),
			$.include('static/js/bootstrap/bootstrap-tab.js'),
			$.include('static/js/bootstrap/bootstrap-modal.js'),
			$.include('static/js/bootstrap/bootstrap-alert.js'),
			$.include('static/js/bootstrap/bootstrap-typeahead.js'),
			$.include('static/js/bootstrap/bootstrap-scrollspy.js'),
			
			// other custom bootstrap plugins
			$.include('static/js/bootstrap/bootstrap-custom.js'),
			
			// jquery plugins 
			$.include('static/js/jquery/jquery.class.js'),
			$.include('static/js/jquery/jquery.form.js'),
			$.include('static/js/jquery/jquery.json-2.3.min.js'),
			$.include('static/js/jquery/jquery.selectBox.js'),
			$.include('static/js/jquery/jquery.beautyOfCode-min.js'),
			$.include('static/js/jquery/$.fn.outerHTML.js'),
			$.include('static/js/other/vkbeautify.0.96.00.beta.js'),
			
			// other custom jquery functions
			$.include('static/js/jquery/jquery-custom.js'),
		]
)   
})(jQuery)
</script>
</body>
</html>