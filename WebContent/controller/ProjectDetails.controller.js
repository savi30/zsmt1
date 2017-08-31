sap.ui.define([
	"jquery.sap.global",
   "zsmt1/controller/BaseController",
   "sap/m/MessageToast",
   "sap/ui/core/routing/History"
], function (JQuery, BaseController, MessageToast, History) {
   "use strict";
   var  oView;
   return BaseController.extend("zsmt1.controller.ProjectDetails", {
	   
	   onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oView = this.getView();
			oRouter.getRoute("project").attachMatched(this._onRouteMatched, this);
			
		},
		_onRouteMatched : function (oEvent) {
			var oArgs,
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
			var completed = oView.getBindingContext().getProperty("Flag");
			if(completed == true){
				 oView.byId("projectProgressIcon").setIcon("sap-icon://accept");
				 oView.byId("projectProgressIcon").setType(sap.m.ButtonType.Accept);
			}else{
				oView.byId("projectProgressIcon").setIcon("sap-icon://pending");
			    oView.byId("projectProgressIcon").setType(sap.m.ButtonType.Emphasized);
			}
		},
		_onBindingChange : function (oEvent) {
			// No data for the binding
			if (!this.getView().getBindingContext()) {
				this.getRouter().getTargets().display("notFound");
			}
		}

	});
});