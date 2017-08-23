sap.ui.define([
	"jquery.sap.global",
   "zsmt1/controller/BaseController",
   "sap/m/MessageToast",
   "sap/ui/model/resource/ResourceModel"
], function (JQuery, BaseController, MessageToast, ResourceModel) {
   "use strict";
  
   return BaseController.extend("zsmt1.controller.ProjectList", {
	   
	   onPress:function(oEvent){
		   MessageToast.show("Project selected");
	   },

				 /*  constructor : function(oView) {
					this._oView = oView;
				},*/
	   

		onOpenDialog : function () {
			var oView = this.getView();
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

		}
	});
	   
});