jQuery.sap.require("sap.ui.core.format.DateFormat");
sap.ui
		.define(
				[ "jquery.sap.global", "zsmt1/controller/BaseController",
						"sap/m/MessageToast",
						"sap/ui/model/resource/ResourceModel" ],
				function(JQuery, BaseController, MessageToast, ResourceModel) {
					"use strict";

					var oView, oRouter;
					return BaseController
							.extend(
									"zsmt1.controller.ProjectList",
									{

										onInit : function() {
											oView = this.getView();
											oRouter = sap.ui.core.UIComponent
													.getRouterFor(this);
										},

										onPress : function(oEvent) {

											oRouter.navTo("project", {
												projectId : oEvent.getSource()
														.getBindingContext()
														.getProperty(
																"Idproject")
											});
										},
										onEditProject : function(oEvent) {
											var oView = this.getView();
											oView
													.bindElement({
														path : "/ProjectSet("
																+ oEvent
																		.getSource()
																		.getBindingContext()
																		.getProperty(
																				"Idproject")
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
											var oDialog = oView
													.byId("changeProjectDialog");
											if (!oDialog) {

												oDialog = sap.ui
														.xmlfragment(
																this
																		.getView()
																		.getId(),
																"zsmt1.view.ProjectDetailChange",
																this);
												oView.addDependent(oDialog);
											}
											oDialog.open();
										},
										onSaveEditDialog : function(oEvent) {

											var oModel = this.getView()
													.getModel();
											var oView = this.getView();
											var oEntry = {};

											oEntry.Id = oEvent.getSource()
													.getBindingContext()
													.getProperty("Idproject")

											oEntry.Name =oView
													.byId("projectDetailName")
													.getValue();
											oEntry.CustName = oView
													.byId(
															"projectDetailCustName")
													.getValue();
											oEntry.BudgetDays = parseInt(oView
													.byId(
															"projectDetailBudget")
													.getValue());

											oEntry.StartProject = oView
													.byId(
															"updateProjectStartDate")
													.getValue();
											oEntry.EndProject = oView
													.byId(
															"updateProjectEndDate")
													.getValue();

											OData
													.request(
															{
																requestUri : "http://bcsw-sap078.mymhp.net:8000/sap/opu/odata/SAP/ZSMT1ODATA_SRV/ProjectSet("
																		+ oEntry.Id
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
																					requestUri : "http://bcsw-sap078.mymhp.net:8000/sap/opu/odata/SAP/ZSMT1ODATA_SRV/ProjectSet("
																							+ oEntry.Id
																							+ ")",
																					method : "PUT",
																					headers : oHeaders,
																					data : {
																						Idproject : oEntry.Id,
																						CustName : oEntry.CustName,
																						Name : oEntry.Name,
																						BudgetDays : oEntry.BudgetDays,
																						StartProject : oEntry.StartProject,
																						EndProject : oEntry.EndProject,
																						Flag : false,
																						LastModified : oEntry.StartProject
																					}
																				},
																				function(
																						data,
																						request) {
																					MessageToast
																							.show("Changes saved");
																					this
																							.getView()
																							.byId(
																									"projectList")
																							.getModel()
																							.refresh(
																									true);
																				},
																				function(
																						err) {
																					MessageToast
																							.show("Failed to update project details");

																				});
															},
															function(err) {
																var request = err.request;
																var response = err.response;
																MessageToast
																		.show("error Request "
																				+ request
																				+ " Response"
																				+ response);
															});
											this.getView().byId("projectList")
													.getModel().refresh(true);
											oView.byId("changeProjectDialog")
													.close();

										},
										onCancelEditDialog : function() {
											oView.byId("changeProjectDialog")
													.close();
										},
										onOpenDialog : function() {

											if (!this._oDialog) {
												this._oDialog = sap.ui
														.xmlfragment(
																"zsmt1.view.CreateProject",
																this
																		.getView()
																		.getController());
												this.getView().addDependent(
														this._oDialog);
											}

											this._oDialog.open();

										},

										onCloseDialog : function() {

											this._oDialog.close();

										},

										onSaveDialog : function() {
											var oModel = this.getView()
													.getModel();
											var oEntry = {};

											oEntry.Name = sap.ui.getCore()
													.byId("createProjectName")
													.getValue();
											oEntry.CustName = sap.ui
													.getCore()
													.byId(
															"createProjectCustomer")
													.getValue();
											oEntry.BudgetDays = parseInt(sap.ui
													.getCore()
													.byId(
															"createProjectBudgetDays")
													.getValue());

											oEntry.StartProject = sap.ui
													.getCore()
													.byId(
															"createProjectStartDate")
													.getValue();
											oEntry.EndProject = sap.ui
													.getCore()
													.byId(
															"createProjectEndDate")
													.getValue();

											OData
													.request(
															{
																requestUri : "http://bcsw-sap078.mymhp.net:8000/sap/opu/odata/SAP/ZSMT1ODATA_SRV/ProjectSet",
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
																					requestUri : "http://bcsw-sap078.mymhp.net:8000/sap/opu/odata/SAP/ZSMT1ODATA_SRV/ProjectSet",
																					method : "POST",
																					headers : oHeaders,
																					data : {
																						Idproject : 0,
																						CustName : oEntry.CustName,
																						Name : oEntry.Name,
																						BudgetDays : oEntry.BudgetDays,
																						StartProject : oEntry.StartProject,
																						EndProject : oEntry.EndProject,
																						Flag : false,
																						LastModified : oEntry.StartProject
																					}
																				},
																				function(
																						data,
																						request) {
																					MessageToast
																							.show("Project created successfully");
																					this
																							.getView()
																							.byId(
																									"projectList")
																							.getModel()
																							.refresh(
																									true);
																				},
																				function(
																						err) {
																					MessageToast
																							.show("Failed to create project");

																				});
															},
															function(err) {
																var request = err.request;
																var response = err.response;
																MessageToast
																		.show("error Request "
																				+ request
																				+ " Response"
																				+ response);
															});
											this._oDialog.close();
											this.getView().byId("projectList")
													.getModel().refresh(true);
										},
										afterClose : function() {
											this._oDialog.destroy();
										},
										_onBindingChange : function(oEvent) {

											if (!this.getView()
													.getBindingContext()) {
												oRouter.getTargets().display(
														"notFound");
											}
										}
									});

				});