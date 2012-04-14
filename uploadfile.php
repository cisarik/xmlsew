<?php

$projectsdir='./static/xsd/projects/';

$path=$projectsdir.$_POST["xmlsew_uploadfileformproject"].'/';

$response=array();

file_put_contents('aaa.txt',$_FILES["file"]["type"]);

if ($_FILES["file"]["type"]!="application/octet-stream") { 
	$response["status"]="WRONG_FILE_TYPE";
}
else { 

	if ($_FILES["file"]["error"] == 0) {
		 
		if (file_exists($path . $_FILES["file"]["name"])) {
			$response["status"]="FILE_EXISTS";
		} else {
			move_uploaded_file($_FILES["file"]["tmp_name"],$path . $_FILES["file"]["name"]);
			$response["status"]="OK";
			$response["path"]=$path . $_FILES["file"]["name"];
		}
	} else {
		$response["status"]="ERROR";
		
		switch ($_FILES["file"]["error"]) { 
            case UPLOAD_ERR_INI_SIZE: 
                $response["message"] = "The uploaded file exceeds the upload_max_filesize directive in php.ini."; 
                break; 
            case UPLOAD_ERR_FORM_SIZE: 
                $response["message"] = "The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form."; 
                break; 
            case UPLOAD_ERR_PARTIAL: 
                $response["message"] = "The uploaded file was only partially uploaded."; 
                break; 
            case UPLOAD_ERR_NO_FILE: 
                $response["message"] = "No file was uploaded."; 
                break; 
            case UPLOAD_ERR_NO_TMP_DIR: 
                $response["message"] = "Missing a temporary folder."; 
                break; 
            case UPLOAD_ERR_CANT_WRITE: 
                $response["message"] = "Failed to write file to disk."; 
                break; 
            case UPLOAD_ERR_EXTENSION: 
                $response["message"] = "File upload stopped by extension."; 
                break; 

            default: 
                $response["message"] = "Unknown upload error."; 
                break; 
        }
	}
}

echo json_encode($response);
flush();
?>
