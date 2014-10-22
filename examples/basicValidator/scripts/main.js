ko.bindingHandlers.animator = {
  "update": function(element, valueAccessor) {
    var newClass = valueAccessor().toLowerCase();
    var oldClass = "";
    if(newClass == "invalid") {
      oldClass = "valid";
    } else {
      oldClass = "invalid";
    } // end if/else
    $(element).switchClass(oldClass, newClass, 500, 'easeInOutQuad');
  }
};

Factories.RuleValidationFactory.RegisterType("required", Validators.RequiredField);

ko.extenders.validatable = function(target, options) {
    target.State = Factories.RuleValidationFactory.CreateInstance(options.validator);
    target.State.FieldName(options.name);
    target.State.DisplayName(options.display);
    target.State.ShowIndicator(options.indicator);
    function validate(newValue) {
      $(document).trigger("form-state-changed");
        target.State.Validate(newValue);
    } // end function validate
    target.subscribe(validate);
    return target;
};
var ValidatableViewModel = function() {
    var self = this;
    var initialState = States.Initial;
    self.AvailableFields = ko.observableArray([]);
    self.State = ko.observable(initialState);
    self.Bind = function(target) {
        console.log("Binding validatable properties.");
        //Call bind after all observable properties have been declared on the inherited view model.
        //Build a list of valid members to check the validation status of
        var members = [];
        for (var item in target) {
            if(!ko.isComputed(target[item]) && ko.isObservable(target[item])) {
                if(target[item].State != undefined && target[item].State != null) {
                    members.push({name: item, type: typeof target[item], instance: target[item]});
                } // end if
            } // end if
        } // end for loop
        self.AvailableFields(members);
    };
    self.IsValid = ko.pureComputed(function() {
        if(self.State() == States.Initial) {
            return true;
        } // end if
        var totalCount = self.AvailableFields().length;
        var validCount = 0;
        ko.utils.arrayForEach(self.AvailableFields(), function(item) {
          var isValid = item.instance.State.IsValid();
          if(isValid) {
            validCount++;
          } // end if
        });
        return validCount == totalCount;
    }, self);
    self.setInitialState = function() {
        self.State(States.Modified);
    };
    self.ValidationState = ko.pureComputed(function() {
        return self.IsValid() ? 'valid' : 'invalid';
    }, self);
};

var FormViewModel = function() {
    var self = this;
    self.FirstName = ko.observable("").extend({
      validatable: {
        name: "FirstName",
        display: "First Name",
        validator: "required",
        indicator: true
      }
    });
    self.LastName = ko.observable("").extend({
      validatable: {
        name: "LastName",
        display: "Last Name",
        validator: "required",
        indicator: true
      }
    });
    self.Bind(self);
};
FormViewModel.prototype = new ValidatableViewModel;

$(function() {
  $(document).bind("form-state-changed", function(e, data) {
    if(model.State() == States.Initial) {
      model.State(States.Modified);
    } // end if
  });
});
