angular.module('CountryDetailCard', [
  'CountryInfoTable'
])

.directive('countryDetailCard', function () {
  return {
    restrict: 'E',
    templateUrl: 'country_detail_card.html',
    scope: {},
    bindToController: {
      country: '='
    },
    controller: function () {},
    controllerAs: 'ctrl'
  }
});
