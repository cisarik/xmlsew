<?php

$projectsdir='./static/xsd/projects/';

$project=json_decode(stripslashes($_POST['project']));
file_put_contents('ac.txt',$project->oldname.':'.$project->newname);
chdir($projectsdir);
rename($project->oldname,$project->newname);

echo "OK";
flush();

?>