sap.ui.define([
	"jquery.sap.global",
   "sap/ui/core/mvc/Controller",
   "sap/m/MessageToast",
   "sap/ui/model/resource/ResourceModel"
], function (JQuery, Controller, MessageToast, ResourceModel) {
   "use strict";
  
   return Controller.extend("zsmt1.controller.App", {
	   
	   onSelectEmployee:function(evt){

	         MessageToast.show("employee");
	   },
	   onSelectManager:function(evt){

	         MessageToast.show("manager");
	   }
   });
});