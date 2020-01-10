var screenplay = document.getElementById("screenplay");

screenplay.addElement = function(elemType, insert, text){
	if(elemType == undefined){
		elemType = 1;
	}
	
	if(insert){
		this.insertBefore(newScreenplayElem(elemTypes[elemType], text), this.activeElem.nextSibling);
		this.activeElem = this.activeElem.nextSibling;
//		this.activeElem.focus();
		//this.activeElem.setSelectionRange(-1, 0)
	} else {
		this.appendChild(newScreenplayElem(elemTypes[elemType], text));
		this.activeElem = this.lastChild;
//		this.activeElem.focus();
		//window.getSelection().collapseToEnd(this.activeElem);
	}
	
	return this.activeElem;
}

screenplay.deleteLastElement = function(){
	console.log(this.childElementCount);
	if(this.childElementCount <= 1){
		console.log("Did not delete: Cannot delete last element in script");
	} else {
		this.removeChild(this.lastElementChild);
	}
}

screenplay.deleteAllElements = function(){
	var n = this.childElementCount;
	for(i = 0; i < n; i++){
		this.removeChild(this.firstChild);
	}
}

screenplay.clearAll = function(skipPrompt){
	if(skipPrompt != true){
		if(confirm("Are you sure you want to delete the whole script?") == false){
			return;
		}
	}
	screenplay.deleteAllElements();
	
	screenplay.addElement(0, false, "FADE IN:");
	screenplay.addElement(0, false, "");
}

//Sorted by indentation
elemTypes = [
	{
		name : "slug",
		commonName : "SLUGLINE",
		lineWidth : 59,
		index : 0
	}, {
		name : "action",
		commonName : "Action",
		lineWidth : 59,
		index : 1
	}, {
		name : "dial",
		commonName : "Dialogue",
		lineWidth : 32,
		index : 2
	}, {
		name : "paren",
		commonName : "(parenthetical)",
		lineWidth : 20,
		index : 3
	}, {
		name : "name",
		commonName : "CHARACTER",
		lineWidth : 32,
		index : 4
	}, {
		name : "trans",
		commonName : "TRANSITION:",
		lineWidth : 15,
		index : 5
	}
];

function newScreenplayElem(type, text){
    var newElem = document.createElement("SPAN");
	newElem.elemType = type;
	//newElem.contentEditable = elemsEditable;
	newElem.classList.add("element");
	newElem.classList.add(type.name);
    newElem.innerHTML = (text == null ? type.commonName : text);
	newElem.lines = [""];
	
	newElem.scriptIndex = function(){
		for(i = 0; i < screenplay.childElementCount; i++){
			if(screenplay.children[i] == this){return i;}
		}
	}
	
	newElem.shiftType = function(amount){
		var newElemIndex = (this.elemType.index + amount) % 6;
		if(newElemIndex == -1){
			newElemIndex = 5;
		}
		
		if(this.innerHTML == this.elemType.commonName){
			this.innerHTML = elemTypes[newElemIndex].commonName;
		}
		
		this.elemType = elemTypes[newElemIndex];
		this.classList.replace(this.classList[1], elemTypes[newElemIndex].name);
		typeSelector.selectedIndex = this.elemType.index;
	}
	newElem.addEventListener('contextmenu', function(event) {
		event.preventDefault();
		console.log("Test");
		return false;
	}, false);

    return newElem;
}

screenplay.onkeydown = function(event){
	screenplay.activeElem = window.getSelection().anchorNode;
	if(screenplay.activeElem.nodeType == 3){
		screenplay.activeElem = screenplay.activeElem.parentNode;
	}
	
	typeSelector.selectedIndex = screenplay.activeElem.elemType.index;
	
	switch(event.key){
		case "Tab" :
			event.preventDefault();
			screenplay.activeElem.shiftType(event.shiftKey ? -1 : 1);
			break;
		case "Enter" :
			event.preventDefault();
			var cutOff = screenplay.activeElem.innerHTML.slice(window.getSelection().anchorOffset);
			if(cutOff == ""){
				cutOff = "<br />";
			}
			
			var leftover = screenplay.activeElem.innerHTML.slice(0, window.getSelection().anchorOffset);
			if(leftover == ""){
				leftover = "<br />";
			}
			
			screenplay.activeElem.innerHTML = leftover;
			screenplay.addElement(1, true);
			screenplay.activeElem.innerHTML = cutOff;
			window.getSelection().getRangeAt(0).setStart(screenplay.activeElem, 0)
			break;
		case "ArrowUp":
			if(screenplay.activeElem.previousSibling == null){break;}
			screenplay.activeElem = screenplay.activeElem.previousSibling;
			typeSelector.selectedIndex = screenplay.activeElem.elemType.index;
			break;
		case "ArrowDown":
			if(screenplay.activeElem.nextSibling == null){break;}
			screenplay.activeElem = screenplay.activeElem.nextSibling;
			typeSelector.selectedIndex = screenplay.activeElem.elemType.index;
			break;
	}
}

screenplay.onclick = function(){
	screenplay.activeElem = window.getSelection().anchorNode;
	if(screenplay.activeElem.nodeType == 3){
		screenplay.activeElem = screenplay.activeElem.parentNode;
	}
	
	typeSelector.selectedIndex = screenplay.activeElem.elemType.index;
}

