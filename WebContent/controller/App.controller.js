sap.ui.define([
	"jquery.sap.global",
   "zsmt1/controller/BaseController",
   "sap/m/MessageToast",
   "sap/ui/model/resource/ResourceModel"
], function (JQuery, BaseController, MessageToast, ResourceModel) {
   "use strict";
  
   return BaseController.extend("zsmt1.controller.App", {
	   
	   onSelectEmployee:function(oEvent){

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("login", {
				isManager: "false"
			});
	   },
	   onSelectManager:function(evt){

		   var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("login", {
				isManager: "true"
			});
	   }

	});
});