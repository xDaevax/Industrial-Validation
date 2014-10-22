//Requires Knockout JS

var States = {
    Initial: 0,
    Modified: 1
};

//Base field validator class
var ValidatableField = function() {
    var self = this;
    console.log("constructor called");
    self.SetCustomOptions = function(options) {
      //Override
    };
    self.IsValid = ko.observable(false);
    self.FieldName = ko.observable("");
    self.DisplayName = ko.observable("");
    self.ValidationMessageFormat = ko.observable("");
    self.ValidationMessage = ko.pureComputed(function() {
      if(self.IsValid()) {
        return "";
      } else {
        return self.ValidationMessageFormat().replace("{0}", self.DisplayName());
      }
    }, self);
    self.ShowIndicator = ko.observable(false);
    self.Indicator = ko.observable("*"); //Default indicator
};
var ValidProto = function() {
  var self = this;
};

var protoInstance = new ValidProto();
//Factories namespace used for object creation.
var Factories = (function () {
    var ObjectCreationException = function(data) {
        var self = this;
        self.FormattedMessage = "";
        self.Value = "";
        //the name property is left lowercase so that the name of the type will be able to be read by developer consoles in the debugging and output windows.
        self.name = "ObjectCreationException";
        if(data != null) {
            self.FormattedMessage = data.MessageFormat;
            self.Value = data.Value;
        }
        //DOC_IMPORTANT: Self invoking function is required as the message prototype is a string value, this allows us to perform logic but show the correct value to console's and debuggers.
        self.message = function() {
           return self.FormattedMessage.replace("{0}", self.Value);
        }();
    };
    ObjectCreationException.prototype = new Error();
    var internalValidationRuleFactory = (function() {
        var types = null;
        internalCreate = function(aType) {
            if(aType != null && aType != undefined && aType != "") {
                if(types != null) {
                    if(types[aType] != undefined) {
                        return true;
                    } else {
                        throw new ObjectCreationException({MessageFormat: "No type binding for the name: '{0}', was found.", Value: aType});
                    }
                } else {
                    throw new ObjectCreationException({MessageFormat: "No type bindings configured."});
                }
            } else {
                throw new ObjectCreationException({MessageFormat: "No type specified"});
            }
        }
        return {
            CreateInstance: function (aType) {
                return (function(type) {
                    if(internalCreate(type)) {
                        var request = new types[type]();
                        return request;
                    }
                }(aType));
            },
            CreateInstance: function(aType, aArgs) {
                return (function(type, args) {
                    if(internalCreate(type)) {
                        var request = new types[type](args);
                        return request;
                    }
                }(aType, aArgs));
            },
            RegisterType: function(typeName, instance) {
                var proto = instance.prototype;
                //Lazy initialization
                if(!types) {
                    types = {};
                }
                if(proto instanceof ValidProto) {
                    types[typeName] = instance;
                } else {
                    throw new ObjectCreationException({MessageFormat: "Invalid type registration.  The type: '{0}' is not of type 'ValidatableField'.", Value: typeName});
                }
                return internalValidationRuleFactory;
            }
        };
    })();
    //Controlled exposure of the internal type
    return {
        RuleValidationFactory: internalValidationRuleFactory
    };
})();
