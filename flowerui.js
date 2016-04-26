var FlowerUI;
(function(FlowerUI) {

var startsWith;
if (String.prototype.startsWith) {
	startsWith = function(a, b) {
		return a.startsWith(b);
	};
} else {
	startsWith = function(a, b) {
		return a.lastIndexOf(b, 0) === 0;
	};
}

var endsWith;
if (String.prototype.endsWith) {
	endsWith = function(a, b) {
		return a.endsWith(b);
	};
} else {
	endsWith = function(a, b) {
		return a.indexOf(b, a.length - b.length) !== -1;
	};
}

function removeEnd(str, suffix) {
  if (endsWith(str, suffix)) {
    return str.substring(0, str.length - suffix.length);
  } else {
    return str;
  }
}

/**
 * new klass(arg0)
 */
function newInstance(klass, arg0) {
  var names = klass.split('.');
  var f = window;
  for (var i = 0; i < names.length; i++) {
    f = f[names[i]];
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
  var name = element.getAttribute('name');
  var klass;
  var tmp = element.classList[0];
  if (tmp && startsWith(tmp, "-")) {
    klass = tmp.substring(1).replace("-", ".");
  }
  var obj = null;
  if (klass) {
    obj = newInstance(klass, element);
  }
  if (name && parentObj) {
    obj = obj || element;
    if (endsWith(name, '[]')) { // array
      name = removeEnd(name, '[]');
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
  var nextParent = klass ? obj : parentObj;
  for (var i = 0; i < len; i++) {
    if (childs[i].getAttribute("data-target") == "parent") {
      compileElement(parentObj, childs[i]);
    }
    compileElement(nextParent, childs[i]);
  }
  if (klass && obj && typeof obj.init === 'function') {
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
  var childs = elem.children;
  var len = childs.length;
  for (var i = 0; i < len; i++) {
    compileElement(obj, childs[i]);
  }
}

FlowerUI.compileElement = compileElement;
FlowerUI.compileAll = compileAll;
FlowerUI.refresh = refresh;

})(FlowerUI || (FlowerUI = {}));
