var screenplay = document.getElementById("screenplay");

screenplay.addElement = function(elemType, insert){
	if(elemType == undefined){
		elemType = 1;
	}
	
	if(insert){
		this.insertBefore(newScreenplayElem(elemTypes[elemType]), this.activeElem.nextSibling);
		this.activeElem = this.activeElem.nextSibling;
		this.activeElem.focus();
		//this.activeElem.setSelectionRange(-1, 0)
	} else {
		this.appendChild(newScreenplayElem(elemTypes[elemType]));
		this.activeElem = this.lastChild;
		this.activeElem.focus();
		//window.getSelection().collapseToEnd(this.activeElem);
	}

	//this.activeElem.splitLines();
	
	return this.activeElem;
}

screenplay.deleteLastElement = function(){
	console.log(this.childElementCount);
	if(this.childElementCount<= 1){
		console.log("Did not delete: Cannot delete last element in script");
	} else {
		this.removeChild(this.lastElementChild);
	}
}

screenplay.fixChildrenHeight = function(){
	for(k = 0; k < this.childElementCount; k++){
		this.children[k].splitLines();
	}
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

var elemsEditable = true;
screenplay.contentEditable = !elemsEditable;

function newScreenplayElem(type){
    var newElem = document.createElement("DIV");
	newElem.elemType = type;
	newElem.contentEditable = elemsEditable;
	newElem.classList.add("element");
	newElem.classList.add(type.name);
    newElem.innerHTML = type.commonName;
	newElem.lines = [""];
	
	newElem.scriptIndex = function(){
		for(i = 0; i < screenplay.childElementCount; i++){
			if(screenplay.children[i] == this){return i;}
		}
	}
	
	newElem.addEventListener("click", function(){
		console.log(this.elemType.index);
	});
	
    newElem.addEventListener("focus", function(){
		//this.splitLines();

		screenplay.activeElem = this;
		typeSelector.selectedIndex = this.elemType.index;
	});
	
	newElem.onkeydown = function(event){
		switch(event.key){
			case "Tab" :
				console.log("Here");
				event.preventDefault();
				this.shiftType(event.shiftKey ? -1 : 1);
				break;
			case "Enter" :
				event.preventDefault();
				var cutOff = this.innerHTML.slice(this.caret.pos());
				this.innerHTML = this.innerHTML.slice(0, this.caret.pos());
				screenplay.addElement(1, true);
				screenplay.activeElem.innerHTML = cutOff;
				screenplay.activeElem.caret.toStart();
				break;
			case "ArrowUp":
				if(this.caret.isOnTop() && this.scriptIndex() != 0){
					event.preventDefault();
					screenplay.activeElem = this.previousSibling;
					screenplay.activeElem.focus();
					this.caret.toEnd();
				}
				break;
			case "ArrowDown":
				if(this.caret.isOnBottom() && this.scriptIndex() != screenplay.childElementCount - 1){
					event.preventDefault();
					screenplay.activeElem = this.nextSibling;
					screenplay.activeElem.focus();
					this.caret.toStart();
				}
				break;
			case "Backspace":
				if(this.caret.pos() == 0 && this.scriptIndex() != 0){
					event.preventDefault();
					var txt = this.innerHTML;
					screenplay.activeElem = this.previousSibling;
					screenplay.activeElem.innerHTML += txt;
					screenplay.activeElem.focus();
					window.getSelection().collapseToEnd(screenplay.activeElem);
					screenplay.removeChild(screenplay.activeElem.nextElementSibling);
					screenplay.activeElem.caret.toPos(screenplay.activeElem.innerHTML.length - txt.length);
				}
				break;
		}
		
		this.splitLines();
	}
	
	newElem.onchange = function(){
		//this.splitLines();
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
		
		this.splitLines();
	}
	
	newElem.caret = {
		pos : function(){
			return window.getSelection().anchorOffset;
		},
		posFromEnd : function(){
			return this.innerHTML.length - this.pos();
		},
		isOnTop : function(){
			screenplay.activeElem.splitLines();
			return screenplay.activeElem.lines[0].length - this.pos() >= 0;
		},
		isOnBottom : function(){
			screenplay.activeElem.splitLines();
			elem = screenplay.activeElem;
			return elem.innerHTML.length - elem.lines[elem.lines.length-1].length <= this.pos();
		},
		toStart : function(){
			window.getSelection().collapseToStart();
		},
		toEnd : function(){
			window.getSelection().collapseToEnd()
		},
		toPos : function (x){
			var anchor = window.getSelection().anchorNode;
			window.getSelection().setBaseAndExtent(this.anchor(), x, this.anchor(), x);
		},
		isHighlighting : function(){
			return window.getSelection.isCollapsed;
		},
		anchor : function(){
			return window.getSelection().anchorNode;
		}
	}
	
	newElem.splitLines = function(){
		var words = this.innerHTML.replace(/([A-z])-([A-z])/g, "$1- $2").split(" ");
		var lines = [words[0]];
		for(i = 1, j = 0; i < words.length; i++){
			if(lines[j].charAt(lines[j].length - 1) == "-"){
				if(lines[j].length + words[i].length <= this.elemType.lineWidth){
					lines[j] += words[i]; 
				} else {
					//console.log("here 2");
					j++;
					lines[j] = words[i];
				}
			} else if(lines[j].length + words[i].length + 1 <= this.elemType.lineWidth){
				//console.log("here 1");
				lines[j] += (" " + words[i]); 
			} else {
				//console.log("here 2");
				j++;
				lines[j] = words[i];
			}
		}
//		this.lines = lines;
//		this.rows = this.lines.length;
	}

    return newElem;
}

function init(){
//	screenplay.activeElem = screenplay.children[0];
//	screenplay.activeElem.innerHTML = "Patrons chirp at one another and waiters bustle around carrying coffees and pastries. At one of the tables is JAMES, a Matrix-clad thirtysomething with slick-backed hair and a leather coat, pounding away on his laptop.";
	//writeFiller();
	screenplay.addElement(0);
	optionsInit();
}

document.addEventListener('DOMContentLoaded', function(event) {
	init();
})

var typeSelector = document.getElementById("elementTypeSelector");
typeSelector.onchange = function(){
	var elem = screenplay.activeElem;
	elem.classList.replace(elem.classList[1], elemTypes[this.selectedIndex].name);
}

function writeFiller(){
	var content = [
		"FADE IN:",
		"INT. BARBALOW CAFE - DAY",
		"Patrons chirp at one another and waiters bustle around carrying coffees and pastries. At one of the tables is JAMES, a Matrix-clad thirtysomething with slick-backed hair and a leather coat, pounding away on his laptop.",
		"WAITRESS",
		"(nervous)",
		"Excuse me, sir? Would you like anything?",
		"James turns to her and nods with a smug grin. He continues his typing with one hand.",
		"JAMES",
		"No, thanks. I'm cool. Say, why don't you get yourself a drink, on me? I should have the money in three, two...",
		"James's laptop beeps violently and a cash register noise is heard.",
		"JAMES (cont'd)",
		"And, done! There we go - I've hacked into the mainframe of the Trustworthy Pioneer Bank and transferred twenty million dollars straight from those corporate bigwigs' accounts into mine. It's okay to be impressed, baby.",
		"FADE TO:",
		"EXT. ALLEYWAY - SUNSET",
		"JAMES drives down the street. He parallel parks next to an abandoned warehouse with a sign reading \"WARNING: NO ILLEGAL ACTIVITY OCCURS HERE. PLEASE LOOK AWAY.\"",
		"James gets out of his car, fedora pulled low over his head. He walks into the alley and meets two other men, BROCKO and SHIVA.",
		"BROCKO",
		"Ya got the goods?"
  	]
	
	var classes = [0, 0, 1, 4, 3, 2, 1, 4, 2, 1, 4, 2, 5, 0, 1, 1, 4, 2];
	for(i = 0; i < classes.length; i++){
		screenplay.addElement(classes[i]);
		screenplay.activeElem.innerHTML = content[i];
	}
	
	//screenplay.fixChildrenHeight();
}

var main = document.getElementById("main");

var saveBox = document.getElementById("saveBox");

var loadBox = document.getElementById("loadBox");
loadBox.onchange = function(){
	//document.getElementById("loadForm").submit();
	loadFile();
};

var printBox = document.getElementById("printBox");

var loadFormData;


function loadFile() {
	loadFormData = new FormData(document.getElementById("loadForm"));
	var file = loadBox.files[0];
	console.log(file);
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && (this.status == 200 || this.status == 0)) {
			var x = this.responseText;
			x = JSON.parse(x);
			main.replaceChild(toDOMCE(x), main.childNodes[5]);
		}
	};

	xhttp.open("POST", "loadScreenplay.php", true);
	xhttp.send(loadFormData);
}