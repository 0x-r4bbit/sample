angular.module('CountriesList', [
  'CountryListCard',
  'CountryService',
  'ngRoute'
])

.config(function ($routeProvider) {
  $routeProvider.when('/countries', {
    controller: 'CountriesListController as ctrl',
    template: 'countries_list.html',
    resolve: {
      countries: function (CountryService) {
        return CountryService.getCountries();
      }
    }
  });
})

.controller('CountriesListController', function (countries) {
  this.countries = countries;
});
