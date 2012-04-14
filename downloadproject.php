<?php

function convert_to_filename($string) {
	$string = strtolower($string);
	
	$string = str_replace ("ø", "oe", $string);
	$string = str_replace ("å", "aa", $string);
	$string = str_replace ("æ", "ae", $string);
	
	$string = str_replace (" ", "_", $string);
	$string = str_replace ("..", ".", $string);

	preg_replace ("/[^0-9^a-z^_^.]/", "", $string);
	return $string;
}

function zip($file_names,$archive_file_name,$file_path){
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


$projectsdir='./static/xsd/projects/';

$project=json_decode(stripslashes($_POST['project']));
$file_names=$project->files;
$archive_file_name=convert_to_filename($project->name.'.zip');
$file_path=$projectsdir.$project->name;

zip($file_names,$archive_file_name,$file_path);

echo 'static/zip/'.$archive_file_name;
flush();

?>