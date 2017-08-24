sap.ui.define([
	"jquery.sap.global",
   "zsmt1/controller/BaseController",
   "sap/m/MessageToast",
   "sap/ui/model/resource/ResourceModel"
], function (JQuery, BaseController, MessageToast, ResourceModel) {
   "use strict";
  
   var oView,oRouter;
   return BaseController.extend("zsmt1.controller.ProjectList", {
	   
	   onInit: function () {
		   oView = this.getView();
		   oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		},
	   
	   onPress:function(oEvent){
		  
		   oRouter.navTo("project",{
			   projectId : oEvent.getSource().getBindingContext().getProperty("Idproject")
		   });
	   },
	   onEditProject:function(oEvent){
		   var oView = this.getView();
		   oView.bindElement({
				path : "/ProjectSet("+oEvent.getSource().getBindingContext().getProperty("Idproject")+ ")",
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
		   var oDialog = oView.byId("changeProjectDialog");
			if (!oDialog) {
	            // create dialog via fragment factory
	            oDialog = sap.ui.xmlfragment(this.getView().getId(), "zsmt1.view.ProjectDetailChange",this);
	            oView.addDependent(oDialog);
	         }
	         oDialog.open();
	   },
	   onSaveEditDialog:function(){
		   oView.byId("changeProjectDialog").close();
		   MessageToast.show("data saved");
	   },
	   onCancelEditDialog:function(){
		   oView.byId("changeProjectDialog").close();
	   },
		onOpenDialog : function () {
			oView = this.getView();
			var oDialog = oView.byId("createDialog");
						
			if (!oDialog) {
				
				//oView.removeDependent(oDialog);
				var oFragmentController = {
					onCloseDialog : function () {
						oDialog.close();
					},
				
					onSaveDialog : function () {
						MessageToast.show("Project saved. Don't worry!");
						oDialog.close();
			
					},
					/*afterClose : function () {
						oDialog.destroy();
					}*/
					//oDialog = this.getView().byId("nameInput").setValue("");
				};
				// create dialog via fragment factory
				var oDialog = sap.ui.xmlfragment(oView.getId(), "zsmt1.view.CreateProject", oFragmentController);

				oView.addDependent(oDialog);
			}
			oDialog.open();

		},
		_onBindingChange : function (oEvent) {
			// No data for the binding
			if (!this.getView().getBindingContext()) {
				oRouter.getTargets().display("notFound");
			}
		}
	});
	   
});