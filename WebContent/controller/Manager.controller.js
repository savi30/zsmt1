sap.ui.define([
	"zsmt1/controller/BaseController",
	  "sap/m/MessageToast",
	   "sap/ui/model/json/JSONModel",
	   "sap/ui/model/resource/ResourceModel" 
], function (BaseController, MessageToast, JSONModel, ResourceModel) {
	"use strict";
	return BaseController.extend("zsmt1.controller.Manager", {
		onInit: function () {			
			/*var i18nModel = new ResourceModel({
				bundleName : "zsmt1.i18n.i18n"
			});
			this.getView().setModel(i18nModel, "i18n");*/
			
			/*var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("manager").attachMatched(this._onRouteMatched, this)*/
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
		
		onEdit:function(){
			MessageToast.show("Implement Edit");
		}
		
		/*_onRouteMatched : function (oEvent) {
			var oArgs, oView;
			oArgs = oEvent.getParameter("arguments");
			oView = this.getView();
			oView.bindElement({
				path : "/Manager(" + oArgs.employeeId + ")",
				events : {
					change: this._onBindingChange.bind(this),
					dataRequested: function (oEvent) {
						oView.setBusy(true);
					},
					dataReceived: function (oEvent) {
						oView.setBusy(false);
					}
				}
			});*/
		
/*		_onBindingChange : function (oEvent) {
			// No data for the binding
			if (!this.getView().getBindingContext()) {
				this.getRouter().getTargets().display("notFound");
			}
		}*/
	});
});