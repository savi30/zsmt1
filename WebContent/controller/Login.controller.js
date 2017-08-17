sap.ui.define([
	"jquery.sap.global",
   "zsmt1/controller/BaseController",
   "sap/m/MessageToast",
   "sap/ui/model/resource/ResourceModel"
], function (JQuery, BaseController, MessageToast, ResourceModel) {
   "use strict";
  
   return BaseController.extend("zsmt1.controller.Login", {
	   
	   onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("login").attachPatternMatched(this._onObjectMatched, this);
		},
		
		_onObjectMatched: function (oEvent) {
			
			var oText = this.getView().byId('userType');
			
			oText.setText(oEvent.getParameter("arguments").isManager);
				
		}

	});
});