function init(){
	var doFiller = false;
	
	if(doFiller){
		writeFromScriptObject(barbalow);
	} else {
		screenplay.addElement(0);
		screenplay.activeElem.innerHTML = "FADE IN:";
		screenplay.addElement(0);
		screenplay.activeElem.innerHTML = "<br />";
		optionsInit();
	}
}

//Default Script Objects
var barbalow = {
	content : ["FADE IN:", "INT. BARBALOW CAFE - DAY", "Patrons chirp at one another and waiters bustle around carrying coffees and pastries. At one of the tables is JAMES, a Matrix-clad thirtysomething with slick-backed hair and a leather coat, pounding away on his laptop.", "WAITRESS", "(nervous)", "Excuse me, sir? Would you like anything?", "James turns to her and nods with a smug grin. He continues his typing with one hand.", "JAMES", "No, thanks. I'm cool. Say, why don't you get yourself a drink, on me? I should have the money in three, two...", "James's laptop beeps violently and a cash register noise is heard.", "JAMES (cont'd)", "And, done! There we go - I've hacked into the mainframe of the Trustworthy Pioneer Bank and transferred twenty million dollars straight from those corporate bigwigs' accounts into mine. It's okay to be impressed, baby.", "FADE TO:", "EXT. ALLEYWAY - SUNSET", "JAMES drives down the street. He parallel parks next to an abandoned warehouse with a sign reading \"WARNING: NO ILLEGAL ACTIVITY OCCURS HERE. PLEASE LOOK AWAY.\"", "James gets out of his car, fedora pulled low over his head. He walks into the alley and meets two other men, BROCKO and SHIVA.", "BROCKO", "Ya got the goods?"],
	classes : [0,0,1,4,3,2,1,4,2,1,4,2,5,0,1,1,4,2]
}

document.addEventListener('DOMContentLoaded', function(event) {init();})

var typeSelector = document.getElementById("elementTypeSelector");
typeSelector.onchange = function(){
	var elem = screenplay.activeElem;
	elem.classList.replace(elem.classList[1], elemTypes[this.selectedIndex].name);
}

function createScriptObject(){
	var obj = {content : [], classes : []};
	for(i = 0; i < screenplay.childElementCount; i++){
		obj.content[i] = screenplay.childNodes[i].innerHTML;
		obj.classes[i] = screenplay.childNodes[i].elemType.index;
	}
	
	return obj;
}

function writeFromScriptObject(scriptObj){
	screenplay.deleteAllElements();
	
	for(i = 0; i < scriptObj.content.length; i++){
		screenplay.addElement(scriptObj.classes[i]);
		screenplay.activeElem.innerHTML = scriptObj.content[i];
	}
	
	//screenplay.fixChildrenHeight();
}

var main = document.getElementById("main");

//Loading screenplays
var loadForm = document.createElement("FORM");
loadForm.setAttribute("enctype", "multipart/form-data");
loadForm.setAttribute("method", "post");
var loadInput = document.createElement("INPUT");
loadInput.setAttribute("id", "loadInput");
loadInput.setAttribute("type", "file");
loadInput.setAttribute("name", "scriptFile");
loadInput.style.display = "none";
loadInput.onchange = function(){
	//document.getElementById("loadForm").submit();
	loadFile();
};
var loadLabel = document.createElement("LABEL");
loadLabel.setAttribute("for", "loadInput");
loadLabel.setAttribute("class", "optionsButton");
loadLabel.innerHTML = "Load";
loadForm.appendChild(loadLabel);
loadForm.appendChild(loadInput);

document.getElementById("rightOptions").replaceChild(loadForm, document.getElementById("rightOptions").childNodes[3]);

function loadFile() {
	var file = loadInput.files[0];
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && (this.status == 200 || this.status == 0)) {
			var x = this.responseText;
			
			while(/[0-9]/.test(x.charAt(x.length-1))){
				x = x.slice(0, -1);
			}
			
			try{
				x = JSON.parse(x);
				//x = toDOMCE(JSON.parse(x));
			}catch(e){
				console.error(e);
				alert("Could not load file!");
				return;
			}
			
//			main.replaceChild(x, main.childNodes[5]);
			writeFromScriptObject(x);
			loadInput.value = "";
		}
	};

	xhttp.open("POST", "loadScreenplay.php", true);
	xhttp.send(new FormData(loadForm));
}

//Saving screenplays
var saveBox = document.getElementById("saveBox");
saveBox.onclick = function(){
	saveFile();
}

var saveForm = document.createElement("FORM");
var saveInput = document.createElement("INPUT");
saveInput.setAttribute("type", "text");
saveInput.setAttribute("name", "txt");
saveForm.appendChild(saveInput);

function saveFile(){
	saveInput.setAttribute("value", JSON.stringify(createScriptObject()));
	var saveFormData = new FormData(saveForm);
	
	var xhttp = new XMLHttpRequest();
	xhttp.responseType = "blob";
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && (this.status == 200 || this.status == 0)) {
			var x = this.response;
			
			saveBlob(x, "Testing Blobbles.txt");
		}
	};
	xhttp.open("POST", "saveScreenplay.php", true);
	xhttp.send(saveFormData);
}

function saveBlob(blob) {
    var a = document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = "script.txt";
    a.dispatchEvent(new MouseEvent('click'));
}













