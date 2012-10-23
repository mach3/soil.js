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
