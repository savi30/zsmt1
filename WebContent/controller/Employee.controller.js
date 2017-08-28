sap.ui.define([
	"jquery.sap.global",
   "zsmt1/controller/BaseController",
   "sap/m/MessageToast",
   "sap/ui/core/routing/History"
], function (JQuery, BaseController, MessageToast, History) {
   "use strict";
 
   var oDisplayFragment, oArgs, oView, oLayout,oRouter;
   
   return BaseController.extend("zsmt1.controller.Employee", {
	   
	   onInit: function () {
		   
		    oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		    oView = this.getView();
			oRouter.getRoute("employee").attachMatched(this._onRouteMatched, this);
			oDisplayFragment = sap.ui.xmlfragment(this.getView().getId(), "zsmt1.view.EmployeeDetailDisplay");
			oLayout = this.getView().byId("EmployeeDetailsFragment");
			oLayout.insertContent(oDisplayFragment);
		
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
			handleOpenToolbar : function (oEvent) {
			var oButton = oEvent.getSource();
 
			// create action sheet only once
			if (!this._actionSheet) {
				this._actionSheet = sap.ui.xmlfragment(
					"zsmt1.view.EmployeeToolbar",
					this
				);
				this.getView().addDependent(this._actionSheet);
			}
 
			this._actionSheet.openBy(oButton);
		},
		onLogout:function(){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("App", {}, true);
		},
		onEdit:function(){
			var oDialog = oView.byId("changeDialog");
			if (!oDialog) {
	            // create dialog via fragment factory
	            oDialog = sap.ui.xmlfragment(this.getView().getId(), "zsmt1.view.EmployeeDetailChange",this);
	            oView.addDependent(oDialog);
	         }
	         oDialog.open();
		},
		onCloseDialog : function () {
			oView.byId("changeDialog").close();
		},
		onSaveDialog:function(oEvent){
			
			var oEntry = {};
			var oFormatDate = sap.ui.core.format.DateFormat
			.getDateTimeInstance({
				pattern : "yyyy-MM-ddTKK:mm:ss"
			});
			oEntry.Id = oEvent.getSource().getBindingContext().getProperty("IdEmployee");
			oEntry.Name = this.getView().byId("employeeNameValue").getValue();
			oEntry.Surname =  this.getView().byId("employeeSurnameValue").getValue();
			oEntry.Region =  this.getView().byId("employeeRegionValue").getValue();
			oEntry.Country =  this.getView().byId("employeeCountryValue").getValue();
			oEntry.LastModified = new Date(oFormatDate.parse("2017-08-24T00:00:00"));

			OData
			.request(
					{
						requestUri : "http://bcsw-sap078.mymhp.net:8000/sap/opu/odata/SAP/ZSMT1ODATA_SRV/EmployeeSet("+oEntry.Id+")",
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
											requestUri : "http://bcsw-sap078.mymhp.net:8000/sap/opu/odata/SAP/ZSMT1ODATA_SRV/EmployeeSet("+oEntry.Id+")",
											method : "PUT",
											headers : oHeaders,
											data : {
												IdEmployee : oEntry.Id,
												Name : oEntry.Name,
												Surname : oEntry.Surname,
												WorkingHours : 0,
												ConsultLevel : "",
												Region : oEntry.Region,
												Country: oEntry.Country,
												NoProjects: 0,
												IdSrvU: 0,
												Flag : false,
												LastModified : oEntry.LastModified
											}
										},
										function(
												data,
												request) {
											MessageToast
													.show("Employee details updated successfully");
											this.getView().byId("FormDisplayEmpDetails").getModel().refresh(true);
										},
										function(
												err) {
											MessageToast
													.show("Failed to update employee details");

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
			this.getView().byId("FormDisplayEmpDetails").getModel().refresh(true);
			oView.byId("changeDialog").close();
		},
		_onRouteMatched : function (oEvent) {
			
			oArgs = oEvent.getParameter("arguments");
			
			oView.bindElement({
				path : "/EmployeeSet(" + oArgs.employeeId + ")",
				events : {
					change: this._onBindingChange.bind(this),
					dataRequested: function (oEvent) {
						oView.setBusy(true);
					},
					dataReceived: function (oEvent) {
						oView.setBusy(false);
					}
				}
			});
			
			var srvUnit = this.getView().byId("srvUnitText");
			srvUnit.bindElement("/EmployeeSet(" + oArgs.employeeId + ")/toServiceUnit");
			
			
		},
		_onBindingChange : function (oEvent) {
			// No data for the binding
			if (!this.getView().getBindingContext()) {
				oRouter.getTargets().display("notFound");
			}
		}

	});
});