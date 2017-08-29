sap.ui.define([], function () {
	"use strict";

	return {

		contractType: function (iWorkingHours) {
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

			switch (iWorkingHours) {
				case "4":
					return resourceBundle.getText("workingHours4");
				case "6":
					return resourceBundle.getText("workingHours6");
				case "8":
					return resourceBundle.getText("workingHours8");
				default:
					return sStatus;
			}
		}
	};
});