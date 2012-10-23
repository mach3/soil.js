/**
 * Soil Core
 */

var Soil = window.Soil || {};

(function(fn){

	fn.extendMethod = "plant";

	// Get if obj is object
	fn.isObject = function(obj){
		return Object.prototype.toString.call(obj) === "[object Object]";
	};

	// Aliase to hasOwnProperty
	fn.has = function(key, obj){
		return obj.hasOwnProperty(key);
	},

	// Utility for object prop problem
	fn.rebase = function(obj){
		return $.extend(true, {}, obj);
	};

	// Render string with template and vars
	fn.render = function(template, vars){
		if(Mustache){
			return Mustache.render(template, vars);
		}
		return template.replace(
			/{{(.+?)}}/g,
			function(a, b){
				return vars[b] || "";
			}
		);
	};

	// Extend props of object | function's prototype
	fn.extend = function(){
		var args, base, obj, i;
		args = arguments;
		base = [].shift.call(args).prototype;
		if($.isFunction(base)){
			base = base.prototype;
		}
		for(i=0; i<args.length; i+=1){
			obj = $.isFunction(args[i]) ? args[i].prototype : args[i];
			base = $.extend(true, base, obj);
		}
		return base;
	}
	
}(Soil));

/**
 * Extend prototype
 */

if(! Function.prototype.scope){
	Function.prototype.scope = function(target){
		var self = this;
		return function(){
			return self.apply(target, arguments);
		}
	};
}

if(! Function.prototype[Soil.extendMethod]){
	Function.prototype[Soil.extendMethod] = function(){
		var args = arguments;
		[].unshift.call(args, this);
		Soil.extend.apply(Soil, args);
	};
}
