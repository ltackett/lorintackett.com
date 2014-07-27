App.IndexRoute = Ember.Route.extend({
  model: function() {
    return {
      skills: ['Rails', 'Haml', 'Sass', 'jQuery']
    };
  }
});