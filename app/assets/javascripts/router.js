// For more information see: http://emberjs.com/guides/routing/

App.Router.map(function(){
  this.resource('portfolio_items', {path: 'portfolio'})
  this.resource('about')
  this.resource('recommendations')
});

App.Router.reopen({
  location: 'history'
});