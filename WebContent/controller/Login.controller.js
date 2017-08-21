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
   
   return BaseController.extend("zsmt1.controller.Login", {
	   
	   
	   onInit: function () {
		   this.getView().setModel(new JSONModel({
				name : "",
				email : ""
			}));

			// attach handlers for validation errors
			sap.ui.getCore().attachValidationError(function (evt) {
				var control = evt.getParameter("element");
				if (control && control.setValueState) {
					control.setValueState("Error");
				}
			});
			sap.ui.getCore().attachValidationSuccess(function (evt) {
				var control = evt.getParameter("element");
				if (control && control.setValueState) {
					control.setValueState("None");
				}
			});
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("login").attachMatched(this._onRouteMatched, this);
		},
		
		_onRouteMatched : function (oEvent) {
			
			isManager = oEvent.getParameter("arguments").isManager;
			
		},
		
		handleLogin : function(oEvent){
	
			var view = this.getView();
			var inputs = [
				view.byId("nameInput"),
				view.byId("passwordInput")
			];
 
			jQuery.each(inputs, function (i, input) {
				if (!input.getValue()) {
					input.setValueState("Error");
				}
			});
 
		
			var canContinue = true;
			jQuery.each(inputs, function (i, input) {
				if ("Error" === input.getValueState()) {
					canContinue = false;
					return false;
				}
			});
 
			if (canContinue) {
				
				if(isManager){
					if(inputs[0].getValue() == "{i18n>managerUsername}" && inputs[1].getValue() == "{i18n>managerPassword}"){
						var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
						oRouter.navTo("manager");
					}
				}else{
					
				}
				
			} else {
				jQuery.sap.require("sap.m.MessageBox");
				MessageBox.alert("Complete your input first.");
			}
		},
		
		typeEMail : SimpleType.extend("email", {
			formatValue: function (oValue) {
				return oValue;
			},
			parseValue: function (oValue) {
				//parsing step takes place before validating step, value can be altered
				return oValue;
			},
			validateValue: function (oValue) {
				// The following Regex is NOT a completely correct one and only used for demonstration purposes.
				// RFC 5322 cannot even checked by a Regex and the Regex for RFC 822 is very long and complex.
				var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
				if (!oValue.match(mailregex)) {
					throw new ValidateException("'" + oValue + "' is not a valid email address");
				}
			}
		}),
		
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