sap.ui.define([
	"jquery.sap.global",
   "zsmt1/controller/BaseController",
   "sap/m/MessageToast",
   "sap/ui/model/resource/ResourceModel"
], function (JQuery, BaseController, MessageToast, ResourceModel) {
   "use strict";
   var oRouter;
   return BaseController.extend("zsmt1.controller.SkillReportList", {
	   
	   onInit : function() {
			var oView = this.getView();
			 oRouter = sap.ui.core.UIComponent
					.getRouterFor(this);
		},

		onPress : function(oEvent) {

			oRouter.navTo("skillEmployees", {
				skillId : oEvent.getSource()
						.getBindingContext()
						.getProperty(
								"SkillId")
			});
		}
	   

	});
});