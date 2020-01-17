<!DOCTYPE html>
<html>
	<head>
		<title>Project</title>
		<link rel="stylesheet" type="text/css" href="print.css" />
	</head>
	
	<body>
		<div id="screenplay"></div>
    </body>
	
	<script>
		var scriptObj = <?php echo $_POST['scriptObj'] ?>
	</script>
	<script src="print.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.62/pdfmake.js"></script>
	
</html>