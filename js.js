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

screenplay.findActiveElem = function(){
	screenplay.activeElem = window.getSelection().anchorNode;
	if(screenplay.activeElem.nodeType == 3){
		screenplay.activeElem = screenplay.activeElem.parentNode;
	}
	
	typeSelector.selectedIndex = screenplay.activeElem.elemType.index;
}

screenplay.onkeydown = function(event){
	screenplay.findActiveElem();
	
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
	screenplay.findActiveElem();
}

screenplay.addEventListener('contextmenu', function(event) {
	event.preventDefault();
	
	screenplay.findActiveElem();
	
	var xOvershoot = contextMenu.offsetWidth - (window.innerWidth - 20 - event.clientX);
	var yOvershoot = contextMenu.offsetHeight - (window.innerHeight - 20 - event.clientY);
	
	contextMenu.style.left = (event.pageX - 1 - (xOvershoot > 0 ? xOvershoot : 0)) + "px";
	contextMenu.style.top = (event.pageY - 1 - (yOvershoot > 0 ? yOvershoot : 0)) + "px";
	contextMenu.style.visibility = "visible";

	return false;
}, false);

window.onclick = function(event){
	if(event.target != contextMenu){
		contextMenu.style.visibility = "hidden";
	}
}

var main = document.getElementById("main");
var contextMenu = document.getElementById("contextMenu");

function changeType(newType){
	screenplay.activeElem.changeType(newType);
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

document.addEventListener('DOMContentLoaded', function(event) {init();})

var typeSelector = document.getElementById("elementTypeSelector");
typeSelector.onchange = function(){
	screenplay.activeElem.changeType(this.selectedIndex);
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













