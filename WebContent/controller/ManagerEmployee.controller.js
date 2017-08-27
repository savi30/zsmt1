sap.ui.define([
	"jquery.sap.global",
   "zsmt1/controller/BaseController",
   "sap/m/MessageToast",
   "sap/ui/core/routing/History"
], function (JQuery, BaseController, MessageToast, History) {
   "use strict";
 
   var oDisplayFragment, oArgs, oView, oLayout,oRouter;
   
   return BaseController.extend("zsmt1.controller.ManagerEmployee", {
	   
	   onInit: function () {
		   
		    oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		    oView = this.getView();
			oRouter.getRoute("managerEmployee").attachMatched(this._onRouteMatched, this);
			oDisplayFragment = sap.ui.xmlfragment(this.getView().getId(), "zsmt1.view.ManagerEmployeeDetail");
			oLayout = this.getView().byId("managerEmployeeDetailsFragment");
			oLayout.insertContent(oDisplayFragment);
		
		},
		
		onNavBack: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("App", {}, true);
			}
		},
			handleOpenToolbar : function (oEvent) {
			var oButton = oEvent.getSource();
 
			// create action sheet only once
			if (!this._actionSheet) {
				this._actionSheet = sap.ui.xmlfragment(
					"zsmt1.view.ManagerToolbar",
					this
				);
				this.getView().addDependent(this._actionSheet);
			}
 
			this._actionSheet.openBy(oButton);
		},
		onLogout:function(){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("App", {}, true);
		},
		_onRouteMatched : function (oEvent) {
			
			oArgs = oEvent.getParameter("arguments");
			oView.bindElement({
				path : "/EmployeeSet(" + oArgs.employeeId + ")",
				events : {
					change: this._onBindingChange.bind(this),
					dataRequested: function (oEvent) {
						oView.setBusy(true);
					},
					dataReceived: function (oEvent) {
						oView.setBusy(false);
					}
				}
			});
			var srvUnit = this.getView().byId("srvUnitText");
			srvUnit.bindElement("/EmployeeSet(" + oArgs.employeeId + ")/toServiceUnit");
			
		},
		_onBindingChange : function (oEvent) {
			// No data for the binding
			if (!this.getView().getBindingContext()) {
				oRouter.getTargets().display("notFound");
			}
		}

	});
});