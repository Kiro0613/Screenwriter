var main = document.getElementById("main");
var contextMenu = document.getElementById("contextMenu");

function changeType(newType){
	screenplay.activeElem.changeType(newType);
}

function init(){
	var doFiller = true;
	
	if(doFiller){
		writeFromScriptObject(barbalow);
	} else {
		screenplay.addElement(0);
		screenplay.activeElem.innerHTML = "FADE IN:";
		screenplay.addElement(0);
		screenplay.activeElem.innerHTML = "<br />";
		optionsInit();
	}
	
	undo.pushStack();
}

document.addEventListener('DOMContentLoaded', function(event) {init();})

var typeSelector = document.getElementById("elementTypeSelector");
typeSelector.onchange = function(){
	screenplay.activeElem.changeType(this.selectedIndex);
}

/*
	SAVE AND LOAD
*/

function createScriptObject(){
	var obj = {content : [], classes : [], activeElemIndex : 0, caretPos : 0};
	obj.activeElemIndex = screenplay.activeElem.posInScreenplay();
	obj.caretPos = window.getSelection().anchorOffset;
	
	for(i = 0; i < screenplay.childElementCount; i++){
		obj.content[i] = screenplay.childNodes[i].innerHTML;
		obj.classes[i] = screenplay.childNodes[i].elemType();
	}
	
	return obj;
}

function writeFromScriptObject(scriptObj){
	screenplay.deleteAllElements();
	
	for(i = 0; i < scriptObj.content.length; i++){
		screenplay.addElement(scriptObj.classes[i]);
		screenplay.activeElem.innerHTML = scriptObj.content[i];
	}
	
	if(scriptObj.activeElemIndex == undefined){
		scriptObj.activeElemIndex = 0;
	}
	
	screenplay.activeElem = screenplay.childNodes[scriptObj.activeElemIndex];
	typeSelector.selectedIndex = screenplay.activeElem.elemType();
	
	if(scriptObj.caretPos == undefined){
		scriptObj.caretPos = 0;
	}
	
	screenplay.activeElem.setCaretPos(scriptObj.caretPos);
}

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

//PRINTING
var printBox = document.getElementById("printBox");
printBox.onclick = function(){
	printInput.setAttribute("value", JSON.stringify(createScriptObject()));
	var printFormData = new FormData(printForm);
	
	printForm.submit();
}

var printForm = document.getElementById("printForm");
var printInput = document.getElementById("printInput");

//Shortcut for window.getSelection().getRangeAt(0)
function range(){
	return window.getSelection().getRangeAt(0);
}

//Copy/Past Stuff
var clipboard = {
	cut : function(fromContext){
		if(fromContext){
			window.getSelection().removeAllRanges();
			window.getSelection().addRange(clipboard.contextTemp);
		}
		
		if(window.getSelection().isCollapsed){
			return false;
		}
		
		undo.pushStack();
		
		console.log(clipboard.contextTemp);
		//fromContext tells if function was activated from context menu
		//and 
		
		this.value = range().extractContents();
		return this.value;
	},
	
	copy : function(fromContext){
		if(fromContext){
			window.getSelection().removeAllRanges();
			window.getSelection().addRange(clipboard.contextTemp);
		}
		
		if(window.getSelection().isCollapsed){
			return false;
		}
		
		this.value = range().cloneContents();
		return this.value;
	},
	
	paste : function(fromContext){
		undo.pushStack();
		
		if(fromContext){
			window.getSelection().removeAllRanges();
			window.getSelection().addRange(clipboard.contextTemp);
		}
		
		range().deleteContents();
		
		var beforeCaret = screenplay.activeElem.innerHTML.slice(0, window.getSelection().anchorOffset);
		if(beforeCaret == ""){
			beforeCaret = "<br />";
		}

		var afterCaret = screenplay.activeElem.innerHTML.slice(window.getSelection().anchorOffset);
		if(afterCaret == ""){
			afterCaret = "<br />";
		}
		
		if(this.value.childElementCount == 0){
			screenplay.activeElem.innerHTML = beforeCaret + clipboard.value.textContent + afterCaret;
			window.getSelection().collapse(screenplay.activeElem.firstChild, beforeCaret.length + clipboard.value.textContent.length);
			return;
		}

		screenplay.activeElem.innerHTML = beforeCaret + this.value.children[0].innerHTML;
//		screenplay.addElement(1, true);
//		screenplay.insertBefore(this.value, screenplay.activeElem);
		
		for(i = 1; i < this.value.childElementCount; i++){
			var type = this.value.children[i].classList[1];
			var text = this.value.children[i].innerHTML;
			screenplay.addElement(type, true, text);
		}
		
		screenplay.activeElem.innerHTML += afterCaret;
	},
	contextTemp : undefined,
	value : ""
}

document.addEventListener('contextmenu', function(event) {
	clipboard.contextTemp = window.getSelection().getRangeAt(0);
}, false);

var undo = {
	undo : function(){
//		if(this.stack[this.stackPos+1] == undefined){
//			return;
//		}
		
		if(this.stackPos < (this.stack.length - 1)){
			this.stackPos++;
			writeFromScriptObject(this.stack[this.stackPos]);
		}
		
//		console.log(this.stack.length);
	},
	redo : function(){
		if(this.stackPos > 0){
			this.stackPos--;
			writeFromScriptObject(this.stack[this.stackPos]);
		}
		
//		console.log(this.stack.length);
	},
	pushStack : function(){
		var newState = createScriptObject();
		if(newState != this.stack[this.stackPos]){
			if(this.stackPos != -1){
				this.clearStack();
			}
			this.stack.splice(0, 0, createScriptObject());
		}
		
//		console.log(this.stack.length);
	},
	clearStack : function(){
		this.stack = this.stack.slice(this.stackPos);
		this.stackPos = -1;
//		console.log("Stack cleared - new length " + this.stack.length);
	},
	stack : [],
	stackPos : -1,	//pos -1 means not undo state
	stackLimit : 100,
	autosaveTimeLimit : 3000,
	autosaveTimer : this.autosaveTimeLimit + 1
}

window.setInterval(function(){
	undo.autosaveTimer++;
	if(undo.autosaveTimer == undo.autosaveTimeLimit){
		undo.pushStack();
	}
}, 1)



