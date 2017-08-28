sap.ui.define([
	"jquery.sap.global",
   "zsmt1/controller/BaseController",
   "sap/m/MessageToast",
   "sap/ui/core/routing/History"
], function (JQuery, BaseController, MessageToast, History) {
   "use strict";
  
   return BaseController.extend("zsmt1.controller.EmployeeSkills", {
	   
	   onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("employee").attachMatched(this._onRouteMatched, this);
			this.oSF = this.getView().byId("searchField");
		},
		_onRouteMatched : function (oEvent) {
			var oArgs, oView;
			oArgs = oEvent.getParameter("arguments");
			oView = this.getView();
			var oList = this.getView().byId("employeeSkillList");
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
                template : new sap.m.StandardListItem({
                    title: "{Name}"   
    
                })
            }); 
		},
		   onSaveDialog:function(){
			   this._oSkillDialog.close();
			   MessageToast.show("Skill saved");
		   },
		   onCloseDialog:function(){
			   this._oSkillDialog.close();
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
		_onBindingChange : function (oEvent) {
			// No data for the binding
			if (!this.getView().getBindingContext()) {
				sap.ui.core.UIComponent.getRouterFor(this).getTargets().display("notFound");
			}
		},
		onSearch: function (event) {
			var item = event.getParameters("suggestionItem");
			if (item) {
				sap.m.MessageToast.show("search for: " + item.query);
			}
		},
		onSuggest: function (event) {
			var value = event.getParameter("suggestValue");
			var filters = [];
			if (value) {
				filters = [new sap.ui.model.Filter(
						[ new sap.ui.model.Filter("Name", function(sDes) 
								{
                    return (sDes || "").toUpperCase().indexOf(value.toUpperCase()) > -1;
                })
            ], false)];
			}
			sap.ui.getCore().byId("searchField").getBinding("suggestionItems").filter(filters);
			sap.ui.getCore().byId("searchField").suggest();
		}
		

	});
});