React  = require("react")
Router = require("react-router")

{Routes, Route, DefaultRoute, Link, Redirect} = Router

module.exports = (context) ->
  Layout = require('./components/layout')(context)
  Home   = require('./components/routes/home')(context)

  <Route name="home" path="/" handler={Layout}>
    <DefaultRoute handler={Home}/>
  </Route>
