sap.ui.define([
	"jquery.sap.global",
   "zsmt1/controller/BaseController",
   "sap/m/MessageToast",
   "sap/ui/core/routing/History"
], function (JQuery, BaseController, MessageToast, History) {
   "use strict";
   var oTemplate,oModel,oView,oArgs;
   return BaseController.extend("zsmt1.controller.EmployeeSkills", {
	   
	   onInit: function () {		   
		   	oView = this.getView();
		   	oModel = oView.getModel();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("employee").attachMatched(this._onRouteMatched, this);
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
		onSaveDialog:function(oEvent){
				var oFormatDate = sap.ui.core.format.DateFormat
				.getDateTimeInstance({
					pattern : "yyyy-MM-ddTKK:mm:ss"
				});
			   var oEntry = {};
			   oEntry.EmpId = parseInt(oArgs.employeeId);
			   oEntry.SkillId = parseInt(sap.ui.getCore().byId("addSkillId").getText());
			   oEntry.SkillLevel = parseInt(sap.ui.getCore().byId("addSkillLevel").getSelectedKey());
			   oEntry.LastModified = new Date(oFormatDate.parse("2017-08-24T00:00:00"));
			   
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
													LastModfied : oFormatDate.format(oEntry.LastModified)
												}
											},
											function(
													data,
													request) {
												MessageToast
														.show("Skill added");
												oView.byId("employeeSkillList")
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
			   
			   oView.byId("employeeSkillList").getModel().refresh(
				true);
			   this._oSkillDialog.close();
		   },
		   onCloseDialog:function(){
			   this._oSkillDialog.close();
		   },
			onOpenEditDialog:function(oEvent){
				if (!this._oSkillEditDialog) {
					this._oSkillEditDialog = sap.ui
							.xmlfragment(
									"zsmt1.view.EmployeeEditSkillLevel",
									this
											.getView()
											.getController());
					this.getView().addDependent(
							this._oSkillEditDialog);
				}

				this._oSkillEditDialog.open();
    		}, 
			onSaveSkillDialog:function(){
				MessageToast.show("ok");
				this.__oSkillEditDialog.close();
			},
			onCloseSkillDialog:function(){
				this.__oSkillEditDialog.close();
			},
			_onRouteMatched : function (oEvent) {
				
				var oList = this.getView().byId("employeeSkillList");
				oArgs = oEvent.getParameter("arguments");
				 if(!oTemplate){
					
					 oTemplate = new sap.m.CustomListItem({ 
		                    content : [
		                        new sap.m.FlexBox({
		                        	alignItems : sap.m.FlexAlignItems.Start,
		                        	justifyContent : sap.m.FlexJustifyContent.SpaceBetween,
		                        	items:[
		                        	new sap.m.Label("levelLabel",{
		                        		text:"{Name}"
		                        	}),
		                        	new sap.m.Button({
		                        		icon:"sap-icon://edit",
		                        		press:function(oEvent){
		                        			MessageToast.show("implement edit");}
		                        	})
		                        	]
		                        })	
		                   ],
		            });
		            	 	 
				 }
				 
				oList.bindItems({
	                path :  "/EmployeeSet(" + oArgs.employeeId + ")/toSkill",
	                events : {
						change: this._onBindingChange.bind(this),
						dataRequested: function (oEvent) {
							oView.setBusy(true);
						},
						dataReceived: function (oEvent) {
							oView.setBusy(false);
						}
					},
					template : oTemplate
				});
				
				
			},
			onBeforeRendering:function(){
				var oList = this.getView().byId("employeeSkillList");
				var obj = oList.getItems();
				var obj2 = obj[0];
			}
			,
		_onBindingChange : function (oEvent) {
			
			if (!this.getView().getBindingContext()) {
				sap.ui.core.UIComponent.getRouterFor(this).getTargets().display("notFound");
			}
		},

		onSuggestionItemSelected: function (oEvent) {
			var oItem = oEvent.getParameter("selectedItem");
			var oContext = oItem.getBindingContext().getProperty("SkillId");
			var oLabelId = sap.ui.getCore().byId("addSkillId");
			oLabelId.setText(oContext);
		}
		

	});
});