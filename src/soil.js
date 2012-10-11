/*!
 *
 * Soil.js
 *
 * - Library for class base programming with JavaScript
 *
 * @author mach3
 * @version 0.9
 * @require jQuery
 */

var soil = window.soil || {};

/**
 * soil.fn (utility functions)
 */
soil.fn = {
	isObject : function(obj){
		return Object.prototype.toString.call(obj) === "[object Object]";
	},
	has : function(key, obj){
		return obj.hasOwnProperty(key);
	}
};

/**
 * soil.extend
 */
soil.extend = function(){
	var args, base, i;
	args = arguments;
	base = [].shift.call(args).prototype;
	for(i=0; i<args.length; i+=1){
		$.extend(base, args[i].prototype);
	}
};

/**
 * soil.Events
 * - set and remove event handler for the instance
 * - fire the event
 */
soil.Events = function(){};
(function(){

	this._events = [],

	/**
	 * Add event handler
	 * 
	 * @param String type
	 * @param Function handler
	 * @return self
	 */
	this.on = function(type, handler){
		this._events.push({
			type : type,
			handler : handler
		});
		return this;
	};

	/**
	 * Remove event handler
	 *
	 * @param String type
	 * @param Function handler
	 * @return self
	 */
	this.off = function(type, handler){
		this._events = $.map(this._events, function(e){
			if(e.type === type && e.handler === handler){
				return null;
			}
			return e;
		});
		return this;
	};

	/**
	 * Fire the event
	 *
	 * @param String type
	 */
	this.trigger = function(type){
		var self = this;
		$.each(this._events, function(i, e){
			if(e.type === type){
				e.handler.apply(self, {
					type : type,
					target : self
				});
			}
		});
		return this;
	};

}).call(soil.Events.prototype);

/**
 * soil.Config
 * - configure options
 */
soil.Config = function(){};
(function(){

	this.option = {};

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
	this.config = function(){
		var self, args, a, b, has;

		self = this;
		args = arguments;
		this.option = $.extend({}, this.option);
		a = args[0];
		b = args[1];
		has = soil.fn.has(a, this.option);

		if(typeof(a) === "undefined"){
			return this.option;
		}
		else if(soil.fn.isObject(a)){
			$.each(a, function(key, value){
				self.config(key, value);
			});
			return this;
		}
		else if(typeof(b) === "undefined"){
			return has ? this.option[a] : null;
		}
		else if(soil.fn.has(a, this.option)){
			this.option[a] = b;
			return this;
		}
	};


}).call(soil.Config.prototype);


/**
 * soil.Model
 * - get and set attributes
 * - save and validate methods, but empty
 */
soil.Model = function(){};
(function(){

	this.attr = {};

	/**
	 * Set attribute
	 * - if has key & value, set the attribute
	 * - if has object, set the each attribute
	 * 
	 * @param String key || Object values
	 * @param Mixed value (optional)
	 * @return self
	 */
	this.set = function(){
		var self, args;

		self = this;
		args = arguments;
		this.attr = $.extend({}, this.attr);

		if(soil.fn.isObject(args[0])){
			$.each(args[0], function(key, value){
				self.set(key, value);
			});
		}
		else if(soil.fn.has(args[0], this.attr)){
			this.attr[args[0]] = args[1];
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
	this.get = function(key){
		if(typeof(key) === "undefined"){
			return this.attr;
		}
		else if(soil.fn.has(key, this.attr)){
			return this.attr[key];
		}
		return null;
	};

	this.validate = function(){
	};

	this.save = function(){
	};

}).call(soil.Model.prototype);

/**
 * soil.Stack
 * - data collection
 * - add and get values
 * - remove value by index or condition
 */
soil.Stack = function(){};
(function(){

	this._stack = [];
	this._stackIndex = 0;

	/**
	 * Add value(s)
	 *
	 * @param Mixed value
	 * @return self
	 */
	this.add = function(){
		var self, args, i;
		self = this;
		args = arguments;
		this._stack = $.extend([], this._stack);
		for(i=0; i<args.length; i+=1){
			this._stack.push(args[i]);
		}
		return this;
	};

	/**
	 * Get the value
	 * - if an argument is not numeric, return all values
	 * 
	 * @param Integer index
	 * @return Mixed || Array
	 */
	this.get = function(index){
		if(typeof(index) === "number"){
			return this._stack[parseInt(index)];
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
	this.index = function(index){
		if(typeof(index) === "number"){
			index = parseInt(index);
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
	this.rewind = function(){
		this.index(0);
		return this;
	};

	/**
	 * Set stack index to the next
	 *
	 * @return Integer || Boolean
	 */
	this.next = function(){
		return this.index(this._stackIndex + 1);
	};

	/**
	 * Set stack index to the previous
	 *
	 * @return Integer || Boolean
	 */
	this.prev = function(){
		return this.index(this._stackIndex - 1);
	};

	/**
	 * Get the current value
	 *
	 * @return Mixed || undefined
	 */
	this.current = function(){
		return this.get(this._stackIndex);
	};

	/**
	 * Browse the each values
	 *
	 * @param Function callback
	 * @return self
	 */
	this.each = function(callback){
		$.each(this._stack, callback);
		return this;
	};

	/**
	 * Remove from stack data
	 *
	 * @param Integer index || Function callback
	 * @return self
	 */
	this.remove = function(cond){
		var stack = [];
		if(typeof(cond) === "number"){
			cond = parseInt(cond);
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

}).call(soil.Stack.prototype);
