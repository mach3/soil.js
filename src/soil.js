
/**
 * Extend prototype
 */

if(! Function.prototype.scope){
	Function.prototype.scope = function(target){
		var self = this;
		return function(){
			self.apply(target, arguments);
		}
	};
}


/**
 * Soil
 */

var Soil = window.Soil || {};
(function(){
	this.isObject = function(obj){
		return Object.prototype.toString.call(obj) === "[object Object]";
	};

	this.has = function(key, obj){
		return obj.hasOwnProperty(key);
	},
	this.rebase = function(obj){
		return $.extend(true, {}, obj);
	};
	this.render = function(template, vars){
		return template.replace(
			/{{(.+?)}}/g,
			function(a, b){
				return vars[b] || "";
			}
		);
	};
	this.extend = function(){
		var args, base, obj, i;
		args = arguments;
		base = [].shift.call(args).prototype;
		for(i=0; i<args.length; i+=1){
			obj = $.isFunction(args[i]) ? args[i].prototype : args[i];
			base = $.extend(true, base, obj);
		}
	};
}).call(Soil);


/**
 * Soil.Events
 * - set and remove event handler for the instance
 * - fire the event
 */

Soil.Events = function(){};
(function(){

	this.type = "Events";
	this._events = {};
	this._eventsInit = false;

	/**
	 * Get if having the event type
	 * 
	 * @param String type
	 * @return Boolean
	 */
	this.hasEvent = function(type){
		return Soil.has(type, this._events) && this._events[type].length > 0;
	};

	/**
	 * Add event handler
	 * 
	 * @param String type
	 * @param Function handler
	 * @return self
	 */
	this.on = function(type, handler){
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
	this.off = function(type, handler){
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
	this.trigger = function(type){
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

}).call(Soil.Events.prototype);


/**
 * Soil.Config
 * - configure options
 */
Soil.Config = function(){};
(function(){

	this.type = "Config";
	this.option = {};
	this._optionInit = false;

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

}).call(Soil.Config.prototype);


/**
 * Soil.Attributes
 * - get and set attributes
 * - save and validate methods, but empty
 */
Soil.Attributes = function(){};
(function(){

	this.type = "Attributes";
	this.attr = {};
	this._attrInit = false;
	this._attrLastChanged = null;

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
	this.get = function(key){
		if(typeof(key) === "undefined"){
			return this.attr;
		}
		else if(Soil.has(key, this.attr)){
			return this.attr[key];
		}
		return null;
	};

}).call(Soil.Attributes.prototype);

/**
 * Soil.Model
 * - Soil.Events + Soil.Attributes
 */
Soil.Model = function(){};
Soil.extend(Soil.Model, Soil.Events, Soil.Attributes);
(function(){

	this.type = "Model";
	this.EVENT_CHANGE = "change";

}).call(Soil.Model.prototype);


/**
 * Soil.Stack
 * - data collection
 * - add and get values
 * - remove value by index or condition
 */
Soil.Stack = function(){};
(function(){

	this._stack = [];
	this._stackIndex = 0;
	this._stackInit = false;

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
	this.fetch = function(index){
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
	this.index = function(index){
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
		return this.fetch(this._stackIndex);
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

}).call(Soil.Stack.prototype);


/**
 * Soil.View
 * - This is very cheap and has minimum features
 * - You'd better to use other template engine, jQuery.tmpl or Mustache or something ...
 */

Soil.View = function(){};
Soil.extend(Soil.View, Soil.Attributes);
(function(){

	this._template = null,

	/**
	 * Set or get template
	 * 
	 * @param String template
	 * @return Mixed
	 */
	this.template = function(template){
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
	this.render = function(attr){
		attr = attr || this.get();
		return Soil.render(this._template, attr);
	}

}).call(Soil.View.prototype);
