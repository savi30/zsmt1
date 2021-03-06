sap.ui.define([
	"jquery.sap.global",
   "zsmt1/controller/BaseController",
   "sap/m/MessageToast",
   "sap/ui/core/routing/History"
], function (JQuery, BaseController, MessageToast, History) {
   "use strict";
  
   return BaseController.extend("zsmt1.controller.EmployeeProjectDetails", {
	   
	   onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("projectDetailOverview").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched : function (oEvent) {
			var oArgs, oView;
			var oFormatDate = sap.ui.core.format.DateFormat
			.getDateTimeInstance({
				pattern : "yyyy-MM-ddTKK:mm:ss"
			});
			oArgs = oEvent.getParameter("arguments");
			oView = this.getView();
			oView.bindElement({
				path : "/ProjectSet(" + oArgs.projectId + ")",
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
			
		},
		_onBindingChange : function (oEvent) {
			// No data for the binding
			if (!this.getView().getBindingContext()) {
				this.getRouter().getTargets().display("notFound");
			}
		}

	});
});