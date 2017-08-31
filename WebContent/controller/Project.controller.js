sap.ui.define([
	"jquery.sap.global",
   "zsmt1/controller/BaseController",
   "sap/m/MessageToast",
   "sap/ui/core/routing/History"
], function (JQuery, BaseController, MessageToast, History) {
   "use strict";
   var oView;
   return BaseController.extend("zsmt1.controller.Project", {
	   
	   onInit: function () {
		   oView = this.getView();
		},
		
		onNavBack: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("App", {}, true);
			}
		},
		
		handleOpenToolbar : function(oEvent) {
			var oButton = oEvent.getSource();

			// create action sheet only once
			if (!this._actionSheet) {
				this._actionSheet = sap.ui
						.xmlfragment(
								"zsmt1.view.EmployeeToolbar",
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
		onLogout:function(){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("App", {}, true);
		},
		onEdit:function(){
			var oDialog = oView.byId("changeProjectDialog");
			if (!oDialog) {
	            // create dialog via fragment factory
	            oDialog = sap.ui.xmlfragment(this.getView().getId(), "zsmt1.view.ProjectDetailChange",this);
	            oView.addDependent(oDialog);
	         }
	         oDialog.open();
		},
		onSaveEditDialog:function(){
			var oModel = this.getView().getModel();
			var oView = this.getView();
			var oEntry = {};
			oEntry.Id = oEvent.getSource()
					.getBindingContext()
					.getProperty("Idproject");
			oEntry.Name = oView.byId(
					"nameText")
					.getValue().toUpperCase();
			oEntry.CustName = oView.byId(
					"custNameText")
					.getValue().toUpperCase();
			oEntry.BudgetDays = parseInt(oView
					.byId("budgetDaysText")
					.getValue());
			oEntry.StartProject =  oView.byId(
					"startProjectText")
					.getValue();
			oEntry.EndProject = oView.byId(
					"endProjectText")
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
													sap.ui.getCore().byId("FormDisplayProjDetails")
													.getModel().refresh(true);
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
			sap.ui.getCore().byId("FormDisplayProjDetails")
					.getModel().refresh(true);
			oView.byId("changeProjectDialog")
			.close();
		},
		onCancelEditDialog:function(){
			oView.byId("changeProjectDialog").close();
		}

	});
});