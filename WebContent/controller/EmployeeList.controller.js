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
		  
		   oRouter.navTo("managerEmployee",{
			   employeeId : oEvent.getSource().getBindingContext().getProperty("IdEmployee")
		   });
	   },
	   onSearch : function(oEvt) {

			// add filter for search
			var aFilters = [];
			var sQuery = oEvt.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				
				
				var filter2 = new sap.ui.model.Filter("Surname",
						sap.ui.model.FilterOperator.StartsWith, sQuery);
				aFilters.push(filter2);
			}

			// update list binding
			var list = this.getView().byId("employeeList");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
			}

	});
});