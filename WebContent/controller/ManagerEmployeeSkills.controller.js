sap.ui.define([
	"jquery.sap.global",
   "zsmt1/controller/BaseController",
   "sap/m/MessageToast",
   "sap/ui/core/routing/History"
], function (JQuery, BaseController, MessageToast, History) {
   "use strict";
  
   return BaseController.extend("zsmt1.controller.ManagerEmployeeSkills", {
	   
	   onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("managerEmployee").attachMatched(this._onRouteMatched, this);
			
		},
		onSkillSelect:function(oEvent){
			MessageToast.show("skill selected");
		},
		_onRouteMatched : function (oEvent) {
			var oArgs, oView;
			oArgs = oEvent.getParameter("arguments");
			oView = this.getView();
			var oList = this.getView().byId("managerEmployeeSkillList");
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
                template : new sap.m.CustomListItem({ 
                        content : [
                            new sap.m.FlexBox({
                            	alignItems : sap.m.FlexAlignItems.Start,
                            	justifyContent : sap.m.FlexJustifyContent.SpaceBetween,
                            	items:[
                            	new sap.m.Label({
                            		text:"{Name}"
                            	})                            	
                            	]
                            })	
                       ],
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