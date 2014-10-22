//Requires Knockout JS
//Requires library.js

//Validators namespace used for object creation.
var Validators = (function () {

  //checks a value to see if it is null or undefined
  function isNullOrUndefined(val) {
    return (val == null || val == undefined);
  }; // end function isNullOrUndefined

  //checks a value to see if it is truly empty
  function isNullOrWhiteSpace(val) {
    return (isNullOrUndefined(val) || val == "" || val.trim() == "");
  }; // end function isNullOrWhiteSpace

  //checks to see if a value is numeric
  function isNumber(val) {
    return (!isNaN(parseFloat(n)) && isFinite(n));
  }; // end function isNumber

  var requiredField = function() {
    var self = this;
    ValidatableField.call(self); // copy the methods from ValidatableField
    //Override the prototype validate method
    self.Validate = function(data) {
      console.log("Required Validation...");
      if(!isNullOrWhiteSpace(data)) {
        self.IsValid(true);
      } else {
        self.IsValid(false);
      } // end if/else
    }; // end method Validate
    self.ValidationMessageFormat("{0} is required.");
  };
  requiredField.prototype = protoInstance;

  var numericField = function() {
    var self = this;
    //Override the prototype validate method
    self.Validate = function(data) {
      console.log("Numeric Validation...");
      if(isNumeric(data)) {
        self.IsValid(true);
      } else {
        self.IsValid(false);
      }
    }; // end method Validate
  };
  numericField.prototype = protoInstance;

  var rangedField = function() {
    var self = this;
    self.Validate = function(data) {
      console.log("Ranged Validation...");
    };
  };
  rangedField.prototype = protoInstance;

  return {
    RequiredField: requiredField,
    NumericField: numericField,
    RangedField: rangedField
  };
})();
