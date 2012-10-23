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
