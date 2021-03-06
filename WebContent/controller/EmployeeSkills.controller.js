sap.ui
		.define(
				[ "jquery.sap.global", "zsmt1/controller/BaseController",
						"sap/m/MessageToast", "sap/ui/core/routing/History" ],
				function(JQuery, BaseController, MessageToast, History) {
					"use strict";
					var oTemplate, oModel, oView, oArgs;
					return BaseController
							.extend(
									"zsmt1.controller.EmployeeSkills",
									{

										onInit : function() {
											oView = this.getView();
											oModel = oView.getModel();
											var oRouter = sap.ui.core.UIComponent
													.getRouterFor(this);
											oRouter
													.getRoute("employee")
													.attachMatched(
															this._onRouteMatched,
															this);
										},
										onOpenDialog : function() {

											if (!this._oSkillDialog) {
												this._oSkillDialog = sap.ui
														.xmlfragment(
																"zsmt1.view.AddSkillEmployee",
																this
																		.getView()
																		.getController());
												this.getView().addDependent(
														this._oSkillDialog);
											}

											this._oSkillDialog.open();

										},
										onSaveDialog : function(oEvent) {
											var oFormatDate = sap.ui.core.format.DateFormat
													.getDateTimeInstance({
														pattern : "yyyy-MM-ddTKK:mm:ss"
													});
											var oEntry = {};
											oEntry.EmpId = parseInt(oArgs.employeeId);
											oEntry.SkillId = parseInt(sap.ui
													.getCore().byId(
															"addSkillId")
													.getText());
											oEntry.SkillLevel = parseInt(sap.ui
													.getCore().byId(
															"addSkillLevel")
													.getSelectedKey());
											oEntry.LastModified = new Date(
													oFormatDate
															.parse("2017-08-24T00:00:00"));

											OData
													.request(
															{
																requestUri : "http://bcsw-sap078.mymhp.net:8000/sap/opu/odata/SAP/ZSMT1ODATA_SRV/SkillSet("
																		+ oEntry.SkillId
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
																					requestUri : "http://bcsw-sap078.mymhp.net:8000/sap/opu/odata/SAP/ZSMT1ODATA_SRV/SkillEmpSet",
																					method : "POST",
																					headers : oHeaders,
																					data : {
																						IdEmployee : oEntry.EmpId,
																						IdSkill : oEntry.SkillId,
																						EmployeeLevel : oEntry.SkillLevel,
																						LastModfied : oFormatDate
																								.format(oEntry.LastModified)
																					}
																				},
																				function(
																						data,
																						request) {
																					MessageToast
																							.show("Skill added");
																					oView
																							.byId(
																									"employeeSkillList")
																							.getModel()
																							.refresh(
																									true);
																				},
																				function(
																						err) {
																					MessageToast
																							.show("Failed to add skill");

																				});
															},
															function(err) {
																MessageBox
																		.alert("The skill you selected doesn't exist");
															});

											oView.byId("employeeSkillList")
													.getModel().refresh(true);
											this._oSkillDialog.close();
										},
										onCloseDialog : function() {
											this._oSkillDialog.close();
										},
										_onRouteMatched : function(oEvent) {

											var oList = this.getView().byId(
													"employeeSkillList");
											oArgs = oEvent
													.getParameter("arguments");
											if (!oTemplate) {

												oTemplate = new sap.m.CustomListItem(
														{
															type : sap.m.ListType.Active,
															press : this.onSelectSkill,
															content : [ new sap.m.FlexBox(
																	{
																		alignItems : sap.m.FlexAlignItems.Start,
																		justifyContent : sap.m.FlexJustifyContent.SpaceBetween,
																		items : [
																				new sap.m.Label(
																						"skillId",
																						{
																							visible : false,
																							active : false,
																							text : "{SkillId}"
																						}),
																				new sap.m.Text(
																						"nameLabel",
																						{
																							text : "{Name}"

																						}),
																				new sap.m.ProgressIndicator(
																						"skillLevelProgressBar",
																						{
																							percentValue : 0,
																							displayValue : "",
																							showValue : true,
																							state : sap.ui.core.ValueState.None,
																							width : "190px",
																							height : "20px"
																						}) ]
																	}) ],
														});
											}

											oList
													.bindItems({
														path : "/EmployeeSet("
																+ oArgs.employeeId
																+ ")/toSkill",
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

																oModel = oView
																		.getModel();
																var oList = oView
																		.byId("employeeSkillList");
																var oItems = oList
																		.getItems();
																for (var i = 0; i < oItems.length; i++) {
																	var skillId = parseInt(oItems[i].mAggregations.content[0].mAggregations.items[0]
																			.getText());
																	var sPath = "/SkillEmpSet(IdEmployee="
																			+ oArgs.employeeId
																			+ ",IdSkill="
																			+ skillId
																			+ ")";
																	oModel
																			.read(
																					sPath,
																					this);
																	var skillLevel = oModel
																			.getProperty("/SkillEmpSet(IdEmployee="
																					+ parseInt(oArgs.employeeId)
																					+ ",IdSkill="
																					+ skillId
																					+ ")/EmployeeLevel");
																	oItems[i].mAggregations.content[0].mAggregations.items[2]
																			.addStyleClass("sapUiSmallMarginBottom");
																	switch (skillLevel) {
																	case 1:
																		oItems[i].mAggregations.content[0].mAggregations.items[2]
																				.setState(sap.ui.core.ValueState.Error);
																		oItems[i].mAggregations.content[0].mAggregations.items[2]
																				.setPercentValue(parseFloat(skillLevel) * 20);
																		oItems[i].mAggregations.content[0].mAggregations.items[2]
																				.setDisplayValue(skillLevel);
																		break;
																	case 2:
																		oItems[i].mAggregations.content[0].mAggregations.items[2]
																				.setState(sap.ui.core.ValueState.Warning);
																		oItems[i].mAggregations.content[0].mAggregations.items[2]
																				.setPercentValue(parseFloat(skillLevel) * 20);
																		oItems[i].mAggregations.content[0].mAggregations.items[2]
																				.setDisplayValue(skillLevel);
																		break;
																	case 3:
																		oItems[i].mAggregations.content[0].mAggregations.items[2]
																				.setState(sap.ui.core.ValueState.Warning);
																		oItems[i].mAggregations.content[0].mAggregations.items[2]
																				.setPercentValue(parseFloat(skillLevel) * 20);
																		oItems[i].mAggregations.content[0].mAggregations.items[2]
																				.setDisplayValue(skillLevel);
																		break;
																	case 4:
																		oItems[i].mAggregations.content[0].mAggregations.items[2]
																				.setState(sap.ui.core.ValueState.Success);
																		oItems[i].mAggregations.content[0].mAggregations.items[2]
																				.setPercentValue(parseFloat(skillLevel) * 20);
																		oItems[i].mAggregations.content[0].mAggregations.items[2]
																				.setDisplayValue(skillLevel);
																		break;
																	case 5:
																		oItems[i].mAggregations.content[0].mAggregations.items[2]
																				.setState(sap.ui.core.ValueState.Success);
																		oItems[i].mAggregations.content[0].mAggregations.items[2]
																				.setPercentValue(parseFloat(skillLevel) * 20);
																		oItems[i].mAggregations.content[0].mAggregations.items[2]
																				.setDisplayValue(skillLevel);
																		break;
																	default:
																		break;
																	}
																}
																oView
																		.setBusy(false);
															}
														},
														template : oTemplate
													});

										},
										onAfterRendering : function() {
											oModel = oView.getModel();
											var oList = this.getView().byId(
													"employeeSkillList");
											var oItems = oList.getItems();
											for (var i = 0; i < oItems.length; i++) {
												var skillId = parseInt(oItems[i].mAggregations.content[0].mAggregations.items[0]
														.getText());
												var sPath = "/SkillEmpSet(IdEmployee="
														+ oArgs.employeeId
														+ ",IdSkill="
														+ skillId
														+ ")";
												oModel.read(sPath, this);
												var skillLevel = oModel
														.getProperty("/SkillEmpSet(IdEmployee="
																+ parseInt(oArgs.employeeId)
																+ ",IdSkill="
																+ skillId
																+ ")/EmployeeLevel");
												oItems[i].mAggregations.content[0].mAggregations.items[2]
														.addStyleClass("sapUiSmallMarginBottom");
												switch (skillLevel) {
												case 1:
													oItems[i].mAggregations.content[0].mAggregations.items[2]
															.setState(sap.ui.core.ValueState.Error);
													oItems[i].mAggregations.content[0].mAggregations.items[2]
															.setPercentValue(parseFloat(skillLevel) * 20);
													oItems[i].mAggregations.content[0].mAggregations.items[2]
															.setDisplayValue(skillLevel);
													break;
												case 2:
													oItems[i].mAggregations.content[0].mAggregations.items[2]
															.setState(sap.ui.core.ValueState.Warning);
													oItems[i].mAggregations.content[0].mAggregations.items[2]
															.setPercentValue(parseFloat(skillLevel) * 20);
													oItems[i].mAggregations.content[0].mAggregations.items[2]
															.setDisplayValue(skillLevel);
													break;
												case 3:
													oItems[i].mAggregations.content[0].mAggregations.items[2]
															.setState(sap.ui.core.ValueState.Warning);
													oItems[i].mAggregations.content[0].mAggregations.items[2]
															.setPercentValue(parseFloat(skillLevel) * 20);
													oItems[i].mAggregations.content[0].mAggregations.items[2]
															.setDisplayValue(skillLevel);
													break;
												case 4:
													oItems[i].mAggregations.content[0].mAggregations.items[2]
															.setState(sap.ui.core.ValueState.Success);
													oItems[i].mAggregations.content[0].mAggregations.items[2]
															.setPercentValue(parseFloat(skillLevel) * 20);
													oItems[i].mAggregations.content[0].mAggregations.items[2]
															.setDisplayValue(skillLevel);
													break;
												case 5:
													oItems[i].mAggregations.content[0].mAggregations.items[2]
															.setState(sap.ui.core.ValueState.Success);
													oItems[i].mAggregations.content[0].mAggregations.items[2]
															.setPercentValue(parseFloat(skillLevel) * 20);
													oItems[i].mAggregations.content[0].mAggregations.items[2]
															.setDisplayValue(skillLevel);
													break;
												default:
													break;
												}
											}
										},
										onBeforeDisplay : function() {
											oModel = oView.getModel();
											var oList = this.getView().byId(
													"employeeSkillList");
											var oItems = oList.getItems();
											for (var i = 0; i < oItems.length; i++) {
												var skillId = parseInt(oItems[i].mAggregations.content[0].mAggregations.items[0]
														.getText());
												var sPath = "/SkillEmpSet(IdEmployee="
														+ oArgs.employeeId
														+ ",IdSkill="
														+ skillId
														+ ")";
												oModel.read(sPath, this);
												var skillLevel = oModel
														.getProperty("/SkillEmpSet(IdEmployee="
																+ parseInt(oArgs.employeeId)
																+ ",IdSkill="
																+ skillId
																+ ")/EmployeeLevel");
												oItems[i].mAggregations.content[0].mAggregations.items[2]
														.addStyleClass("sapUiSmallMarginBottom");
												switch (skillLevel) {
												case 1:
													oItems[i].mAggregations.content[0].mAggregations.items[2]
															.setState(sap.ui.core.ValueState.Error);
													oItems[i].mAggregations.content[0].mAggregations.items[2]
															.setPercentValue(parseFloat(skillLevel) * 20);
													oItems[i].mAggregations.content[0].mAggregations.items[2]
															.setDisplayValue(skillLevel);
													break;
												case 2:
													oItems[i].mAggregations.content[0].mAggregations.items[2]
															.setState(sap.ui.core.ValueState.Warning);
													oItems[i].mAggregations.content[0].mAggregations.items[2]
															.setPercentValue(parseFloat(skillLevel) * 20);
													oItems[i].mAggregations.content[0].mAggregations.items[2]
															.setDisplayValue(skillLevel);
													break;
												case 3:
													oItems[i].mAggregations.content[0].mAggregations.items[2]
															.setState(sap.ui.core.ValueState.Warning);
													oItems[i].mAggregations.content[0].mAggregations.items[2]
															.setPercentValue(parseFloat(skillLevel) * 20);
													oItems[i].mAggregations.content[0].mAggregations.items[2]
															.setDisplayValue(skillLevel);
													break;
												case 4:
													oItems[i].mAggregations.content[0].mAggregations.items[2]
															.setState(sap.ui.core.ValueState.Success);
													oItems[i].mAggregations.content[0].mAggregations.items[2]
															.setPercentValue(parseFloat(skillLevel) * 20);
													oItems[i].mAggregations.content[0].mAggregations.items[2]
															.setDisplayValue(skillLevel);
													break;
												case 5:
													oItems[i].mAggregations.content[0].mAggregations.items[2]
															.setState(sap.ui.core.ValueState.Success);
													oItems[i].mAggregations.content[0].mAggregations.items[2]
															.setPercentValue(parseFloat(skillLevel) * 20);
													oItems[i].mAggregations.content[0].mAggregations.items[2]
															.setDisplayValue(skillLevel);
													break;
												default:
													break;
												}
											}
										},
										onSelectSkill : function(oEvent) {

											var oDialog = oView
													.byId("employeeEditSkill");
											if (!oDialog) {

												oDialog = sap.ui
														.xmlfragment(
																oView.getId(),
																"zsmt1.view.EmployeeEditSkill",
																this);
												oView.addDependent(oDialog);
											}
											oDialog.open();

											var employeeId = oArgs.employeeId;
											oView.mAggregations.content[0]
													.bindElement({
														path : "/SkillEmpSet(IdEmployee="
																+ parseInt(oArgs.employeeId)
																+ ",IdSkill="
																+ oEvent
																		.getSource()
																		.getBindingContext()
																		.getProperty(
																				"SkillId")
																+ ")",
														events : {
															
															  change :
																  this._onBindingChange
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

										},
										onCloseEditLevelDialog : function(
												oEvent) {
											oView.byId("employeeEditSkill")
													.close();
										},

										onSaveEditLevelDialog : function(oEvent) {
											var skillId = oEvent.getSource()
													.getBindingContext()
													.getProperty("IdSkill");

											var oFormatDate = sap.ui.core.format.DateFormat
													.getDateTimeInstance({
														pattern : "yyyy-MM-ddTKK:mm:ss"
													});
											var oEntry = {};
											oEntry.EmpId = parseInt(oArgs.employeeId);
											oEntry.SkillId = parseInt(skillId);
											oEntry.SkillLevel = parseInt(sap.ui
													.getCore().byId(
															"editSkillLevel")
													.getSelectedKey());
											oEntry.LastModified = new Date(
													oFormatDate
															.parse("2017-08-24T00:00:00"));

											OData
													.request(
															{
																requestUri : "http://bcsw-sap078.mymhp.net:8000/sap/opu/odata/SAP/ZSMT1ODATA_SRV/SkillSet("
																		+ oEntry.SkillId
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
																					requestUri : "http://bcsw-sap078.mymhp.net:8000/sap/opu/odata/SAP/ZSMT1ODATA_SRV/SkillEmpSet(IdEmployee="
																							+ oEntry.EmpId
																							+ ",IdSkill="
																							+ oEntry.SkillId
																							+ ")",
																					method : "PUT",
																					headers : oHeaders,
																					data : {
																						IdEmployee : oEntry.EmpId,
																						IdSkill : oEntry.SkillId,
																						EmployeeLevel : oEntry.SkillLevel,
																						LastModfied : oFormatDate
																								.format(oEntry.LastModified)
																					}
																				},
																				function(
																						data,
																						request) {
																					MessageToast
																							.show("Skill updated");
																					oView
																							.byId(
																									"employeeSkillList")
																							.getModel()
																							.refresh(
																									true);
																				},
																				function(
																						err) {
																					MessageToast
																							.show("Failed to update skill");

																				});
															},
															function(err) {
																MessageToast
																		.show("The skill you selected doesn't exist");
															});

											oView.byId("employeeSkillList")
													.getModel().refresh(true);
											oView.byId("employeeEditSkill")
													.close();
										},
										onDeleteSkill : function(oEvent) {
											var skillId = oEvent.getSource()
													.getBindingContext()
													.getProperty("IdSkill");

											var oFormatDate = sap.ui.core.format.DateFormat
													.getDateTimeInstance({
														pattern : "yyyy-MM-ddTKK:mm:ss"
													});
											var oEntry = {};
											oEntry.EmpId = parseInt(oArgs.employeeId);
											oEntry.SkillId = parseInt(skillId);
											oEntry.SkillLevel = parseInt(sap.ui
													.getCore().byId(
															"editSkillLevel")
													.getSelectedKey());
											oEntry.LastModified = new Date(
													oFormatDate
															.parse("2017-08-24T00:00:00"));

											OData
													.request(
															{
																requestUri : "http://bcsw-sap078.mymhp.net:8000/sap/opu/odata/SAP/ZSMT1ODATA_SRV/SkillSet("
																		+ oEntry.SkillId
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
																					requestUri : "http://bcsw-sap078.mymhp.net:8000/sap/opu/odata/SAP/ZSMT1ODATA_SRV/SkillEmpSet(IdEmployee="
																							+ oEntry.EmpId
																							+ ",IdSkill="
																							+ oEntry.SkillId
																							+ ")",
																					method : "DELETE",
																					headers : oHeaders,
																					data : {
																						IdEmployee : oEntry.EmpId,
																						IdSkill : oEntry.SkillId,
																						EmployeeLevel : oEntry.SkillLevel,
																						LastModfied : oFormatDate
																								.format(oEntry.LastModified)
																					}
																				},
																				function(
																						data,
																						request) {
																					MessageToast
																							.show("Skill updated");
																					oView
																							.byId(
																									"employeeSkillList")
																							.getModel()
																							.refresh(
																									true);
																				},
																				function(
																						err) {
																					MessageToast
																							.show("Failed to update skill");

																				});
															},
															function(err) {
																MessageBox
																		.alert("The skill you selected doesn't exist");
															});

											oView.byId("employeeSkillList")
													.getModel().refresh(true);
											oView.byId("employeeEditSkill")
													.close();
										},
										_onBindingChange : function(oEvent) {

											if (!oView.getBindingContext()) {
												sap.ui.core.UIComponent
														.getRouterFor(this)
														.getTargets().display(
																"notFound");
											}
										},

										onSuggestionItemSelected : function(
												oEvent) {
											var oItem = oEvent
													.getParameter("selectedItem");
											var oContext = oItem
													.getBindingContext()
													.getProperty("SkillId");
											var oLabelId = sap.ui.getCore()
													.byId("addSkillId");
											oLabelId.setText(oContext);
										}

									});
				});