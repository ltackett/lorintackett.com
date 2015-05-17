React  = require("react")

# Homepage markup
# =============================================================================
module.exports = (context) ->
  React.createClass
    displayName: 'Home'

    render: ->
      <div id="home">
        <h1 className="quote">
          <span>You’re a ghost driving a meat-coated skeleton made from stardust.</span>
          <span>... what do you have to be scared of?</span>
        </h1>

        <section className="info">
          <dl>
            <dt>quote by</dt>
            <dd>
              <a href="https://twitter.com/Porkbeard/status/296920453442842625">@porkbeard</a>
            </dd>
            <dt>designed by</dt>
            <dd>
              <a href="http://twitter.com/ltackett">@ltackett</a>
            </dd>
          </dl>
          <p>
            Need a front-end developer?
            <a href="http://resume.lorintackett.com">I am available for limited projects.</a>
          </p>
        </section>

        <div className="clouds">
          <div className="clouds-1"></div>
          <div className="clouds-2"></div>
          <div className="clouds-3"></div>
        </div>
      </div>
