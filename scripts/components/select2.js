define(['../helper/util', '../ko', 'text!../templates/select2.html'], function(util, ko, htmlString) {
    function Select2ViewModel(params) {
        var self = this,
            valueField = params.valueField,
            textField = params.textField,
            selectedItem = params.selectedItem || {},
            selectedValue = selectedItem[valueField];

        self.editing = ko.observable(false);
        self.options = params.options;

        self.displayText = ko.observable(selectedItem[textField]);

        self.edit = function() {
            self.editing(true);
        };
    }

    return {
        viewModel: Select2ViewModel,
        template: htmlString
    };
});