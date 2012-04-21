<?php

class FilesystemController extends Controller
{
	const projectsdir='./static/xsd/projects/';
	
	private function rmdirectory($dir) 
	{
	    $files = glob( $dir . '*', GLOB_MARK );
	    foreach( $files as $file ){
	        if( substr( $file, -1 ) == '/' )
	            self::rmdirectory( $file );
	        else
	            unlink( $file );
	    }
	   
	    if (is_dir($dir)) rmdir( $dir );
	} 
	
	private function files( $path='.', $mask='*', $nocache=0 ){ 
	    static $dir = array(); // cache result in memory 
	    $sdir=array();
	    if ( !isset($dir[$path]) || $nocache) { 
	        $dir[$path] = scandir($path); 
	    } 
	    foreach ($dir[$path] as $i=>$entry) { 
	        if ($entry!='.' && $entry!='..' && fnmatch($mask, $entry) ) { 
	            $sdir[] = $entry; 
	        } 
	    } 
	    return ($sdir); 
	} 

	private function folders(){
		$startdir = self::projectsdir;
		$ignoredDirectory[] = '.'; 
		$ignoredDirectory[] = '..';
		if (is_dir($startdir)){
		   if ($dh = opendir($startdir)){
		       while (($folder = readdir($dh)) !== false){
		           if (!(array_search($folder,$ignoredDirectory) > -1)){
		             if (filetype($startdir . $folder) == "dir"){
		                   $directorylist[$startdir . $folder]['name'] = $folder;
		                   $directorylist[$startdir . $folder]['path'] = $startdir;
		               }
		           }
		       }
		       closedir($dh);
		   }
		}
		return($directorylist);
	}

	private function convert_to_filename($string) {
		$string = strtolower($string);
		
		$string = str_replace ("ø", "oe", $string);
		$string = str_replace ("å", "aa", $string);
		$string = str_replace ("æ", "ae", $string);
		
		$string = str_replace (" ", "_", $string);
		$string = str_replace ("..", ".", $string);
	
		preg_replace ("/[^0-9^a-z^_^.]/", "", $string);
		return $string;
	}
	
	private function zip($file_names,$archive_file_name,$file_path){
	  $archiveDir = './static/zip';
	  $archiveTTL = 86400; // 1 day
	
	  $ignoreFiles = array('.', '..');
	
	  if ($dp = opendir($archiveDir)) {
	    while ($file = readdir($dp)) {
	      if (!in_array($file, $ignoreFiles) && filectime("$archiveDir/$file") < (time() - $archiveTTL)) {
	        unlink("$archiveDir/$file");
	      }
	    }
	  }
	
	  $archive_file_name = "$archiveDir/".basename($archive_file_name);
	
	  $zip = new ZipArchive();
	
	  if ($zip->open($archive_file_name, ZIPARCHIVE::CREATE) !== TRUE) {
	    exit("Cannot open '$archive_file_name'\n");
	  }
	
	  chdir($file_path);
	  foreach($file_names as $file) {
		$zip->addFile($file);
	  }
	  $zip->close();
	}


	public function actionCreatefile()
	{
		$this->render('elements');

		$file=json_decode(stripslashes($_POST['file']));
		
		chdir(self::projectsdir.$file->project);
		
		$rawxml="<?xml version=\"1.0\" encoding=\"utf-8\"?><xs:schema xmlns:xs=\"http://www.w3.org/2001/XMLSchema\" elementFormDefault=\"qualified\" targetNamespace=\"\"></xs:schema>";
		
		file_put_contents($file->filename,$rawxml);
		flush();
	}
	
	public function actionCreateproject()
	{
		$project=json_decode(stripslashes($_POST['project']));		
		chdir(self::projectsdir);
		mkdir($project->name);
		chmod($project->name,0775);
		flush();
	}
	
	public function actionDeletefile()
	{
		$file=json_decode(stripslashes($_POST['file']));
		chdir(self::projectsdir.$file->project);
		unlink($file->filename);
		flush();
	}
	
	public function actionProjects()
	{
		$out=array();
		foreach (self::folders() as $folder) 
			$out[$folder['name']]=self::files($folder['path'].$folder['name'],'*.xsd');

		$response=CJavaScript::jsonEncode($out);
		$this->renderPartial('json',array('json'=>$response), false, true);
		Yii::app()->end();
	}

	public function actionDeleteproject()
	{
		$project=json_decode(stripslashes($_POST['project']));
		
		chdir(self::projectsdir);
		self::rmdirectory($project->name);
		flush();
	}
	
	public function actionRenameproject()
	{
		$project=json_decode(stripslashes($_POST['project']));
		
		chdir(self::projectsdir);
		rename($project->oldname,$project->newname);
		
		$this->renderPartial('json',array('json'=>'OK'), false, true);
		Yii::app()->end();
	}
	
	public function actionSaveproject()
	{
		$project=json_decode($_POST['project']);

		foreach ( $project as $name => $files) {
			chdir(self::projectsdir.$name);
			foreach ($files as $filename => $rawxml) {
				file_put_contents($filename,$rawxml);
			}
		}
		flush();
	}
	
	public function actionDownloadproject()
	{
		$project=json_decode(stripslashes($_POST['project']));
		$file_names=$project->files;
		$archive_file_name=self::convert_to_filename($project->name.'.zip');
		$file_path=self::projectsdir.$project->name;
		
		self::zip($file_names,$archive_file_name,$file_path);
		
		$this->renderPartial('json',array('json'=>'static/zip/'.$archive_file_name), false, true);
		Yii::app()->end();
		flush();
	}
	
	public function actionUploadfile()
	{
		$projectsdir='./static/xsd/projects/';
		
		$path=self::projectsdir.$_POST["xmlsew_uploadfileformproject"].'/';
		
		$response=array();
		
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
		
		$response=json_encode($response);
		flush();
		
		
		$this->renderPartial('json',array('json'=>$response), false, true);
		Yii::app()->end();
	}
	
	public function filters()
	{
	        return array(
	                'accessControl',
	        );
	}
	
	public function accessRules()
	{
	        return array(
	                array('allow',
	                        'actions'=>array('projects','uploadfile','saveproject','downloadproject','renameproject','deleteproject','createfile','createproject','deletefile'),
	                        'roles'=>array('user','administrator'),
	                ),
	       
	                array('deny',
	                        'users'=>array('*'),
	                ),
	        );
	}
}