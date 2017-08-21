sap.ui.define([
	"zsmt1/controller/BaseController",
	  "sap/m/MessageToast",
	   "sap/ui/model/json/JSONModel",
	   "sap/ui/model/resource/ResourceModel" 
], function (BaseController, MessageToast, JSONModel, ResourceModel) {
	"use strict";
	return BaseController.extend("zsmt1.controller.Manager", {
		onInit: function () {
			
			var i18nModel = new ResourceModel({
				bundleName : "zsmt1.i18n.i18n"
			});
			this.getView().setModel(i18nModel, "i18n");
			
			/*var oRouter = this.getRouter();
			oRouter.getRoute("employeeResume").attachMatched(this._onRouteMatched, this);*/
		},
		_onRouteMatched : function (oEvent) {
			var oArgs, oView;
			oArgs = oEvent.getParameter("arguments");
			oView = this.getView();
			oView.bindElement({
				path : "/Employees(" + oArgs.employeeId + ")",
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