
sap.ui.define([
	"jquery.sap.global",
   "zsmt1/controller/BaseController",
   "sap/m/MessageToast",
   "sap/ui/core/routing/History"
], function (JQuery, BaseController, MessageToast, History) {
   "use strict";
  var oModel;
   return BaseController.extend("zsmt1.controller.Report", {
	   
	   onInit: function () {

	   },
	   onPress:function(oEvent){
		   var oRouter = sap.ui.core.UIComponent
			.getRouterFor(this);
		   oRouter.navTo("managerEmployee", {
				employeeId : oEvent.getSource()
						.getBindingContext()
						.getProperty(
								"IdEmployee")
								});
	   },
	   onAfterRendering:function(){
		   
		   var oChart = this.getView().byId("capacityChart");
		   
		   var cap = oChart.getPercentage();
		   
		   if(cap < 30){
			   oChart.setValueColor("Error");
		   }else if(cap < 70){
			   oChart.setValueColor("Critical");
		   }else{
			   oChart.setValueColor("Good");
		   }
	   },
	   	onBeforeRendering:function(){
		   
		   var oChart = this.getView().byId("capacityChart");
		   
		   var cap = oChart.getPercentage();
		   
		   if(cap < 30){
			   oChart.setValueColor("Error");
		   }else if(cap < 70){
			   oChart.setValueColor("Critical");
		   }else{
			   oChart.setValueColor("Good");
		   }
	   }

	});
});