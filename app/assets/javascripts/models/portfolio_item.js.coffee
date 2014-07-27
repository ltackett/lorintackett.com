# for more details see: http://emberjs.com/guides/models/defining-models/

App.PortfolioItemSerializer = DS.ActiveModelSerializer.extend DS.EmbeddedRecordsMixin,
  attrs:
    skills: {embedded: 'always'}

App.PortfolioItem = DS.Model.extend
  position:         DS.attr 'number'
  title:            DS.attr 'string'
  description:      DS.attr 'string'
  featured:         DS.attr 'boolean'
  featured_image:   DS.attr 'string'
  background_image: DS.attr 'string'
  background_color: DS.attr 'string'
  foreground_color: DS.attr 'string'
  skills:           DS.hasMany 'skill'
