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

/**
 * Soil.Config
 * - configure options
 */
Soil.Config = function(){};
(function(fn){

	fn.type = "Config";
	fn.option = {};
	fn._optionInit = false;

	/**
	 * Set or get the option
	 * - if has value, set it and return the instance
	 * - if has no value, return the value
	 * - if object, set each key and value, return the instance
	 * 
	 * @param String key || Object option
	 * @param Mixed value (optional)
	 * @return Mixed
	 */
	fn.config = function(){
		var self, args, a, b, has;

		self = this;
		args = arguments;
		a = args[0];
		b = args[1];
		has = Soil.has(a, this.option);

		if(! this._optionInit){
			this.option = $.extend({}, this.option);
			this._optionInit = true;
		}

		if(typeof(a) === "undefined"){
			return this.option;
		}
		else if(Soil.isObject(a)){
			$.each(a, function(key, value){
				self.config(key, value);
			});
			return this;
		}
		else if(typeof(b) === "undefined"){
			return has ? this.option[a] : null;
		}
		else if(Soil.has(a, this.option)){
			this.option[a] = b;
			return this;
		}
	};

}(Soil.Config.prototype));

/**
 * Soil.Events
 * - set and remove event handler for the instance
 * - fire the event
 */

Soil.Events = function(){};
(function(fn){

	fn.type = "Events";
	fn._events = {};
	fn._eventsInit = false;

	/**
	 * Get if having the event type
	 * 
	 * @param String type
	 * @return Boolean
	 */
	fn.hasEvent = function(type){
		return Soil.has(type, this._events) && this._events[type].length > 0;
	};

	/**
	 * Add event handler
	 * 
	 * @param String type
	 * @param Function handler
	 * @return self
	 */
	fn.on = function(type, handler){
		if(! this._eventsInit){
			this._events = $.extend({}, this._events);
			this._eventsInit = true;
		}
		if(! this.hasEvent(type)){
			this._events[type] = [];
		}
		this._events[type].push(handler);
		return this;
	};

	/**
	 * Remove event handler
	 *
	 * @param String type
	 * @param Function handler
	 * @return self
	 */
	fn.off = function(type, handler){
		if(this.hasEvent(type)){
			this._events[type] = $.map(this._events[type], function(f){
				return handler === f ? null : f;
			});
		}
		return this;
	};

	/**
	 * Fire the event
	 *
	 * @param String type
	 */
	fn.trigger = function(type){
		var i;
		if(this.hasEvent(type)){
			for(i=0; i<this._events[type].length; i+=1){
				this._events[type][i].apply(this, [{
					type : type,
					target : this
				}]);
			}
		}
		return this;
	};

}(Soil.Events.prototype));

/**
 * Soil.Attributes
 * - get and set attributes
 * - save and validate methods, but empty
 */
Soil.Attributes = function(){};
(function(fn){

	fn.type = "Attributes";
	fn.attr = {};
	fn._attrInit = false;
	fn._attrLastChanged = null;

	/**
	 * Set attribute
	 * - if has key & value, set the attribute
	 * - if has object, set the each attribute
	 * 
	 * @param String key || Object values
	 * @param Mixed value (optional)
	 * @return self
	 */
	fn.set = function(){
		var self, args, changed;

		self = this;
		args = arguments;

		if(! this._attrInit){
			this.attr = $.extend({}, this.attr);
			this._attrInit = true;
		}
		if(Soil.isObject(args[0])){
			$.each(args[0], function(key, value){
				self.set(key, value);
			});
		}
		else if(Soil.has(args[0], this.attr)){
			if(this.attr[args[0]] != args[1]){
				this.attr[args[0]] = args[1];
				this._attrLastChanged = args[0];
				if(this.EVENT_CHANGE && $.isFunction(this.trigger)){
					this.trigger(this.EVENT_CHANGE);
				}
			}
		}
		return this;
	};

	/**
	 * Get attribute
	 * - if has no arguments, return all attributes as object
	 *
	 * @param String key
	 * @return Mixed
	 */
	fn.get = function(key){
		if(typeof(key) === "undefined"){
			return this.attr;
		}
		else if(Soil.has(key, this.attr)){
			return this.attr[key];
		}
		return null;
	};

}(Soil.Attributes.prototype));

