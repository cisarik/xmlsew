<?php
header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT"); // Date in the past

function files( $path='.', $mask='*', $nocache=0 ){ 
    static $dir = array(); // cache result in memory 
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

function folders(){
  $startdir = './static/xsd/projects/';
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

$out=array();
foreach (folders() as $folder) 
	$out[$folder['name']]=files($folder['path'].$folder['name'],'*.xsd');

echo json_encode($out);
flush();
?>
