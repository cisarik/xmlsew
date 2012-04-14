<?php
header('Content-Type: text/html; charset=utf-8'); 

$projectsdir='./static/xsd/projects/';

$file=json_decode(stripslashes($_POST['file']));

chdir($projectsdir.$file->project);

$rawxml="<?xml version=\"1.0\" encoding=\"utf-8\"?><xs:schema xmlns:xs=\"http://www.w3.org/2001/XMLSchema\" elementFormDefault=\"qualified\" targetNamespace=\"\"></xs:schema>";

file_put_contents($file->filename,$rawxml);
flush();

?>
