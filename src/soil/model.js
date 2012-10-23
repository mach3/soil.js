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
