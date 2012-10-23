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
