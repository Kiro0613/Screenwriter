var screenplay = document.getElementById("screenplay");
var x;

screenplay.addElement = function(){
    console.log("here");
    x = this.appendChild(newScreenplayElem());
}

screenplay.deleteElement = function(){
    if(this.children.length <= 1){
        console.log("Did not delete: Cannot delete last element in script");
    } else {
        this.removeChild(this.lastChild);
    }
}

screenplay.keyPress(){

}

function newScreenplayElem(){
    var newElem = document.createElement("textarea");
    newElem.addEventListener("keydown", parent.keyPress);

    return newElem;
}