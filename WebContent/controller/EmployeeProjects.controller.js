sap.ui.define([ "jquery.sap.global", "zsmt1/controller/BaseController",
		"sap/m/MessageToast", "sap/ui/core/routing/History" ], function(JQuery,
		BaseController, MessageToast, History) {
	"use strict";

	return BaseController.extend("zsmt1.controller.EmployeeProjects", {

		onInit : function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("employee").attachMatched(this._onRouteMatched,
					this);

		},
		_onRouteMatched : function(oEvent) {
			var oArgs, oView;
			oArgs = oEvent.getParameter("arguments");
			/*
			 * oView = this.getView(); oView.bindElement({ path :
			 * "/EmployeeSet(" + oArgs.employeeId + ")/toProject", events : {
			 * change: this._onBindingChange.bind(this), dataRequested: function
			 * (oEvent) { oView.setBusy(true); }, dataReceived: function
			 * (oEvent) { oView.setBusy(false); } }
			 * 
			 * });
			 */
			var oList = this.getView().byId("employeeProjectList");
			oList.bindItems({
				path : "/EmployeeSet(" + oArgs.employeeId + ")/toProject",
				
				template : new sap.m.StandardListItem({
					title : "{Name}",
					description : "{CustName}"
				})
			});
		},
		_onBindingChange : function(oEvent) {
			// No data for the binding
			if (!this.getView().getBindingContext()) {
				sap.ui.core.UIComponent.getRouterFor(this).getTargets()
						.display("notFound");
			}
		}

	});
});