var screenplay = document.getElementById("screenplay");
var x;

screenplay.addElement = function(){
    console.log("here1");
    x = this.children[0].appendChild(newScreenplayElem());
}

screenplay.deleteElement = function(){
	console.log("Deleting Element");
	console.log(this.children[0]);
    if(this.children[0].children.length <= 1){
        console.log("Did not delete: Cannot delete last element in script");
    } else {
        this.children[0].removeChild(this.children[0].lastChild);
    }
}

screenplay.keyPress = function(){
	console.log("here2");
}

function newScreenplayElem(){
    var newElem = document.createElement("div");
	newElem.contentEditable = true;
    newElem.addEventListener("keydown", parent.keyPress);
	newElem.className = "action";
	newElem.innerHTML = "Action Element";

    return newElem;
}