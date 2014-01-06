;(function($, window, document, undefined) {
  function Sticker(element, options)
  {
    this.element = $(element);
    this.options = options;
    this.sticky = false;
    this.spacer = $('<div />');
    this.spacer[0].className = element.className;
    this.spacer[0].cssText = element.cssText;
    this.spacer.css('visibility', 'hidden');
  }

  Sticker.prototype.locate = function() {
    var options = this.options;
    var element = this.element;
    var spacer = this.spacer;
    var target = this.sticky ? spacer : element;
    var rect = target[0].getBoundingClientRect();
    var stickyTop = 0;
    var top = rect.top - this.margin.top;
    var left = rect.left - this.margin.left;
    if(options.top !== undefined)
    {
      stickyTop = options.top;
      top -= options.top;
    }
      
    if(top < 0)
    {
      if(this.sticky)
        return;
      this.sticky = true;
      spacer.insertAfter(element);
      spacer.height(element.height());
      element.css({
        'width': element.width() + 'px',
        'position': 'fixed',
        'top': stickyTop + 'px',
        'left': left + 'px'
      });
    }
    else
    {
      if(!this.sticky)
        return;
      this.sticky = false;
      spacer.remove();
      element.css({
        'width': '',
        'position': '',
        'top': '',
        'left': ''
      });
    }
  };

  Sticker.prototype.resize = function() {
    var element = this.element;
    this.margin = {
      top: parseInt(element.css('margin-top')),
      bottom: parseInt(element.css('margin-bottom')),
      left: parseInt(element.css('margin-left')),
      right: parseInt(element.css('margin-right'))
    };
    if(!this.sticky)
      return;
    var spacer = this.spacer;
    element.width(spacer.width());
    spacer.height(element.height());
  };

  var stickers = [];
  function calculate()
  {
    for(var i = 0;i < stickers.length;++i)
      stickers[i].locate();
  }

  // var screenHeight, screenWidth;
  function resize()
  {
    for(var i = 0;i < stickers.length;++i)
      stickers[i].resize();
    // screenWidth = window.innerWidth || document.documentElement.clientWidth;
    // screenHeight = window.innerHeight || document.documentElement.clientHeight;
    calculate();
  }

  var listening = false;
  function listen()
  {
    if(listening)
      return;
    $(window).bind('resize', resize);
    $(window).bind('scroll', calculate);
    listening = true;
  }

  $.fn.stick = function(options) {
    this.each(function(){
      var sticker = new Sticker(this, options);
      stickers.push(sticker);
      sticker.resize();
      sticker.locate();
    })
    listen();
  };
})(jQuery, window, document);