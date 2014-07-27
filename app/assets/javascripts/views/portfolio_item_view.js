App.PortfolioItemComponent = Ember.Component.extend({
  tagName:           'li',
  classNames:        ['grid-item'],
  classNameBindings: ['item.featured:grid-item-big',],

  didInsertElement:  function(){
    var el = this;

    var image      = el.get('item.background_image');
    var background = el.get('item.background_color');
    var color      = el.get('item.foreground_color');

    if (image.length > 0) {image = "url(/assets/"+image+")"};

    el.$().css({
      backgroundImage: image,
      backgroundColor: background,
      color:           color,
    });

    el.$().addClass(el.get('item.title').dasherize())
  }
});

// data-image="item.background_image"
// data-background="item.background_color"
// data-color="item.foreground_color"