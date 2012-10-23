/**
 * Soil.HashChange
 *
 * @require Soil.Events, Soil.Config
 */
Soil.HashChange = function(){};
Soil.HashChange[Soil.extendMethod](Soil.Events, Soil.Config);
(function(fn){

	var getSupportHashChange = function(){
		var docMode = document.documentMode;
		return "onhashchange" in window
			&& (typeof docMode === "undefined" || docMode > 7);
	};

	fn.EVENT_HASH_CHANGE = "hashchange";

	fn.option = {
		support : getSupportHashChange(),
		interval : 10
	};

	fn._hash = null; 
	fn._timer = null;

	/**
	 * Start to watch
	 */
	fn.start = function(){
		if(this.config("support")){
			$(window).on("hashchange", this._onHashChange.scope(this));
		} else {
			this._run();
		}
		return this;
	};

	fn._run = function(){
		if(location.hash !== this._hash){
			if(this._hash !== null){
				this._onHashChange();
			}
			this._hash = location.hash;
		}
		this._timer = setTimeout(this._run.scope(this), this.config("interval"));
	};

	fn._onHashChange = function(){
		this.trigger(this.EVENT_HASH_CHANGE);
	};

	/**
	 * Stop to watch
	 */
	fn.stop = function(){
		if(this.config("support")){
			$(window).off("hashchange", this._onHashChange.scope(this));
		} else {
			clearTimeout(this._timer);
		}
		return this;
	};

	/**
	 * Get location hash
	 *
	 * @return String
	 */
	fn.getHash = function(){
		return location.hash;
	};

}(Soil.HashChange.prototype));
