function toJSON(node) {
  let propFix = { for: 'htmlFor', class: 'className' };
  let obj = {
    nodeType: node.nodeType,
  };
  if (node.tagName) {
    obj.tagName = node.tagName.toLowerCase();
  } else if (node.nodeName) {
    obj.nodeName = node.nodeName;
  }
  if (node.nodeValue) {
    obj.nodeValue = node.nodeValue;
  }
  let attrs = node.attributes;
  if (attrs) {
    let attrNames = new Map();
    for (let i = 0; i < attrs.length; i++) {
      attrNames.set(attrs[i].nodeName, undefined);
    }
    // Add some special cases that might not be included by enumerating
    // attributes above. Note: this list is probably not exhaustive.
    if (obj.tagName === 'input') {
      if (node.type === 'checkbox' || node.type === 'radio') {
        attrNames.set('checked', false);
      } else if (node.type !== 'file') {
        // Don't store the value for a file input.
        attrNames.set('value', '');
      }
    } else if (obj.tagName === 'option') {
      attrNames.set('selected', false);
    } else if (obj.tagName === 'textarea') {
      attrNames.set('value', '');
    }
    let arr = [];
    for (let [name, defaultValue] of attrNames) {
      let propName = propFix[name] || name;
      let value = node[propName];
      if (value !== defaultValue) {
        arr.push([name, value]);
      }
    }
    if (arr.length) {
      obj.attributes = arr;
    }
  }
  let childNodes = node.childNodes;
  // Don't process children for a textarea since we used `value` above.
  if (obj.tagName !== 'textarea' && childNodes && childNodes.length) {
    let arr = (obj.childNodes = []);
    for (let i = 0; i < childNodes.length; i++) {
      arr[i] = toJSON(childNodes[i]);
    }
  }
  return obj;
}

function toDOM(input) {
  let obj = typeof input === 'string' ? JSON.parse(input) : input;
  let propFix = { for: 'htmlFor', class: 'className' };
  let node;
  let nodeType = obj.nodeType;
  switch (nodeType) {
    //ELEMENT_NODE
    case 1: {
      node = document.createElement(obj.tagName);
      if (obj.attributes) {
        for (let [attrName, value] of obj.attributes) {
          let propName = propFix[attrName] || attrName;
          // Note: this will throw if setting the value of an input[type=file]
          node[propName] = value;
        }
      }
      break;
    }
    //TEXT_NODE
    case 3: {
      return document.createTextNode(obj.nodeValue);
    }
    //COMMENT_NODE
    case 8: {
      return document.createComment(obj.nodeValue);
    }
    //DOCUMENT_FRAGMENT_NODE
    case 11: {
      node = document.createDocumentFragment();
      break;
    }
    default: {
      // Default to an empty fragment node.
      return document.createDocumentFragment();
    }
  }
  if (obj.childNodes && obj.childNodes.length) {
    for (let childNode of obj.childNodes) {
      node.appendChild(toDOM(childNode));
    }
  }
  return node;
}

function toDOMCE(input){
	var x = toDOM(input);
	
	x.childNodes.forEach(function(item){
		item.contentEditable = true;
	})
	
	return x;
}