<!DOCTYPE html>
<html>
    <head>
        <title>Screenwriter</title>
        <link rel="stylesheet" type="text/css" href="style.css" />
    </head>

    <body>
	<div id="main">
        <h1>Screenwriter</h1>
		<div id="optionsWrapper" class="optionsWrapper">
			<div id="options" class="options">
				<div id="leftOptions" style="display: flex; flex-direction: row;">
					<span id="fontSizePicker" class="option tooltip">
						<h4>Font Size</h4>
						<input type="number" min="1" max="216" value="12" />
						<span class="tooltiptext">A screenplay should always 12pt font. Use only because of screen size or eyesight!</span>
					</span>

					<button onclick="screenplay.addElement();" class="optionsButton">Add<br/>Row</button>

					<button onclick="screenplay.deleteLastElement();" class="optionsButton">Remove<br/>Row</button>

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
					
					<button onclick="screenplay.clearAll();" class="optionsButton">Clear<br/>Script</button>
				</div>
				
				<div id="rightOptions" style="display: flex; flex-direction: row; margin-right: 4px;">
					<input id="saveBox" type="button" class="optionsButton" value="Save" onclick="" />

					<form id="loadForm" style="margin-bottom: 0px;">
						<label for="loadBox" class="optionsButton">Load</label>
						<input id="loadBox" type="file" class="optionsButton" name="loadBox" style="display:none;" />
					</form>

					<input id="printBox" type="button" class="optionsButton" value="Print" />
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
						<td><input type="number" class="optionNum" id="slugPL">in.</td>
						<td><input type="number" class="optionNum" id="actPL">in.</td>
						<td><input type="number" class="optionNum" id="dialPL">in.</td>
						<td><input type="number" class="optionNum" id="parenPL">in.</td>
						<td><input type="number" class="optionNum" id="charPL">in.</td>
						<td><input type="number" class="optionNum" id="transPL">in.</td>
						<td>Lock? <input type="checkbox"></td>
					</tr>
					<tr id="rightPadOptions">
						<td>Right Margin</td>
						<td><input type="number" class="optionNum" id="slugPR">in.</td>
						<td><input type="number" class="optionNum" id="actPR">in.</td>
						<td><input type="number" class="optionNum" id="dialPR">in.</td>
						<td><input type="number" class="optionNum" id="parenPR">in.</td>
						<td><input type="number" class="optionNum" id="charPR">in.</td>
						<td><input type="number" class="optionNum" id="transPR">in.</td>
						<td>Lock? <input type="checkbox"></td>
					</tr>
				</table>
			</div>
		</div>

        <div id="screenplay" contenteditable="true"></div>
	</div>
    </body>
	
    <script src="js.js"></script>
    <script src="styleScripts.js"></script>
	
</html>