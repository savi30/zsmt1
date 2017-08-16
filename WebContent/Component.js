sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/resource/ResourceModel"
], function (UIComponent, ResourceModel) {
	"use strict";

	return UIComponent.extend("zsmt1.Component", {

		metadata : {
			manifest : "json"
		},
		
		init : function () {
			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);
		
	         var i18nModel = new ResourceModel({
	             bundleName : "zsmt1.i18n.i18n"
	          });
	          this.setModel(i18nModel, "i18n");
			
		}
	});

});