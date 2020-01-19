function DomoT(elem) {
	this.elem = elem;
	this.tmpl = elem.textContent.trim();
	this.initdata = elem.getAttribute("domo-data");
}

DomoT.prototype.repaint = function(data) {
	var elem = this.elem;

	var rendered = eval("(function(_){with(_){ var $_ = {}; return " + this.tmpl + "; }})(data)");

	elem.innerHTML = "";
	if (Array.isArray(rendered)) {
		rendered.forEach(function(e) {
			elem.appendChild(e);
		});
	} else if (typeof rendered == "string") {
		elem.textContent = rendered;
	} else {
		elem.appendChild(rendered);
	}

	// 重新用 FlowerUI 编译所有子结点
	FlowerUI.refresh(this, elem);
};

DomoT.prototype.init = function() {
	this.elem.innerHTML = "";
	if (this.initdata) {
		this.repaint(JSON.parse(this.initdata));
	}
};
