<?php

$project=json_decode(stripslashes($_POST['project']));

$projectsdir='./static/xsd/projects/';

foreach ( $project as $name => $files) {
	chdir($projectsdir.$name);
	foreach ($files as $filename => $rawxml) {
		file_put_contents($filename,$rawxml);
	}
}
flush();

?>
