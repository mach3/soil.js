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
