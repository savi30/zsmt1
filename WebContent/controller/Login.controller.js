sap.ui.define([
	"jquery.sap.global",
   "zsmt1/controller/BaseController",
   "sap/m/MessageToast",
   "sap/ui/core/routing/History",
	'sap/m/MessageBox',
	'sap/ui/model/SimpleType',
	'sap/ui/model/ValidateException',
	'sap/ui/model/json/JSONModel'
], function (JQuery, BaseController, MessageToast, History, MessageBox, SimpleType, ValidateException, JSONModel) {
   "use strict";
  
   var isManager = false;
   var username ;
   var password ;
   var oRouter ;
   return BaseController.extend("zsmt1.controller.Login", {
	   
	   
	   onInit: function () {
		   oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("login").attachMatched(this._onRouteMatched, this);
			
			
		},
		
		_onRouteMatched : function (oEvent) {
			
			isManager = oEvent.getParameter("arguments").isManager;
			
		},
		
		handleLogin : function(oEvent){
	
			    username = this.getView().byId("nameInput").getValue();
			    password = this.getView().byId("passwordInput").getValue();
			 
			if(username == "Manager" && password == "1234"){
				oRouter.navTo("manager");
			}else{
				MessageBox.alert("Incorrect username or password");
			}

			username = this.getView().byId("nameInput").setValue("");
		    password = this.getView().byId("passwordInput").setValue("");
			
			
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
		}

	});
});