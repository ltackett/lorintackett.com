App.PortfolioItemsController = Ember.ArrayController.extend({
  view: "portfolio_item",
  sortProperties: ['position'],
  sortAscending: false,
});
