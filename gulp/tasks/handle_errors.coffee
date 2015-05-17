notify = require("gulp-notify")

module.exports = () ->

  args = Array.prototype.slice.call(arguments)

  notify.onError(
    title: "Compile Error"
    message: "<%= error.message %>"
  ).apply(this, args)

  # Keep gulp from hanging on this task
  this.emit('end')
