sap.ui.define([
	"jquery.sap.global",
   "zsmt1/controller/BaseController",
   "sap/m/MessageToast",
   "sap/ui/core/routing/History"
], function (JQuery, BaseController, MessageToast, History) {
   "use strict";
  
   return BaseController.extend("zsmt1.controller.Project", {
	   
	   onInit: function () {

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
		}
		
		
		
/*			handleOpenToolbar : function (oEvent) {
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
			MessageToast.show("Implement Edit");
		}*/

	});
});