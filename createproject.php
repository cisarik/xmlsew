<?php

$projectsdir='./static/xsd/projects/';

$project=json_decode(stripslashes($_POST['project']));

chdir($projectsdir);
mkdir($project->name);
chmod($project->name,0775);

?>
