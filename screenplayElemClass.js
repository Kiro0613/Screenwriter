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
	
//	newElem.addEventListener('contextmenu', function(event) {
//		event.preventDefault();
//		contextMenu.style.left = event.clientX + "px";
//		contextMenu.style.top = event.clientY + "px";
//		
//		return false;
//	}, false);

    return newElem;
}