/**
 * Soil.Model
 * - Soil.Events + Soil.Attributes
 */
Soil.Model = function(){};
Soil.Model[Soil.extendMethod](Soil.Events, Soil.Attributes);
(function(fn){

	fn.type = "Model";
	fn.EVENT_CHANGE = "change";

}(Soil.Model.prototype));

/**
 * Soil.Stack
 * - data collection
 * - add and get values
 * - remove value by index or condition
 */
Soil.Stack = function(){};
(function(fn){

	fn._stack = [];
	fn._stackIndex = 0;
	fn._stackInit = false;

	/**
	 * Add value(s)
	 *
	 * @param Mixed value
	 * @return self
	 */
	fn.add = function(){
		var self, args, i;
		self = this;
		args = arguments;

		if(! this._stackInit){
			this._stack = $.extend([], this._stack);
			this._stackInit = true;
		}
		for(i=0; i<args.length; i+=1){
			this._stack.push(args[i]);
		}
		return this;
	};

	/**
	 * Fetch the value
	 * - if an argument is not numeric, return all values
	 * 
	 * @param Integer index
	 * @return Mixed || Array
	 */
	fn.fetch = function(index){
		if(typeof(index) === "number"){
			return this._stack[parseInt(index, 10)];
		} else {
			return this._stack;
		}
	};

	/**
	 * Set or get stack index
	 * - return new index, or false if failed to change index
	 *
	 * @param Integer index
	 * @return Integer || Boolean
	 */
	fn.index = function(index){
		if(typeof(index) === "number"){
			index = parseInt(index, 10);
			if(index >= 0 && index < this._stack.length){
				this._stackIndex = index;
				return index;
			} else {
				return false;
			}
		} else {
			return this._stackIndex;
		}
	};

	/**
	 * Rewind the index to zero
	 *
	 * @return self
	 */
	fn.rewind = function(){
		this.index(0);
		return this;
	};

	/**
	 * Set stack index to the next
	 *
	 * @return Integer || Boolean
	 */
	fn.next = function(){
		return this.index(this._stackIndex + 1);
	};

	/**
	 * Set stack index to the previous
	 *
	 * @return Integer || Boolean
	 */
	fn.prev = function(){
		return this.index(this._stackIndex - 1);
	};

	/**
	 * Get the current value
	 *
	 * @return Mixed || undefined
	 */
	fn.current = function(){
		return this.fetch(this._stackIndex);
	};

	/**
	 * Browse the each values
	 *
	 * @param Function callback
	 * @return self
	 */
	fn.each = function(callback){
		$.each(this._stack, callback);
		return this;
	};

	/**
	 * Remove from stack data
	 *
	 * @param Integer index || Function callback
	 * @return self
	 */
	fn.remove = function(cond){
		var stack = [];
		if(typeof(cond) === "number"){
			cond = parseInt(cond, 10);
			this.each(function(index, value){
				if(cond !== index){
					stack.push(value);
				}
			});
			this._stack = stack;
		}
		else if(typeof(cond) === "function"){
			this.each(function(index, value){
				if(! cond(value)){
					stack.push(value);
				}
			});
			this._stack = stack;
		}
		return this;
	};

}(Soil.Stack.prototype));

/**
 * Soil.View
 * - This is very cheap and has minimum features
 * - You'd better to use other template engine, jQuery.tmpl or Mustache or something ...
 */

Soil.View = function(){};
Soil.View[Soil.extendMethod](Soil.Attributes);
(function(fn){

	fn._template = null,

	/**
	 * Set or get template
	 * 
	 * @param String template
	 * @return Mixed
	 */
	fn.template = function(template){
		if(typeof template === "string"){
			this._template = template.toString();
			return this;
		}
		return this._template;
	},

	/**
	 * Get the rendered string
	 * - if does not have "attr" arg, use this.attr
	 * 
	 * @param Object attr (optional)
	 * @return String
	 */
	fn.render = function(attr){
		attr = attr || this.get();
		return Soil.render(this._template, attr);
	}

}(Soil.View.prototype));
