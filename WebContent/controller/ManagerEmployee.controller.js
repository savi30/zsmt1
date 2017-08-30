sap.ui
		.define(
				[ "jquery.sap.global", "zsmt1/controller/BaseController",
						"sap/m/MessageToast", "sap/ui/core/routing/History" ],
				function(JQuery, BaseController, MessageToast, History) {
					"use strict";

					var oDisplayFragment, oArgs, oView, oLayout, oRouter;

					return BaseController
							.extend(
									"zsmt1.controller.ManagerEmployee",
									{

										onInit : function() {

											oRouter = sap.ui.core.UIComponent
													.getRouterFor(this);
											oView = this.getView();
											oRouter
													.getRoute("managerEmployee")
													.attachMatched(
															this._onRouteMatched,
															this);
											oDisplayFragment = sap.ui
													.xmlfragment(this.getView()
															.getId(),
															"zsmt1.view.ManagerEmployeeDetail");
											oLayout = this
													.getView()
													.byId(
															"managerEmployeeDetailsFragment");
											oLayout
													.insertContent(oDisplayFragment);

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
																"zsmt1.view.ManagerToolbar",
																this);
												this.getView().addDependent(
														this._actionSheet);
											}

											this._actionSheet.openBy(oButton);
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
										onAddEmployee : function(oEvent) {

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
															"addEmployeeProjectId")
													.getValue());

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
																						LastModified : oEntry.LastModified
																					}
																				},
																				function(
																						data,
																						request) {
																					MessageToast
																							.show("Success");
																					this
																							.getView()
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
											this.getView().getModel().refresh(
													true);
											oView.byId("addToProjectDialog")
													.close();
										},
										onLogout : function() {
											var oRouter = sap.ui.core.UIComponent
													.getRouterFor(this);
											oRouter.navTo("App", {}, true);
										},
										_onRouteMatched : function(oEvent) {

											oArgs = oEvent
													.getParameter("arguments");
											oView
													.bindElement({
														path : "/EmployeeSet("
																+ oArgs.employeeId
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
											var srvUnit = this.getView().byId(
													"srvUnitTextManager");
											srvUnit.bindElement("/EmployeeSet("
													+ oArgs.employeeId
													+ ")/toServiceUnit");

										},
										_onBindingChange : function(oEvent) {
											// No data for the binding
											if (!this.getView()
													.getBindingContext()) {
												oRouter.getTargets().display(
														"notFound");
											}
										}

									});
				});