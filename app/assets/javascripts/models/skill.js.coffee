# for more details see: http://emberjs.com/guides/models/defining-models/

App.Skill = DS.Model.extend
  title: DS.attr 'string'
  portfolio_items: DS.hasMany("portfolio_item")
