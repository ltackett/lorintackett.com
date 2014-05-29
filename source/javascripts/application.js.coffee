#= require lib/jquery
#= require lib/skrollr.min
#= require bootstrap
#= require_self

s = skrollr.init()

do ($ = jQuery, window, document) ->

  resizeIntro = ->
    $('.slide .container').css height: $(window).height()

  resizeIntro()
  $(window).on 'resize', -> resizeIntro()

  $('.gallery').each ->
    el     = $(this)
    images = el.find('img')

    images.on 'click', (event) ->
      $(this).removeClass('active')
      if $(this).next().length > 0
        $(this).next().addClass('active')
      else
        $(this).parent().find('img:first-child').addClass('active')

  $(window).load ->
    $('body').removeClass('loading')

    tallestQuotes = Math.max.apply(null, $('.quotes').map(->
      @clientHeight
    ))

    $('.quotes-container').css marginTop: -(tallestQuotes / 2)

