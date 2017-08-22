//jQuery.sap.require("model.formatter");
sap.ui.define([
	"jquery.sap.global",
   "zsmt1/controller/BaseController",
   "sap/m/MessageToast",
   "sap/ui/model/resource/ResourceModel",
   "zsmt1/model/formatter"
], function (JQuery, BaseController, MessageToast, ResourceModel, formatter) {
   "use strict";
   
   return BaseController.extend("zsmt1.controller.EmployeeList", {
	   formatter: model.formatter,
	   onPress:function(oEvent){
		   MessageToast.show("projectSelected");
	   }

	});
});