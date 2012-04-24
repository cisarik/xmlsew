
"use strict"

function showLogin() {
	var loginbox=new Boxy("<form id='login-form' action='index.php?r=site/login' method='post'><center><p><b>Username:</b><br><input id='LoginForm_username' type='text' name='LoginForm[username]' size='20'/></p></center><center><p><b>Password:</b><br><input id='LoginForm_password' type='password' name='LoginForm[password]' size='20'> </p></center><input id='LoginForm_rememberMe' type='checkbox' name='LoginForm[rememberMe]' value='1'>Remember me<div id='xmlsew_loginalert' class='alert alert-block alert-error fade in'><h4 class='alert-heading'>Error</h4><p id='xmlsew_loginalert_content'></div><a style='float:left;'href='index.php?r=site/forgottenpassword'>Forgotten password?</a><input style='float:right;'type='submit' value='Login' /><input type='hidden' value='0' id='ajaxlogin' name='ajaxlogin'/></form>", {
		title: "Login <a style='float:right;' href='index.php?r=site/admin'>Administration</a>",
		closeable: false,
		})
		
	$('#xmlsew_loginalert').hide()
		
	$('#login-form').ajaxForm({
	success: function(responsejson) {
		
		var response=$.parseJSON(responsejson)
		
		if (response['status']=="OK") {
			loginbox.hide()
			$('body').xmlsew()
		}
		else {
			$('#xmlsew_loginalert_content').html(response['message'])
			$('#xmlsew_loginalert').show()
			$('#xmlsew_loginalert').alert()	
		}
		
	}})
}
		
function showForgottenPassword() {
	new Boxy("<form id='forgottenpassword-form' action='index.php?r=site/forgottenpassword' method='post'><center><p><b>Email:</b><br><input id='NewpasswordForm_email' type='text' name='ForgottenpasswordForm[email]' size='20'/></p></center><div id='xmlsew_forgottenpasswordalert' class='alert alert-block alert-error fade in'><h4 class='alert-heading'>Error</h4><p id='xmlsew_forgottenpasswordalert_content'></div><input style='float:right;'type='submit' value='Send' /><input id='xmlsew_forgottenpassword_cancel' style='float:left;'type='button' value='Cancel' /><input type='hidden' value='1' id='ajaxrequest' name='ajaxrequest'/></form>", {
		title: "Forgotten password",
		closeable: false,
		})
		
	$('#xmlsew_forgottenpasswordalert').hide()
	
	$('#xmlsew_forgottenpassword_cancel').click(function(){
		window.location.href = 'index.php'
	})
		
	$('#forgottenpassword-form').ajaxForm({
	success: function(responsejson) {

		var response=$.parseJSON(responsejson)
		
		if (response['status']=="OK") 
			window.location.href = 'index.php'

		else {
			$('#xmlsew_forgottenpasswordalert_content').html(response['message'])
			$('#xmlsew_forgottenpasswordalert').show()
			$('#xmlsew_forgottenpasswordalert').alert()	
		}
		
	}})
}

function showNewPassword(keychain) {
	new Boxy("<form id='newpassword-form' action='index.php?r=site/newpassword' method='post'><center><p><b>Password:</b><br><input id='NewpasswordForm_password1' type='password' name='NewpasswordForm[password1]' size='20'/></p></center><center><p><b>Password (again):</b><br><input id='NewpasswordForm_password2' type='password' name='NewpasswordForm[password2]' size='20'/></p></center><div id='xmlsew_newpasswordalert' class='alert alert-block alert-error fade in'><h4 class='alert-heading'>Error</h4><p id='xmlsew_newpasswordalert_content'></div><input style='float:right;'type='submit' value='Submit' /><input id='xmlsew_newpassword_cancel' style='float:left;'type='button' value='Cancel' /><input type='hidden' value='1' id='ajaxrequest' name='ajaxrequest'/><input type='hidden' value='"+keychain+"' id='keychain' name='keychain'/></form>", {
		title: "New password",
		closeable: false,
		})
		
	$('#xmlsew_newpasswordalert').hide()
	
	$('#xmlsew_newpassword_cancel').click(function(){
		window.location.href = 'index.php'
	})
		
	$('#newpassword-form').ajaxForm({
	success: function(responsejson) {
		var response=$.parseJSON(responsejson)
		
		if (response['status']=="OK") 
			window.location.href = 'index.php'

		else {
			$('#xmlsew_newpasswordalert_content').html(response['message'])
			$('#xmlsew_newpasswordalert').show()
			$('#xmlsew_newpasswordalert').alert()	
		}
		
	}})
}

