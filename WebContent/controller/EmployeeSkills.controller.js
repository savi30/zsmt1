sap.ui.define([
	"jquery.sap.global",
   "zsmt1/controller/BaseController",
   "sap/m/MessageToast",
   "sap/ui/core/routing/History"
], function (JQuery, BaseController, MessageToast, History) {
   "use strict";
  
   return BaseController.extend("zsmt1.controller.EmployeeSkills", {
	   
	   onInit: function () {
		   var url = "http://bcsw-sap078.mymhp.net:8000/sap/opu/odata/sap/ZSMT1ODATA_SRV/";
		   var oData = new sap.ui.model.odata.v2.ODataModel(url);		   
		   var oModel= this.getView();
		   oModel.setModel(oData,"test");
			   
		  
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("employee").attachMatched(this._onRouteMatched, this);
			
		},
		_onRouteMatched : function (oEvent) {
			var oArgs, oView;
			oArgs = oEvent.getParameter("arguments");
			oView = this.getView();
			var oList = this.getView().byId("employeeSkillList");
			oList.bindItems({
                path :  "/EmployeeSet(" + oArgs.employeeId + ")/toSkill",
                events : {
					change: this._onBindingChange.bind(this),
					dataRequested: function (oEvent) {
						oView.setBusy(true);
					},
					dataReceived: function (oEvent) {
						oView.setBusy(false);
					}
				},
				template : new sap.m.StandardListItem({ 
					title:"{Name}",
					type:sap.m.ListType.Detail                                                                       
            })
            }); 
			
			 
			
		},
		_onBindingChange : function (oEvent) {
			// No data for the binding
			if (!this.getView().getBindingContext()) {
				sap.ui.core.UIComponent.getRouterFor(this).getTargets().display("notFound");
			}
		}

	});
});