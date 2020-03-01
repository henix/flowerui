/**
 * FlowerUI: 一个简单的组件框架
 * 兼容性：IE8
 *
 * dependency:
 *
 * - String.prototype.startsWith
 * - String.prototype.endsWith
 * - Array.from
 *
 * https://github.com/henix/flowerui
 */
var FlowerUI;
(function(FlowerUI) {

/**
 * new klass(arg0)
 */
function newInstance(klass, arg0) {
	var names = klass.split('.');
	var f = window;
	for (var i = 0; i < names.length; i++) {
		f = f[names[i]];
		if (!f) {
			// 忽略类不存在的错误
			return null;
		}
	}
	return new f(arg0);
}

/**
 * 处理具有 name 或 class 的 element：
 *
 * 1. 如果有 class ，则值为 new class(element)
 * 2. 否则值为此 element
 *
 * 然后将值用 name 保存到最近的具有 class 的祖先
 *
 * 也允许只有 class 但没有名字的匿名对象
 *
 * class 必须是 -package-Name 的形式
 */
function compileElement(parentObj, element) {
	var name = element.getAttribute("name");
	var klass;
	var tmp = /\S+/.exec(element.className);
	if (tmp) tmp = tmp[0];
	if (tmp && tmp.startsWith("-")) {
		klass = tmp.substring(1).replace("-", ".");
	}
	var obj = null;
	if (klass) {
		obj = newInstance(klass, element);
		// $parent 让子节点可以访问父节点
		if (obj && parentObj) {
			obj.$parent = parentObj;
		}
	}
	if (name && parentObj) {
		obj = obj || element;
		if (name.endsWith("[]")) { // array
			name = name.substring(0, name.length - 2);
			if (!parentObj[name]) {
				parentObj[name] = [];
			}
			parentObj[name].push(obj);
		} else {
			parentObj[name] = obj;
		}
	}
	var childs = element.children;
	var len = childs.length;
	var nextParent = (klass && obj) ? obj : parentObj;
	for (var i = 0; i < len; i++) {
		if (childs[i].getAttribute("data-target") == "parent" && nextParent.$parent) {
			compileElement(nextParent.$parent, childs[i]);
		} else {
			compileElement(nextParent, childs[i]);
		}
	}
	if (klass && obj && typeof obj.init === "function") {
		obj.init(); // trigger init event
	}
	return obj;
}

function compileAll(element) {
	var obj = {};
	compileElement(obj, element || document.body);
	return obj;
}

/**
 * Call this if you changed your innerHTML, and want to your obj keep updated.
 */
function refresh(obj, elem) {
	var childs = Array.from(elem.children);
	var len = childs.length;
	for (var i = 0; i < len; i++) {
		compileElement(obj, childs[i]);
	}
}

FlowerUI.compileElement = compileElement;
FlowerUI.compileAll = compileAll;
FlowerUI.refresh = refresh;

})(FlowerUI || (FlowerUI = {}));
