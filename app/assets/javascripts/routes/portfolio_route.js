App.PortfolioItemsRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('portfolio_item');
  }
});