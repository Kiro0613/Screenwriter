var screenplay = document.getElementById("screenplay");
screenplay["code"] = {
    nodes : [],
    page : [],
    activeElem : null,

    addElement : function(){
        console.log("here1");
        this.nodes.push(newScreenplayElem());
        this.page[this.activeElem.page].fillPage();
    },

    deleteLastElement : function(){
        console.log(this.nodes.length);
        if(this.nodes.length <= 1){
            console.log("Did not delete: Cannot delete last element in script");
        } else {
            this.nodes.pop();
            this.page[this.activeElem.page].fillPage();
        }
    },

    createPage : function(){
        this.page.push(newPage());
    },

    deletePage : function(){
        this.page.pop();
    },
    
    keyPress : function(){
        console.log("here2");
    },

    updateView : function(){
        
    }
}

function newScreenplayElem(){
    var newElem = document.createElement("DIV");
	newElem.contentEditable = true;
    newElem.addEventListener("keydown", parent.keyPress);
    newElem.addEventListener("focus", function(){screenplay.code.activeElem = this});
	newElem.className = "action";
    newElem.innerHTML = "Action Element";
    newElem.page = null;

    return newElem;
}

function newPage(){
    var newPage = {
        elem : document.createElement("DIV"),
        nodes : [],
        isFull : function(){
            var x = 0;
            for(i = 0; i < this.nodes.length; i++){
                x += this.nodes[i].height;
            }

            return x > this.height;
        },
        fillPage : function(){
            this.nodes.forEach(function(x){
                x.page = null;
            });

            for(i = 0; i < screenplay.code.nodes.length; i++){
                if(screenplay.code.nodes[i].page == null){
                    this.nodes.push(screenplay.code.nodes[i]);
                    screenplay.code.nodes[i].page = 0
                }
            }

            for(i = 0; i < this.nodes.length; i++){
                this.elem.children = null;
                this.elem.appendChild(this.nodes[i]);
            }
            
        }
    }

    newPage.elem.className = "page";

    return newPage;
}

function init(){
    screenplay.code.nodes[0] = document.getElementById("defaultSlug");
    screenplay.code.page[0] = newPage();
    screenplay.code.page[0].elem = document.getElementById("defaultPage");
    screenplay.code.page[0].fillPage();
    screenplay.code.activeElem = screenplay.code.nodes[0];
}

document.addEventListener('DOMContentLoaded', function(event) {
    init();
  })
