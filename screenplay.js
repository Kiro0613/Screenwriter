var screenplay = document.getElementById("screenplay");

screenplay.addElement = function(elemType, insert, text){
	switch(elemType){
		case undefined:
			elemType = 1;
			break;
		case "slug":
			elemType = 0;
			break;
		case "action":
			elemType = 1;
			break;
		case "dial":
			elemType = 2;
			break;
		case "paren":
			elemType = 3;
			break;
		case "name":
			elemType = 4;
			break;
		case "trans":
			elemType = 5;
			break;
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
	
	try{
		typeSelector.selectedIndex = screenplay.activeElem.elemType();
	} catch(error){
		typeSelector.selectedIndex = 0;
	}
}

screenplay.onchange = function(){console.log("Test")}

screenplay.onkeydown = function(event){
	undo.autosaveTimer = 0;
	screenplay.findActiveElem();
	
	switch(event.code){
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
			window.getSelection().getRangeAt(0).setStart(screenplay.activeElem, 0);
			break;
		case "Backspace":
			if(screenplay.childElementCount == 1){
				event.preventDefault();
			}
		case "ArrowUp":
			if(screenplay.activeElem.previousSibling == null){break;}
			screenplay.activeElem = screenplay.activeElem.previousSibling;
			typeSelector.selectedIndex = screenplay.activeElem.elemType();
			break;
		case "ArrowDown":
			if(screenplay.activeElem.nextSibling == null){break;}
			screenplay.activeElem = screenplay.activeElem.nextSibling;
			typeSelector.selectedIndex = screenplay.activeElem.elemType();
			break;
		case "KeyX":
			if(event.ctrlKey){
				event.preventDefault();
				clipboard.cut();
			}
			break;
		case "KeyC":
			if(event.ctrlKey){
				event.preventDefault();
				clipboard.copy();
			}
			break;
		case "KeyV":
			if(event.ctrlKey){
				event.preventDefault();
				clipboard.paste();
			}
			break;
		case "KeyZ":
			if(event.ctrlKey){
				event.preventDefault();
				undo.undo();
			}
			break;
		case "KeyY":
			if(event.ctrlKey){
				event.preventDefault();
				undo.redo();
			}
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