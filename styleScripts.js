var styleBase;

var elemStyle = {
	slug : "",
	action : "",
	dial : "",
	paren : "",
	name : "",
	trans : "",
	getOptions : function(){
		var styleArr = [this.slug, this.action, this.dial, this.paren, this.name, this.trans];
		var leftPads = document.getElementById("leftPadOptions").childNodes;
		for(i = 0; i < 6; i++){
			styleArr[i].paddingLeft = leftPads[i+1].firstChild.value;
		}
	},
	setOptions : function(){
		var styleArr = [this.slug, this.action, this.dial, this.paren, this.name, this.trans];
		var leftPads = document.getElementById("leftPadOptions").childNodes;
		for(i = 0; i < 6; i++){
			//console.log(styleArr[i].paddingLeft)
			//leftPads[i+1].firstChild.value = styleArr[i].paddingLeft;
		}
	}
}

function ElemStyleClass(padL, padR){
	
}

function optionsInit(){
	var base = document.createElement("DIV");
	styleBase = base.style;
	
	elemStyle.slug = styleBase;
	elemStyle.slug.paddingLeft = "1.5in";
	elemStyle.slug.paddingRight = "1in";
	
	elemStyle.action = styleBase;
	elemStyle.action.paddingLeft = "1.5in";
	elemStyle.action.paddingRight = "1in";
	
	elemStyle.dial = styleBase;
	elemStyle.dial.paddingLeft = "2.9in";
	elemStyle.dial.paddingRight = "2.3in";
	
	elemStyle.paren = styleBase;
	elemStyle.paren.paddingLeft = "3.6in";
	elemStyle.paren.paddingRight = "2.9in";
	
	elemStyle.name = styleBase;
	elemStyle.name.paddingLeft = "4.2in";
	elemStyle.name.paddingRight = "1in";
	
	elemStyle.trans = styleBase;
	elemStyle.trans.paddingLeft = "6in";
	elemStyle.trans.paddingRight = "1in";
	
	elemStyle.setOptions();
}

function setStyle(cssClass, styleObj){
	document.getElementsByClassName(cssClass).forEach(
		function(item){item.style = styleObj}
	)
}