function showChangePassword() {
	new Boxy("<form id='newpassword-form' action='index.php?r=site/changepassword' method='post'><center><p><b>Password:</b><br><input id='NewpasswordForm_password1' type='password' name='NewpasswordForm[password1]' size='20'/></p></center><center><p><b>Password (again):</b><br><input id='NewpasswordForm_password2' type='password' name='NewpasswordForm[password2]' size='20'/></p></center><div id='xmlsew_changepasswordalert' class='alert alert-block alert-error fade in'><h4 class='alert-heading'>Error</h4><p id='xmlsew_changepasswordalert_content'></div><input style='float:right;'type='submit' value='Submit' /><input id='xmlsew_changepassword_cancel' style='float:left;'type='button' value='Cancel' /><input type='hidden' value='1' id='ajaxrequest' name='ajaxrequest'/></form>", {
		title: "Change password",
		closeable: false,
		})
		
	$('#xmlsew_changepasswordalert').hide()
	
	$('#xmlsew_changepassword_cancel').click(function(){
		window.location.href = 'index.php'
	})
		
	$('#newpassword-form').ajaxForm({
	success: function(responsejson) {
		var response=$.parseJSON(responsejson)
		
		if (response['status']=="OK") 
			window.location.href = 'index.php'

		else {
			$('#xmlsew_changepasswordalert_content').html(response['message'])
			$('#xmlsew_changepasswordalert').show()
			$('#xmlsew_changepasswordalert').alert()	
		}
		
	}})
}

function showNewAccount(keychain) {
	new Boxy("<form id='newaccount-form' action='index.php?r=site/newaccount' method='post'><center><p><b>Username:</b><br><input id='NewaccountForm_username' type='text' name='NewaccountForm[username]' size='20'/></p></center><center><p><b>Password:</b><br><input id='NewaccountForm_password1' type='password' name='NewaccountForm[password1]' size='20'/></p></center><center><p><b>Password (again):</b><br><input id='NewaccountForm_password2' type='password' name='NewaccountForm[password2]' size='20'/></p></center><div id='xmlsew_newaccountalert' class='alert alert-block alert-error fade in'><h4 class='alert-heading'>Error</h4><p id='xmlsew_newaccountalert_content'></div><input style='float:right;'type='submit' value='Submit' /><input id='xmlsew_newaccount_cancel' style='float:left;'type='button' value='Cancel' /><input type='hidden' value='1' id='ajaxrequest' name='ajaxrequest'/><input type='hidden' value='"+keychain+"' id='keychain' name='keychain'/></form>", {
		title: "New account",
		closeable: false,
		})
		
	$('#xmlsew_newaccountalert').hide()
	
	$('#xmlsew_newaccount_cancel').click(function(){
		window.location.href = 'index.php'
	})
		
	$('#newaccount-form').ajaxForm({
	success: function(responsejson) {
		var response=$.parseJSON(responsejson)
		
		if (response['status']=="OK") 
			window.location.href = 'index.php'

		else {
			$('#xmlsew_newaccountalert_content').html(response['message'])
			$('#xmlsew_newaccountalert').show()
			$('#xmlsew_newaccountalert').alert()	
		}
	}})
}


