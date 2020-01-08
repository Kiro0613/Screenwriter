<?php

$file = "script.txt";
$txt = fopen($file, "w") or die("Unable to open file!");
fwrite($txt, $_POST['txt']);
fclose($txt);

header("Content-Disposition: attachment; filename=\"" . basename($File) . "\"");
header("Content-Type: application/octet-stream");
//header("Content-Length: " . filesize($File));
header("Connection: close");

echo readfile($file);

?>