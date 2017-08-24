//jQuery.sap.require("model.formatter");
sap.ui.define([
	"jquery.sap.global",
   "zsmt1/controller/BaseController",
   "sap/m/MessageToast",
   "sap/ui/model/resource/ResourceModel",
   "zsmt1/model/formatter"
], function (JQuery, BaseController, MessageToast, ResourceModel, formatter) {
   "use strict";
   
   var oRouter;
   
   return BaseController.extend("zsmt1.controller.EmployeeList", {
	  
	   onInit:function(){
		   oRouter = sap.ui.core.UIComponent.getRouterFor(this);
	   },
	   
	   onPress:function(oEvent){
		  
		   oRouter.navTo("employee",{
			   employeeId : oEvent.getSource().getBindingContext().getProperty("IdEmployee")
		   });
	   }

	});
});