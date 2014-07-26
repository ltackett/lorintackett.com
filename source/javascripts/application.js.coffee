#= require lib/underscore
#= require lib/jquery
#= require lib/jgestures
#= require lib/skrollr
#= require bootstrap
#= require_self

# Initialize Skrollr
s = skrollr.init()

do ($ = jQuery, window, document) ->

  # External links should open externally
  # ============================================================================
  $('a[rel="external"]').attr('target', '_blank');

  # Resize slides and loading screen
  # ============================================================================
  resizeIntro = ->
    $('#loading').css height: $(window).height()
    $('.slide .container').css height: $(window).height()

  resizeIntro()
  $(window).on 'resize', -> resizeIntro()

  # Simple image gallery
  # ============================================================================
  $('.gallery').each ->
    el     = $(this)
    images = el.find('img')

    # Click handler for images in the gallery
    images.on 'click', (event) ->
      $(this).removeClass('active')

      if $(this).next().length > 0
        $(this).next().addClass('active')
      else
        $(this).parent().find('img:first-child').addClass('active')

  # Loading finished
  # ============================================================================
  $(window).load ->
    $('body').removeClass('loading')

  # Scroll direction
  # ============================================================================
  slideIndex = 1
  setSlide = (direction) ->
    $slides        = $('.slide')
    $currentSlide  = $slides.filter('.active')
    $incomingSlide = $currentSlide
    sl             = $slides.length

    # Setup slide direction.
    # ============================================================================
    if direction == 'prev' then slideIndex-- # We are scrolling up. Subtract from index
    if direction == 'next' then slideIndex++ # We are scrolling down. Add to index

    if      slideIndex < 1   then slideIndex = 1      # First slide? Reset slideIndex to start position.
    else if slideIndex > sl  then slideIndex = sl     # Last slide? Reset slideIndex to end position.
    else    $incomingSlide = $($slides[slideIndex-1]) # Otherwise, set incoming slide to slideIndex

    # Class names dance
    $slides.removeClass('active')
    $incomingSlide.addClass('active')
    $currentSlide = $slides.filter('.active')

    # Animated scroll via Skrollr's animateTo method,
    # because mobile doesn't support scrollTop
    s.animateTo($currentSlide.data('scroll-position'), {duration: 300})

  # Setup debouncing (for mac-style scrolling)
  # ============================================================================
  setPrevSlide = -> setSlide('prev')
  setNextSlide = -> setSlide('next')

  prevSlide = _.debounce(setPrevSlide, 100, true);
  nextSlide = _.debounce(setNextSlide, 100, true);

  # Disable mouse scrolling and bind directional events
  # ============================================================================
  $(window).on mousewheel: (e) ->
    if e.originalEvent.wheelDelta >= 0
      prevSlide()
    else
      nextSlide()

  # Bindings for mobile
  # ============================================================================
  $('body').on touchmove: (e) -> e.stopPropagation()
  $(document).on swipeone: (event, obj) ->
    direction = obj.description.split(":")[3]
    if direction is "down"
      prevSlide()
    else if direction is "up"
      nextSlide()

  # Bindings for keyboard
  # ============================================================================
  $(document).keydown (e) -> if e.keyCode == 38 then prevSlide()
  $(document).keydown (e) -> if e.keyCode == 40 then nextSlide()
