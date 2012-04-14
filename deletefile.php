<?php

$projectsdir='./static/xsd/projects/';

$file=json_decode(stripslashes($_POST['file']));
chdir($projectsdir.$file->project);
unlink($file->filename);
flush();

?>
