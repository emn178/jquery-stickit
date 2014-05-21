/*
 * jQuery-stickit v0.1.7
 * https://github.com/emn178/jquery-stickit
 *
 * Copyright 2014, emn178@gmail.com
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */
;(function($, window, document, undefined) {
  var KEY = 'jquery-stickit';
  var SPACER_KEY = KEY + '-spacer';
  var SELECTOR = ':' + KEY;

  var IE7 = navigator.userAgent.indexOf('MSIE 7.0') != -1;
  var OFFSET = IE7 ? -2 : 0;

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
    this.options.className = this.options.className || 'stick';
    this.options.top = this.options.top || 0;
    this.options.extraHeight = this.options.extraHeight || 0;
    this.element = $(element);
    this.stick = Stick.None;
    this.spacer = $('<div />');
    this.spacer[0].id = element.id;
    this.spacer[0].className = element.className;
    this.spacer[0].style.cssText = element.style.cssText;
    this.spacer.addClass(SPACER_KEY);
    this.spacer.css({
      display: 'none',
      visibility: 'hidden'
    });
    this.spacer.insertAfter(this.element);
    if(this.element.parent().css('position') == 'static')
      this.element.parent().css('position', 'relative');
    this.bound();
    this.precalculate();
    this.store();
  }

  Sticker.prototype.store = function() {
    var element = this.element[0];
    this.origStyle = {
      width: element.style.width,
      position: element.style.position,
      left: element.style.left,
      top: element.style.top,
      bottom: element.style.bottom,
      zIndex: element.style.zIndex
    };
  };

  Sticker.prototype.restore = function() {
    this.element.css(this.origStyle);
  };

  Sticker.prototype.bound = function() {
    var element = this.element;
    if(!IE7 && element.css('box-sizing') == 'border-box')
    {
      var bl = parseInt(element.css('border-left-width')) || 0;
      var br = parseInt(element.css('border-right-width')) || 0;
      var pl = parseInt(element.css('padding-left')) || 0;
      var pr = parseInt(element.css('padding-right')) || 0;
      this.extraWidth = bl + br + pl + pr;
    }
    else
      this.extraWidth = 0;
    
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

  Sticker.prototype.precalculate = function() {
    this.baseTop = this.margin.top + this.options.top;
    this.basePadding = this.baseTop + this.margin.bottom;
    this.baseParentOffset = this.options.extraHeight - this.parent.border.bottom;
  };

  Sticker.prototype.reset = function() {
    this.stick = Stick.None;
    this.spacer.hide();
    this.spacer.css('width', '');
    this.restore();
    this.element.removeClass(this.options.className);
  };

  Sticker.prototype.setAbsolute = function(left) {
    if(this.stick == Stick.None)
      this.element.addClass(this.options.className);
    this.stick = Stick.Absolute;
    this.element.css({
      'width': this.element.width() + this.extraWidth + 'px',
      'position': 'absolute',
      'top': this.origStyle.top,
      'left': left + 'px',
      'bottom': -this.options.extraHeight + 'px',
      'z-index': '99'
    });
  };

  Sticker.prototype.setFixed = function(left) {
    if(this.stick == Stick.None)
      this.element.addClass(this.options.className);
    this.stick = Stick.Fixed;
    this.element.css({
      'width': this.element.width() + this.extraWidth  + 'px',
      'position': 'fixed',
      'top': this.options.top + 'px',
      'left': left + 'px',
      'bottom': this.origStyle.bottom,
      'z-index': '100'
    });
  };

  Sticker.prototype.locate = function() {
    var element = this.element;
    var spacer = this.spacer;
    switch(this.stick)
    {
      case Stick.Fixed:
        var rect = spacer[0].getBoundingClientRect();
        var top = rect.top - this.baseTop;
        if(top >= 0)
          this.reset();
        else if(this.options.scope == Scope.Parent)
        {
          // check parent
          rect = element.parent()[0].getBoundingClientRect();
          if(rect.bottom + this.baseParentOffset <= element.outerHeight() + this.basePadding)
            this.setAbsolute(this.spacer.position().left);
        }
        break;
      case Stick.Absolute:
        var rect = spacer[0].getBoundingClientRect();
        var top = rect.top - this.baseTop;
        var left = rect.left - this.margin.left;
        if(top >= 0)
          this.reset();
        else
        {
          rect = element.parent()[0].getBoundingClientRect();
          if(rect.bottom + this.baseParentOffset > element.outerHeight() + this.basePadding)
            this.setFixed(left + OFFSET);
        }
        break;
      case Stick.None:
      default:
        var rect = element[0].getBoundingClientRect();
        var top = rect.top - this.baseTop;
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
          if(rect2.bottom + this.baseParentOffset <= element.outerHeight() + this.basePadding)
            this.setAbsolute(this.element.position().left);
          else
            this.setFixed(left + OFFSET);
        }
        
        if(!spacer.width())
          spacer.width(element.width());
        break;
    }
  };

  Sticker.prototype.resize = function() {
    this.bound();
    this.precalculate();
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
    this.locate();
  };

  $.fn.stickit = function(options) {
    this.each(function() {
      var sticker = new Sticker(this, options);
      $(this).data(KEY, sticker);
      sticker.locate();
    });
  };

  $.expr[':'][KEY] = function(element) {
    return !!$(element).data(KEY);
  };

  function resize()
  {
    $(SELECTOR).each(function() {
      $(this).data(KEY).resize();
    });
  }

  function scroll()
  {
    $(SELECTOR).each(function() {
      $(this).data(KEY).locate();
    });
  }

  $(document).ready(function() {
    $(window).on('resize', resize).on('scroll', scroll);
  });
})(jQuery, window, document);
