angular.module('CountriesApp', [
  'CountriesList',
  'CountryDetail',
  'ngRoute'
])

.config(function ($routeProvider) {
  $routeProvider.otherwise('/countries');
});
