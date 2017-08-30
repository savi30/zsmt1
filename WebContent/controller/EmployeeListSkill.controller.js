sap.ui.define([ "jquery.sap.global", "zsmt1/controller/BaseController",
		"sap/m/MessageToast", "sap/ui/core/routing/History" ], function(JQuery,
		BaseController, MessageToast, History) {
	"use strict";
	var oRouter;
	return BaseController.extend("zsmt1.controller.EmployeeListSkill", {

		onInit : function() {
			oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("skillEmployees").attachMatched(this._onRouteMatched,
					this);

		},	
		
		onNavBack : function() {
			var oHistory = History
					.getInstance();
			var sPreviousHash = oHistory
					.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent
						.getRouterFor(this);
				oRouter.navTo("App", {}, true);
			}
		},
		
		handleOpenToolbar : function(oEvent) {
			var oButton = oEvent.getSource();

			// create action sheet only once
			if (!this._actionSheet) {
				this._actionSheet = sap.ui
						.xmlfragment(
								"zsmt1.view.EmployeeSkillToolbar",
								this);
				this.getView().addDependent(
						this._actionSheet);
			}

			this._actionSheet.openBy(oButton);
		},
		
		onLogout : function() {
			var oRouter = sap.ui.core.UIComponent
					.getRouterFor(this);
			oRouter.navTo("App", {}, true);
		},
		
		onHomePage : function() {
			var oHistory = History
					.getInstance();
			var sPreviousHash = oHistory
					.getPreviousHash();

			if (sPreviousHash !== undefined) {
			
				var oRouter = sap.ui.core.UIComponent
						.getRouterFor(this);
				oRouter.navTo("manager", {}, true);
			}
		},
		
		_onRouteMatched : function(oEvent) {
			var oArgs, oView;
			oArgs = oEvent.getParameter("arguments");

			var oList = this.getView().byId("skillEmployeeOverviewList");
			oList.bindItems({
				path : "/SkillSet(" + oArgs.skillId + ")/toEmployee",
				
				template : new sap.m.StandardListItem({
					title : "{Surname}",
					description : "{Name}",
					
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