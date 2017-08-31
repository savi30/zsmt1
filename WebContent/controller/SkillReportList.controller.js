sap.ui.define([ "jquery.sap.global", "zsmt1/controller/BaseController",
		"sap/m/MessageToast", "sap/ui/model/resource/ResourceModel" ],
		function(JQuery, BaseController, MessageToast, ResourceModel) {
			"use strict";
			var oRouter;
			return BaseController.extend("zsmt1.controller.SkillReportList",
					{

						onInit : function() {
							var oView = this.getView();
							oRouter = sap.ui.core.UIComponent
									.getRouterFor(this);
						},

						onPress : function(oEvent) {

							oRouter.navTo("skillEmployees", {
								skillId : oEvent.getSource()
										.getBindingContext().getProperty(
												"SkillId")
							});
						},
						onSelectChange : function(oEvt) {
							var aFilters = [];
							var sQuery = oEvt.getSource().getSelectedKey();
							if (sQuery && sQuery.length > 0) {
								var filter = new sap.ui.model.Filter("IdSdomain",
										sap.ui.model.FilterOperator.EQ,
										sQuery);
								aFilters.push(filter);

							}
							var list = this.getView().byId("skillReportList");
							var binding = list.getBinding("items");
							binding.filter(aFilters, "Application");
						}

					});
		});