/*
 * jQuery-stickit v0.1.0
 * https://github.com/emn178/jquery-stickit
 *
 * Copyright 2014, emn178@gmail.com
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */
;(function($, window, document, undefined) {
  var Scope = {
    Parent: 0,
    Document: 1
  };

  var Stick = {
    None: 0,
    Fixed: 1,
    Absolute: 2
  };

  window.StickScope = Scope;

  function Sticker(element, options)
  {
    this.options = options || {};
    this.options.scope = this.options.scope || Scope.Parent;
    this.element = $(element);
    this.stick = Stick.None;
    this.spacer = $('<div />');
    this.spacer[0].id = element.id;
    this.spacer[0].className = element.className;
    this.spacer[0].style.cssText = element.style.cssText;
    this.spacer.addClass('stickit-spacer');
    this.spacer.css({
      display: 'none',
      visibility: 'hidden'
    });
    this.spacer.insertAfter(this.element);
    if(this.element.parent().css('position') == 'static')
      this.element.parent().css('position', 'relative');
    this.bound();
    this.store();
  }

  Sticker.prototype.store = function() {
    var element = this.element[0];
    this.origStyle = {
      width: element.style.width,
      position: element.style.position,
      left: element.style.left,
      top: element.style.top,
      bottom: element.style.bottom
    };
  };

  Sticker.prototype.restore = function() {
    this.element.css(this.origStyle);
  };

  Sticker.prototype.bound = function() {
    var element = this.element;
    this.margin = {
      top: parseInt(element.css('margin-top')) || 0,
      bottom: parseInt(element.css('margin-bottom')) || 0,
      left: parseInt(element.css('margin-left')) || 0,
      right: parseInt(element.css('margin-right')) || 0
    };
    this.parent = {
      border: {
        bottom: parseInt(element.parent().css('border-bottom-width')) || 0
      }
    };
  };

  Sticker.prototype.reset = function() {
    this.stick = Stick.None;
    this.spacer.hide();
    this.spacer.css('width', '');
    this.restore();
  };

  Sticker.prototype.setAbsolute = function() {
    this.stick = Stick.Absolute;
    this.element.css({
      'width': this.element.width() + 'px',
      'position': 'absolute',
      'top': this.origStyle.top,
      'left': this.origStyle.left,
      'bottom': '0'
    });
  };

  Sticker.prototype.setFixed = function(left) {
    this.stick = Stick.Fixed;
    this.element.css({
      'width': this.element.width() + 'px',
      'position': 'fixed',
      'top': '0',
      'left': left + 'px',
      'bottom': this.origStyle.bottom
    });
  };

  Sticker.prototype.locate = function() {
    var element = this.element;
    var spacer = this.spacer;
    switch(this.stick)
    {
      case Stick.Fixed:
        var rect = spacer[0].getBoundingClientRect();
        var top = rect.top - this.margin.top;
        if(top >= 0)
          this.reset();
        else if(this.options.scope == Scope.Parent)
        {
          // check parent
          rect = element.parent()[0].getBoundingClientRect();
          if(rect.bottom - this.parent.border.bottom <= element.outerHeight() + this.margin.top + this.margin.bottom)
            this.setAbsolute();
        }
        break;
      case Stick.Absolute:
        var rect = spacer[0].getBoundingClientRect();
        var top = rect.top - this.margin.top;
        var left = rect.left - this.margin.left;
        if(top >= 0)
          this.reset();
        else
        {
          rect = element.parent()[0].getBoundingClientRect();
          if(rect.bottom - this.parent.border.bottom > element.outerHeight() + this.margin.top + this.margin.bottom)
            this.setFixed(left);
        }
        break;
      case Stick.None:
      default:
        var rect = element[0].getBoundingClientRect();
        var top = rect.top - this.margin.top;
        if(top >= 0)
          return;

        spacer.height(element.height());
        spacer.show();
        var left = rect.left - this.margin.left;
        if(this.options.scope == Scope.Document)
          this.setFixed(left);
        else
        {
          var rect2 = element.parent()[0].getBoundingClientRect();
          if(rect2.bottom - this.parent.border.bottom <= element.outerHeight() + this.margin.top + this.margin.bottom)
            this.setAbsolute();
          else
            this.setFixed(left);
        }
        
        if(!spacer.width())
          spacer.width(element.width());
        break;
    }
  };

  Sticker.prototype.resize = function() {
    this.bound();
    if(this.stick == Stick.None)
      return;
    var element = this.element;
    var spacer = this.spacer;
    element.width(spacer.width());
    spacer.height(element.height());
    if(this.stick == Stick.Fixed)
    {
      var rect = this.spacer[0].getBoundingClientRect();
      var left = rect.left - this.margin.left;
      element.css('left', left + 'px');
    }
  };

  var stickers = [];
  function locate()
  {
    for(var i = 0;i < stickers.length;++i)
      stickers[i].locate();
  }

  function resize()
  {
    for(var i = 0;i < stickers.length;++i)
      stickers[i].resize();
    locate();
  }

  $.fn.stickit = function(options) {
    this.each(function() {
      var sticker = new Sticker(this, options);
      stickers.push(sticker);
      sticker.locate();
    });
  };

  $(document).ready(function() {
    $(window).bind('resize', resize);
    $(window).bind('scroll', locate);
  });
})(jQuery, window, document);
