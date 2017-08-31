
sap.ui
		.define(
				[ "jquery.sap.global", "zsmt1/controller/BaseController",
						"sap/m/MessageToast", 'sap/m/MessageBox',
						"sap/ui/model/resource/ResourceModel",
						"zsmt1/model/formatter" ],
				function(JQuery, BaseController, MessageToast, MessageBox,
						ResourceModel, formatter) {
					"use strict";

					var oRouter,oView;

					return BaseController
							.extend(
									"zsmt1.controller.EmployeeList",
									{

										onInit : function() {
											oView = this.getView();
											oRouter = sap.ui.core.UIComponent
													.getRouterFor(this);
										},

										onPress : function(oEvent) {

											oRouter.navTo("managerEmployee", {
												employeeId : oEvent.getSource()
														.getBindingContext()
														.getProperty(
																"IdEmployee")
											});
										},
										onAddEmployeeToProject : function(
												oEvent) {

											var oView = this.getView();
											oView
													.bindElement({
														path : "/EmployeeSet("
																+ oEvent
																		.getSource()
																		.getBindingContext()
																		.getProperty(
																				"IdEmployee")
																+ ")",
														events : {
															change : this._onBindingChange
																	.bind(this),
															dataRequested : function(
																	oEvent) {
																oView
																		.setBusy(true);
															},
															dataReceived : function(
																	oEvent) {
																oView
																		.setBusy(false);
															}
														}
													});

											var oView = this.getView();

											var oDialog = oView
													.byId("addToProjectDialog");
											if (!oDialog) {

												oDialog = sap.ui
														.xmlfragment(
																this
																		.getView()
																		.getId(),
																"zsmt1.view.addEmployeeToProject",
																this);
												oView.addDependent(oDialog);
											}
											oDialog.open();
										},
										onCloseDialog : function() {
											this.getView().byId(
													"addToProjectDialog")
													.close();
										},
										onSaveDialog : function(oEvent) {
											var oModel = this.getView()
													.getModel();
											var oView = this.getView();
											var oEntry = {};
											var oFormatDate = sap.ui.core.format.DateFormat
													.getDateTimeInstance({
														pattern : "yyyy-MM-ddTKK:mm:ss"
													});
											oEntry.EmpId = oEvent.getSource()
													.getBindingContext()
													.getProperty("IdEmployee")

											oEntry.ProjId = parseInt(oView
													.byId(
															"idSelectedProject")
													.getText());

											oEntry.BudgetDays = parseInt(oView
													.byId(
															"addEmployeeBudgetDays")
													.getValue());

											oEntry.StartProject = oView.byId(
													"addEmployeeJoinDate")
													.getValue();
											oEntry.EndProject = oView.byId(
													"addEmployeeFinishDate")
													.getValue();
											oEntry.LastModified = new Date(
													oFormatDate
															.parse("2017-08-24T00:00:00"));

											OData
													.request(
															{
																requestUri : "http://bcsw-sap078.mymhp.net:8000/sap/opu/odata/SAP/ZSMT1ODATA_SRV/ProjectSet("
																		+ oEntry.ProjId
																		+ ")",
																method : "GET",
																headers : {
																	"X-Requested-With" : "XMLHttpRequest",
																	"Content-Type" : "application/atom+xml",
																	"DataServiceVersion" : "2.0",
																	"X-CSRF-Token" : "Fetch"
																}
															},
															function(data,
																	response) {

																var oHeaders = {
																	"x-csrf-token" : response.headers['x-csrf-token'],
																	"DataServiceVersion" : "2.0",
																	'Accept' : 'application/json',
																};
																OData
																		.request(
																				{
																					requestUri : "http://bcsw-sap078.mymhp.net:8000/sap/opu/odata/SAP/ZSMT1ODATA_SRV/ProjEmSet",
																					method : "POST",
																					headers : oHeaders,
																					data : {
																						EmployeeId : oEntry.EmpId,
																						ProjectId : oEntry.ProjId,
																						Nodays : oEntry.BudgetDays,
																						Joindate : oEntry.StartProject,
																						Enddate : oEntry.EndProject,
																						Flag : false,
																						LastModified : oEntry.EndProject
																					}
																				},
																				function(
																						data,
																						request) {
																					MessageToast
																							.show("Success");
																					oView
																							.getModel()
																							.refresh(
																									true);
																				},
																				function(
																						err) {
																					MessageToast
																							.show("Failed to add employee to project");

																				});
															},
															function(err) {
																MessageBox
																		.alert("The project you selected doesn't exist");
															});
											oView.getModel().refresh(
													true);
											oView.byId("addToProjectDialog")
													.close();
										},
										_onBindingChange : function(oEvent) {

											if (!this.getView()
													.getBindingContext()) {
												oRouter.getTargets().display(
														"notFound");
											}
										},
										onSuggestionItemSelected : function(oEvent) {
											var oItem = oEvent
													.getParameter("selectedItem");
											var oContext = oItem
													.getBindingContext()
													.getProperty("Idproject");
											var oLabelId = this.getView()
													.byId("idSelectedProject");
											oLabelId.setText(oContext);
										},
										onSearch : function (oEvt) {
											 
											// add filter for search
											var aFilters = [];
											var sQuery = oEvt.getSource().getValue();
											if (sQuery && sQuery.length > 0) {
												var filter = new sap.ui.model.Filter("Surname", sap.ui.model.FilterOperator.StartsWith, sQuery);
												aFilters.push(filter);
												
											}
								 
											// update list binding
											var list = this.getView().byId("employeeList");
											var binding = list.getBinding("items");
											binding.filter(aFilters, "Application");
										}

									});
				});

