<!DOCTYPE html>
<html>
    <head>
        <title>Screenwriter</title>
        <link rel="stylesheet" type="text/css" href="style.css" />
    </head>

    <body>
		<div id="contextMenu">
			<span id="contextSlug" onclick="changeType(0)">Slugline</span>
			<span id="contextAction" onclick="changeType(1)">Action</span>
			<span id="contextDial" onclick="changeType(2)">Dialogue</span>
			<span id="contextParen" onclick="changeType(3)">Parenthetical</span>
			<span id="contextChar" onclick="changeType(4)">Character</span>
			<span id="contextTrans" onclick="changeType(5)">Transition</span>
			<hr id="contextHr" />
			<span id="contextCut" onclick="clipboard.cut(true);">Cut</span>
			<span id="contextCopy" onclick="clipboard.copy(true);">Copy</span>
			<span id="contextPaste" onclick="clipboard.paste(true);">Paste</span>
		</div>
		
		<div id="main">
			<h1 id="header">Screenwriter</h1>
			<div id="optionsWrapper" class="optionsWrapper">
				<div id="options" class="options">
					<div id="leftOptions" style="display: flex; flex-direction: row;">
						<button onclick="screenplay.addElement();" class="optionsButton">Add<br/>Row</button>

						<button onclick="screenplay.deleteLastElement();" class="optionsButton">Remove<br/>Last Row</button>

						<span id="elementPicker" class="option">
							<h4>Element</h4>
							<select id="elementTypeSelector">
								<option value="slug">SLUGLINE</option>
								<option value="action">ACTION</option>
								<option value="dial">DIALOGUE</option>
								<option value="paren">PARENTHETICAL</option>
								<option value="char">CHARACTER</option>
								<option value="trans">TRANSITION</option>
							</select>
						</span>

						<button onclick="clearScript();" class="optionsButton">Clear<br/>Script</button>
					</div>

					<div id="rightOptions" style="display: flex; flex-direction: row;">
						<input id="saveBox" type="button" class="optionsButton" value="Save"/>

						<form id="loadForm" style="margin-bottom: 0px;" enctype="multipart/form-data" method="post">
							<label for="loadInput" class="optionsButton">Load</label>
							<input id="loadInput" type="file" class="optionsButton" name="scriptFile" style="display:none;" />
						</form>
						
						<form id="printForm" target="_blank" action="print.php" method="post">
							<input id="printBox" type="button" class="optionsButton" value="Print"/>
							<input id="printInput" type="text" name="scriptObj" style="display:none" />
						</form>
					</div>
				</div>

				<div id="advOptions" class="options">
					<table>
						<tr>
							<td></td>
							<td>SLUGLINE</td>
							<td>ACTION</td>
							<td>DIALOGUE</td>
							<td>PARENTHETICAL</td>
							<td>CHARACTER</td>
							<td>TRANSITION</td>
							<td></td>
						</tr>
						<tr id="leftPadOptions">
							<td>Left Margin</td>
							<td><input type="number" class="optionNum" id="slugPL" />in.</td>
							<td><input type="number" class="optionNum" id="actPL" />in.</td>
							<td><input type="number" class="optionNum" id="dialPL" />in.</td>
							<td><input type="number" class="optionNum" id="parenPL" />in.</td>
							<td><input type="number" class="optionNum" id="charPL" />in.</td>
							<td><input type="number" class="optionNum" id="transPL" />in.</td>
							<td>Lock? <input type="checkbox" /></td>
						</tr>
						<tr id="rightPadOptions">
							<td>Right Margin</td>
							<td><input type="number" class="optionNum" id="slugPR" />in.</td>
							<td><input type="number" class="optionNum" id="actPR" />in.</td>
							<td><input type="number" class="optionNum" id="dialPR" />in.</td>
							<td><input type="number" class="optionNum" id="parenPR" />in.</td>
							<td><input type="number" class="optionNum" id="charPR" />in.</td>
							<td><input type="number" class="optionNum" id="transPR" />in.</td>
							<td>Lock? <input type="checkbox" /></td>
						</tr>
					</table>
				</div>
			</div>
			
			<div id="titleContainer">
				<span id="title" contenteditable="true" class="title">Title</span>
				by
				<span id="author" contenteditable="true" class="title">Author</span>
			</div>
			<div id="screenplay" contenteditable="true" draggable="false"></div>
		</div>
    </body>

	<!-- <script src="ckeditor/ckeditor.js"></script> -->
	<script src="pdfmake/pdfmake.min.js"></script>
	<script src="pdfmake/vfs_fonts.js"></script>
    <script src="FileSaver.js"></script>
	<script src="defaultScreenplays.js"></script>
	<script src="screenplayElemClass.js"></script>
	<script src="screenplay.js"></script>
	<script src="js.js"></script>
	<script src="styleScripts.js"></script>
</html>