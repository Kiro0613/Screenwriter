screenplay = document.getElementById("screenplay");

function writeFromScriptObject(scriptObj){
	for(i = 0; i < scriptObj.content.length; i++){
		var newElem = document.createElement("SPAN");
		newElem.classList.add(elemTypes[scriptObj.classes[i]]);
		newElem.innerHTML = scriptObj.content[i];
		
		screenplay.appendChild(newElem);
	}
}

var elemTypes = ["slug", "action", "dial", "paren", "name", "trans"];

document.addEventListener('DOMContentLoaded', function(event) {
	writeFromScriptObject(scriptObj);
})