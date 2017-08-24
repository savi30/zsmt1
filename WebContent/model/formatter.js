jQuery.sap.declare("model.formatter");

formatter = {

  getName : function (value) {

  if( value == 10) return "Success";

  if( value == 3) return "Error";

  return "None";

  }

};