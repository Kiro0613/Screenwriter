var screenplay = document.getElementById("screenplay");
var x;

screenplay.addElement = function(){
    console.log("here1");
    x = this.appendChild(newScreenplayElem());
}

screenplay.deleteElement = function(){
    if(this.children.length <= 1){
        console.log("Did not delete: Cannot delete last element in script");
    } else {
        this.removeChild(this.lastChild);
    }
}

screenplay.keyPress = function(){
	console.log("here2");
}

function newScreenplayElem(){
    var newElem = document.createElement("div");
	newElem.contentEditable = true;
    newElem.addEventListener("keydown", parent.keyPress);

    return newElem;
}