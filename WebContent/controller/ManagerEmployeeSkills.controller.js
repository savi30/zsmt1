sap.ui
		.define(
				[ "jquery.sap.global", "zsmt1/controller/BaseController",
						"sap/m/MessageToast", "sap/ui/core/routing/History" ],
				function(JQuery, BaseController, MessageToast, History) {
					"use strict";
					var oTemplate,oArgs,oView,oModel;
					return BaseController
							.extend(
									"zsmt1.controller.ManagerEmployeeSkills",
									{

										onInit : function() {
											var oRouter = sap.ui.core.UIComponent
													.getRouterFor(this);
											oView = this.getView();
											oRouter
													.getRoute("managerEmployee")
													.attachMatched(
															this._onRouteMatched,
															this);

										},
										onSkillSelect : function(oEvent) {
											MessageToast.show("skill selected");
										},
										_onRouteMatched : function(oEvent) {
											var oList = this.getView().byId(
													"managerEmployeeSkillList");
											oArgs = oEvent
													.getParameter("arguments");
											if (!oTemplate) {

												oTemplate = new sap.m.CustomListItem(
														{
															
															content : [ new sap.m.FlexBox(
																	{
																		alignItems : sap.m.FlexAlignItems.Start,
																		justifyContent : sap.m.FlexJustifyContent.SpaceBetween,
																		items : [
																				new sap.m.Label(
																						"skillIdM",
																						{
																							visible : false,
																							active : false,
																							text : "{SkillId}"
																						}),
																				new sap.m.Text(
																						"nameLabelM",
																						{
																							text : "{Name}"

																						}),
																				new sap.m.ProgressIndicator(
																						"skillLevelProgressBarM",
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
																		.byId("managerEmployeeSkillList");
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
											
											oModel = this.getView().getModel();
											var oList = this.getView().byId(
													"managerEmployeeSkillList");
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
													"managerEmployeeSkillList");
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
										_onBindingChange : function(oEvent) {
											// No data for the binding
											if (!this.getView()
													.getBindingContext()) {
												sap.ui.core.UIComponent
														.getRouterFor(this)
														.getTargets().display(
																"notFound");
											}
										}

									});
				});