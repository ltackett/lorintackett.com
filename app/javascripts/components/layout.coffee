React  = require("react/addons")
Router = require("react-router")

{RouteHandler} = Router

module.exports = (context) ->
  React.createClass
    displayName: 'Layout'

    render: ->
      # mixpanel.track("Page Visit", {})

      <div id="layout" style={@mainStyle} onClick={@handleClick}>
        <RouteHandler/>
      </div>
