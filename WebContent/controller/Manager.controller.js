sap.ui.define([
	"zsmt1/controller/BaseController",
	  "sap/m/MessageToast",
	   "sap/ui/model/json/JSONModel",
	   "sap/ui/model/resource/ResourceModel" 
], function (BaseController, MessageToast, JSONModel, ResourceModel) {
	"use strict";
	return BaseController.extend("zsmt1.controller.Manager", {
		onInit: function () {			

		},				
		
		handleOpenToolbar : function (oEvent) {
			var oButton = oEvent.getSource();
 
			// create action sheet only once
			if (!this._actionSheet) {
				this._actionSheet = sap.ui.xmlfragment(
					"zsmt1.view.ManagerToolbar",
					this
				);
				this.getView().addDependent(this._actionSheet);
			}
 
			this._actionSheet.openBy(oButton);
		},		
		
		onLogout:function(){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("App", {}, true);
		},
		
		
	});
});