var main = document.getElementById("main");
var contextMenu = document.getElementById("contextMenu");

function changeType(newType){
	screenplay.activeElem.changeType(newType);
}

var doFiller = true;
var clipboardDisabled = false;

function init(){
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
	
	if(clipboardDisabled == false){
		document.getElementById("contextHr").style.display = "none";
		document.getElementById("contextCut").style.display = "none";
		document.getElementById("contextCopy").style.display = "none";
		document.getElementById("contextPaste").style.display = "none";
	}
}

document.addEventListener('DOMContentLoaded', function(event) {init();})

var typeSelector = document.getElementById("elementTypeSelector");
typeSelector.onchange = function(){
	screenplay.activeElem.changeType(this.selectedIndex);
    //screenplay.activeElem.replaceWith(newScreenplayElem(elemTypes[document.getElementById("elementTypeSelector").selectedIndex], screenplay.activeElem.innerHTML));
}

function clearScript(skipPrompt){
	if(skipPrompt != true){
		if(confirm("Are you sure you want to delete the whole script?") == false){
			return;
		}
	}
    
	document.getElementById("title").innerHTML = "Title";
	document.getElementById("author").innerHTML = "Author";
    
	screenplay.deleteAllElements();
	screenplay.addElement(0, false, "FADE IN:");
	screenplay.addElement(0, false, "");
}

/*
	SAVE AND LOAD
*/

function createScriptObject(){
	var obj = {
		content : [],
		classes : [],
		activeElemIndex : 0,
		caretPos : 0,
		title : "",
		author : ""
	};
	
	obj.activeElemIndex = screenplay.activeElem.posInScreenplay();
	obj.caretPos = window.getSelection().anchorOffset;
	obj.title = document.getElementById("title").innerHTML;
	obj.author = document.getElementById("author").innerHTML;
	
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
	
	//Initializing potentially uninitialized values
	if(scriptObj.activeElemIndex == undefined){
		scriptObj.activeElemIndex = 0;
	}
	
	if(scriptObj.caretPos == undefined){
		scriptObj.caretPos = 0;
	}
	
	if(scriptObj.title == undefined){
		scriptObj.title = "Title"
	}
	
	if(scriptObj.author == undefined){
		scriptObj.author = "Author"
	}
	//Done initing!
	
	screenplay.activeElem = screenplay.childNodes[scriptObj.activeElemIndex];
	
	document.getElementById("title").innerHTML = scriptObj.title;
	document.getElementById("author").innerHTML = scriptObj.author;
	
	typeSelector.selectedIndex = screenplay.activeElem.elemType();
	screenplay.activeElem.setCaretPos(scriptObj.caretPos);
}

//Loading screenplays
var loadForm = document.getElementById("loadForm");
var loadInput = document.getElementById("loadInput");
loadInput.onchange = function(){
	loadFile();
};

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

//function saveFile(){
//	saveInput.setAttribute("value", JSON.stringify(createScriptObject()));
//	var saveFormData = new FormData(saveForm);
//	
//	var xhttp = new XMLHttpRequest();
//	xhttp.responseType = "blob";
//	xhttp.onreadystatechange = function() {
//		if (this.readyState == 4 && (this.status == 200 || this.status == 0)) {
//			var x = this.response;
//			
//			saveBlob(x, "Testing Blobbles.txt");
//		}
//	};
//	xhttp.open("POST", "saveScreenplay.php", true);
//	xhttp.send(saveFormData);
//}
//
//function saveBlob(blob) {
//    var a = document.createElement('a');
//    a.href = window.URL.createObjectURL(blob);
//    a.download = document.getElementById("title").innerHTML + ".json";
//    a.dispatchEvent(new MouseEvent('click'));
//}

function saveFile(){
    var scriptString = JSON.stringify(createScriptObject());
    
    var bytes = new Array(scriptString.length);
    for (var i = 0; i < scriptString.length; i++) {
    bytes[i] = scriptString.charCodeAt(i);
    }

    var blob = new Blob([new Uint8Array(bytes)]);
    
    saveAs(blob, document.getElementById("title").innerHTML + ".json");
}

//PRINTING
var printBox = document.getElementById("printBox");
printBox.onclick = function(){
//	printInput.setAttribute("value", JSON.stringify(createScriptObject()));
//	var printFormData = new FormData(printForm);
//	
//	printForm.submit();
	writePdf();
	openPdf();
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
		if(clipboardDisabled){return;}
		
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
	
	copy : function(fromContext, event){
		if(clipboardDisabled){return;}
		
		test = event.clipboardData;
		
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
		if(clipboardDisabled){return;}
		
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

var test;

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

//Values in inches; Multiply by 72 for pt
var elemMargins = [
	{l : 1.5, r : 1, w : 6},
	{l : 1.5, r : 1, w : 6},
	{l : 2.9, r : 2.3, w : 3.5},
	{l : 3.6, r : 2.9, w : 2.5},
	{l : 4.2, r : 1, w : 4},
	{l : 6, r : 1, w : 2}
];

pdfMake.fonts = {
   Courier: {
     normal: 'cour.ttf',
   }
}

var pdf = {
	content : [],
	styles : {
		slug : {
			margin : [elemMargins[0].l * 72, 0, elemMargins[0].r * 72, 12]
		},
		action : {
			margin : [elemMargins[1].l * 72, 0, elemMargins[1].r * 72, 12]
		},
		dial : {
			margin : [elemMargins[2].l * 72, 0, elemMargins[2].r * 72, 12]
		},
		paren : {
			margin : [elemMargins[3].l * 72, 0, elemMargins[3].r * 72, 0]
		},
		name : {
			margin : [elemMargins[4].l * 72, 0, elemMargins[4].r * 72, 0]
		},
		trans : {
			margin : [elemMargins[5].l * 72, 0, elemMargins[5].r * 72, 12]
		},
		title : {
			margin : [1.5*72, 12*16, 72, 0],
			alignment : 'center'
		}
	},
	defaultStyle : {
		font : 'Courier',
		fontSize : 12
	},
	pageSize : "LETTER",
	pageMargins : [0, 72, 0, 72],
	pageBreakBefore: function(currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
		return (currentNode.style == "name" || currentNode.style == "paren") && followingNodesOnPage.length === 0;
	},
	header: function(currentPage, pageCount, pageSize) {
		return[{
			text : (currentPage > 2 ? (currentPage - 1) + "." : ""),
			absolutePosition : {x : 7.5*72 - 12, y : 36}
		}]
	}
}

function writePdf(){
	pdf.content = [];
	
	pdf.content.push({
		text : document.getElementById("title").innerHTML + "\n\nby\n\n" + document.getElementById("author").innerHTML,
		style : 'title',
		pageBreak : 'after'
	});
	
	for(i = 0; i < screenplay.childElementCount; i++){
		var pdfElem = {
			text : screenplay.childNodes[i].innerHTML,
			style : screenplay.childNodes[i].classList[0]
		};
		
		if(pdfElem.style == "slug" || pdfElem.style == "trans"){
			pdfElem.text = pdfElem.text.toUpperCase();
		}
		
		pdf.content.push(pdfElem);
	}
}

function savePdf(){
	pdfMake.createPdf(pdf).download();
}

function openPdf(){
	pdfMake.createPdf(pdf).open();
}




