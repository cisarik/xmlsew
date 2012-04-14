<?php

function rmdirectory($dir) {
    $files = glob( $dir . '*', GLOB_MARK );
    foreach( $files as $file ){
        if( substr( $file, -1 ) == '/' )
            rmdirectory( $file );
        else
            unlink( $file );
    }
   
    if (is_dir($dir)) rmdir( $dir );
   
} 

$projectsdir='./static/xsd/projects/';

$project=json_decode(stripslashes($_POST['project']));

chdir($projectsdir);
rmdirectory($project->name);
flush();

?>
