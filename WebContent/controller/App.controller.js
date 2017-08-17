sap.ui.define([
	"jquery.sap.global",
   "zsmt1/controller/BaseController",
   "sap/m/MessageToast",
   "sap/ui/model/resource/ResourceModel"
], function (JQuery, BaseController, MessageToast, ResourceModel) {
   "use strict";
  
   return BaseController.extend("zsmt1.controller.App", {
	   
		onPress: function (oEvent) {
			MessageToast.show("employee selected");
		},
	   
	   onSelectEmployee:function(evt){

	         MessageToast.show("employee");
	   },
	   onSelectManager:function(evt){

	         MessageToast.show("manager");
	   },

	});
});