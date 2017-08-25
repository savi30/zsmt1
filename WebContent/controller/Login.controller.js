sap.ui.define([ "jquery.sap.global", "zsmt1/controller/BaseController",
		"sap/m/MessageToast", "sap/ui/core/routing/History",
		'sap/m/MessageBox', 'sap/ui/model/SimpleType',
		'sap/ui/model/ValidateException', 'sap/ui/model/json/JSONModel' ],
		function(JQuery, BaseController, MessageToast, History, MessageBox,
				SimpleType, ValidateException, JSONModel) {
			"use strict";

			var isManager;
			var username;
			var password;
			var oRouter;
			var oModel;
			return BaseController.extend("zsmt1.controller.Login", {

				onInit : function() {

					oRouter = sap.ui.core.UIComponent.getRouterFor(this);
					oRouter.getRoute("login").attachMatched(
							this._onRouteMatched, this);
					username = this.getView().byId("nameInput").setValue("");
					password = this.getView().byId("passwordInput")
							.setValue("");

				},

				_onRouteMatched : function(oEvent) {

					isManager = oEvent.getParameter("arguments").isManager;

				},

				handleLogin : function(oEvent) {
					
					oModel = this.getView().getModel();
					username = this.getView().byId("nameInput").getValue();
					password = this.getView().byId("passwordInput").getValue();
					if (isManager === "true") {
						if (username.toLowerCase() == "manager" && password == "1234") {
							oRouter.navTo("manager");
						} else {
							MessageBox.alert("Incorrect username or password");
						}
					} else {

						var sPath = "/EmployeeSet(" + password + ")";
						try {
							oModel.read(sPath, this);
							var name = oModel.getProperty("/EmployeeSet("+password+")/Name");
							var id = oModel.getProperty("/EmployeeSet("+password+")/IdEmployee");
							if( username.toUpperCase()==name && password == id){
							oRouter.navTo("employee", {
								employeeId : password
							});
							}else{
								MessageBox.alert("Incorrect username or password");
							}
						} catch (error) {
							MessageBox.alert("Incorrect username or password");
						}
					}

					username = this.getView().byId("nameInput").setValue("");
					password = this.getView().byId("passwordInput")
							.setValue("");
				},

				onNavBack : function() {

					oRouter.navTo("App", {}, true);

				}

			});
		});