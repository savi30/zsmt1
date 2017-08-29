jQuery.sap.require("sap.ui.core.format.DateFormat");
sap.ui.define([ "jquery.sap.global", "zsmt1/controller/BaseController",
		"sap/m/MessageToast", "sap/ui/model/resource/ResourceModel" ],
		function(JQuery, BaseController, MessageToast, ResourceModel) {
			"use strict";

			var oView, oRouter;
			return BaseController.extend(
					"zsmt1.controller.EmployeeAllColleaguesList", {

						onInit : function() {
							oView = this.getView();
							oRouter = sap.ui.core.UIComponent
									.getRouterFor(this);
						},

						onPress : function(oEvent) {

							oRouter.navTo("employeeAllColleagues", {
								employeeId : oEvent.getSource()
								.getBindingContext()
								.getProperty(
										"IdEmployee")
					});
						},
						_onBindingChange : function(oEvent) {

							if (!this.getView().getBindingContext()) {
								oRouter.getTargets().display("notFound");
							}
						}
					});

		});