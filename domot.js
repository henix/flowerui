function DomoT(elem) {
  this.elem = elem;
  this.tmpl = elem.innerHTML.trim();
  this.initdata = elem.getAttribute("domo-data");
}

DomoT.prototype.repaint = function(data) {
  var elem = this.elem;

  // Remove all children https://stackoverflow.com/a/3955238/1305074
  while (elem.firstChild) {
    elem.removeChild(elem.firstChild);
  }

  var rendered = eval("(function(_){with(_){ var $_ = {}; return " + this.tmpl + "; }})(data)");
  if (Array.isArray(rendered)) {
    rendered.forEach(function(e) {
      elem.appendChild(e);
    });
  } else {
    elem.appendChild(rendered);
  }

  // 重新用 FlowerUI 编译所有子结点
  var childs = elem.children;
  for (var i = 0; i < childs.length; i++) {
    FlowerUI.compileElement(this, childs[i]);
  }
};

DomoT.prototype.init = function() {
  if (this.initdata) {
    this.repaint(JSON.parse(this.initdata));
  }
};
