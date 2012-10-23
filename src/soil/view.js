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
