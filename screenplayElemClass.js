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
	},
	["slug", "action", "dial", "paren", "name", "trans"]
];

function newScreenplayElem(type, text){
    var newElem = document.createElement("SPAN");
	//newElem.contentEditable = elemsEditable;
	newElem.classList.add(type.name);
    newElem.innerHTML = (text == null ? type.commonName : text);
	newElem.lines = [""];
	
	newElem.elemType = function(typeFormat){
		switch(typeFormat){
			case "string":
				return this.classList[0];
			default:
				return elemTypes[6].indexOf(this.classList[0]);
		}
	}
	
	newElem.scriptIndex = function(){
		for(i = 0; i < screenplay.childElementCount; i++){
			if(screenplay.children[i] == this){return i;}
		}
	}
	
	newElem.shiftType = function(amount){
		var newElemIndex = (this.elemType() + amount) % 6;
		if(newElemIndex == -1){
			newElemIndex = 5;
		}
		
		if(this.innerHTML == this.elemType.commonName){
			this.innerHTML = elemTypes[newElemIndex].commonName;
		}
		
		this.classList.replace(this.classList[0], elemTypes[newElemIndex].name);
		typeSelector.selectedIndex = this.elemType();
	}
	
	newElem.changeType = function(newType){
		//this.elemType = elemTypes[newType];
		this.classList.replace(this.classList[0], elemTypes[newType].name);
		typeSelector.selectedIndex = this.elemType();
	}
	
	newElem.posInScreenplay = function(){
		for(i = 0; i < screenplay.childElementCount; i++){
			if(this == screenplay.childNodes[i]){
				return i;
			}
		}
		
		return -1;
	}
	
	newElem.setCaretPos = function(index){
		if(window.getSelection().rangeCount == 0){
			return false;
		}
		
		window.getSelection().getRangeAt(0).setStart(this.firstChild, index);
		window.getSelection().getRangeAt(0).setEnd(this.firstChild, index);
	}
	
	newElem.addEventListener("dragstart", function(e){
		e.preventDefault();
	});
	
//	newElem.addEventListener('contextmenu', function(event) {
//		event.preventDefault();
//		contextMenu.style.left = event.clientX + "px";
//		contextMenu.style.top = event.clientY + "px";
//		
//		return false;
//	}, false);

    return newElem;
}