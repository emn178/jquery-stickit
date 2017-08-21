/**
 * [jQuery-stickit]{@link https://github.com/emn178/jquery-stickit}
 *
 * @version 0.2.14
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2014-2017
 * @license MIT
 */
(function ($) {
  var KEY = 'jquery-stickit';
  var SPACER_KEY = KEY + '-spacer';
  var SELECTOR = ':' + KEY;
  var IE7 = navigator.userAgent.indexOf('MSIE 7.0') != -1;
  var OFFSET = IE7 ? -2 : 0;
  var MUTATION = window.MutationObserver !== undefined;
  var animationend = 'animationend webkitAnimationEnd oAnimationEnd';
  var transitionend = 'transitionend webkitTransitionEnd oTransitionEnd';
  var fullscreenchange = 'webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange';

  var Scope = window.StickScope = {
    Parent: 0,
    Document: 1
  };

  var Stick = {
    None: 0,
    Fixed: 1,
    Absolute: 2
  };

  var init = false, lock = false;

  $.expr[':'][KEY] = function (element) {
    return !!$(element).data(KEY);
  };

  function Sticker(element, optionList) {
    this.element = $(element);
    this.lastValues = {};
    if (!$.isArray(optionList)) {
      optionList = [optionList || {}];
    }
    if (!optionList.length) {
      optionList.push({});
    }
    this.optionList = optionList;
    var transform = this.element.css('transform') || '';
    this.defaultZIndex = this.element.css('z-index') || 100;
    if (this.defaultZIndex == 'auto') {
      this.defaultZIndex = 100;
    } else if (this.defaultZIndex == '0' && transform != 'none') {
      this.defaultZIndex = 100;
    }
    this.updateOptions();

    this.offsetY = 0;
    this.lastY = 0;
    this.stick = Stick.None;
    this.spacer = $('<div />');
    this.spacer[0].id = element.id;
    this.spacer[0].className = element.className;
    this.spacer[0].style.cssText = element.style.cssText;
    this.spacer.addClass(SPACER_KEY);
    this.spacer[0].style.cssText += ';visibility: hidden !important;display: none !important';
    this.spacer.insertAfter(this.element);
    if (this.element.parent().css('position') == 'static') {
      this.element.parent().css('position', 'relative');
    }
    this.origWillChange = this.element.css('will-change');
    if (this.origWillChange == 'auto') {
      this.element.css('will-change', 'transform');
    }
    if (transform == 'none') {
      this.element.css('transform', 'translateZ(0)');
    } else if (transform.indexOf('matrix3d') == -1) {
      this.element.css('transform', this.element.css('transform') + ' translateZ(0)');
    }
    this.bound();
    this.precalculate();
    this.store();
  }

  Sticker.prototype.trigger = function (eventName) {
    var name = 'on' + eventName.charAt(0).toUpperCase() + eventName.slice(1);
    if (this.options[name]) {
      this.options[name].call(this.element);
    }
    this.element.trigger('stickit:' + eventName);
  };

  Sticker.prototype.isActive = function (options) {
    return (options.screenMinWidth === undefined || screenWidth >= options.screenMinWidth) &&
      (options.screenMaxWidth === undefined || screenWidth <= options.screenMaxWidth);
  };

  Sticker.prototype.updateCss = function (options) {
    if (this.element.hasClass(this.options.className) && options.className != this.options.className) {
      this.element.removeClass(this.options.className).addClass(options.className);
    }
    var update = {};
    if (this.stick == Stick.Absolute) {
      if (this.options.extraHeight != options.extraHeight) {
        update.bottom = -this.options.extraHeight + 'px';
      }
    } else {
      if (this.options.top != options.top) {
        update.top = (options.top + this.offsetY) + 'px';
      }
    }
    if (this.options.zIndex != options.zIndex) {
      update.zIndex = this.getZIndex(options);
    }
    this.element.css(update);
  };

  Sticker.prototype.updateOptions = function () {
    var activeKey = this.getActiveOptionsKey();
    if (this.activeKey == activeKey) {
      return;
    }
    this.activeKey = activeKey;
    var options = this.getActiveOptions();
    if (this.options) {
      if (!activeKey) {
        this.reset();
      } else if (this.stick != Stick.None) {
        if (options.scope == this.options.scope) {
          this.updateCss(options);
        } else {
          this.reset();
          setTimeout(this.locate.bind(this));
        }
      }
    }
    this.options = options;
    this.zIndex = this.getZIndex(options);
  };

  Sticker.prototype.getZIndex = function (options) {
    return options.zIndex === undefined ? this.defaultZIndex : options.zIndex;
  };

  Sticker.prototype.getActiveOptionsKey = function () {
    var indices = [];
    for (var i = 0;i < this.optionList.length;++i) {
      if (this.isActive(this.optionList[i])) {
        indices.push(i);
      }
    }
    return indices.join('_');
  };

  Sticker.prototype.getActiveOptions = function () {
    var options = {};
    for (var i = 0;i < this.optionList.length;++i) {
      var opt = this.optionList[i];
      if (this.isActive(opt)) {
        $.extend(options, opt);
      }
    }
    options.scope = options.scope || Scope.Parent;
    options.className = options.className || 'stick';
    options.top = options.top || 0;
    options.extraHeight = options.extraHeight || 0;
    if (options.overflowScrolling === undefined) {
      options.overflowScrolling = true;
    }
    return options;
  };

  Sticker.prototype.store = function () {
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

  Sticker.prototype.restore = function () {
    this.element.css(this.origStyle);
  };

  Sticker.prototype.bound = function () {
    var element = this.element;
    if (!IE7 && element.css('box-sizing') == 'border-box') {
      var bl = parseFloat(element.css('border-left-width')) || 0;
      var br = parseFloat(element.css('border-right-width')) || 0;
      var pl = parseFloat(element.css('padding-left')) || 0;
      var pr = parseFloat(element.css('padding-right')) || 0;
      this.extraWidth = bl + br + pl + pr;
    } else {
      this.extraWidth = 0;
    }

    this.margin = {
      top: parseFloat(element.css('margin-top')) || 0,
      bottom: parseFloat(element.css('margin-bottom')) || 0,
      left: parseFloat(element.css('margin-left')) || 0,
      right: parseFloat(element.css('margin-right')) || 0
    };
    this.parent = {
      border: {
        bottom: parseFloat(element.parent().css('border-bottom-width')) || 0
      }
    };
  };

  Sticker.prototype.precalculate = function () {
    this.baseTop = this.margin.top + this.options.top;
    this.basePadding = this.baseTop + this.margin.bottom;
    this.baseParentOffset = this.options.extraHeight - this.parent.border.bottom;
    this.offsetHeight = this.options.overflowScrolling ? Math.max(this.element.outerHeight(false) + this.basePadding - screenHeight, 0) : 0;
    this.minOffsetHeight = -this.offsetHeight;
  };

  Sticker.prototype.reset = function () {
    if (this.stick == Stick.Absolute) {
      this.trigger('unend');
      this.trigger('unstick');
    } else if (this.stick == Stick.Fixed) {
      this.trigger('unstick');
    }
    this.stick = Stick.None;
    this.spacer.css('width', this.origStyle.width);
    this.spacer[0].style.cssText += ';display: none !important';
    this.restore();
    this.element.removeClass(this.options.className);
  };

  Sticker.prototype.setAbsolute = function (left) {
    if (this.stick == Stick.None) {
      this.element.addClass(this.options.className);
      this.trigger('stick');
      this.trigger('end');
    } else {
      this.trigger('end');
    }
    this.stick = Stick.Absolute;
    this.element.css({
      width: this.element.width() + this.extraWidth + 'px',
      position: 'absolute',
      top: this.origStyle.top,
      left: left + 'px',
      bottom: -this.options.extraHeight + 'px',
      'z-index': this.zIndex
    });
  };

  Sticker.prototype.setFixed = function (left, lastY, offsetY) {
    if (this.stick == Stick.None) {
      this.element.addClass(this.options.className);
      this.trigger('stick');
    } else {
      this.trigger('unend');
    }
    if (!this.options.overflowScrolling) {
      offsetY = 0;
    }
    this.stick = Stick.Fixed;
    this.lastY = lastY;
    this.offsetY = offsetY;
    this.element.css({
      width: this.element.width() + this.extraWidth  + 'px',
      position: 'fixed',
      top: (this.options.top + offsetY) + 'px',
      left: left + 'px',
      bottom: this.origStyle.bottom,
      'z-index': this.zIndex
    });
  };

  Sticker.prototype.updateScroll = function (newY) {
    if (this.offsetHeight == 0 || !this.options.overflowScrolling) {
      return;
    }
    var offsetY = Math.max(this.offsetY + newY - this.lastY, this.minOffsetHeight);
    offsetY = Math.min(offsetY, 0);
    this.lastY = newY;
    if (this.offsetY == offsetY) {
      return;
    }
    this.offsetY = offsetY;
    this.element.css('top', (this.options.top + this.offsetY) + 'px');
  };

  Sticker.prototype.isHeigher = function () {
    return this.options.scope == Scope.Parent && this.element.parent().height() <= this.element.outerHeight(false) + this.margin.bottom;
  };

  Sticker.prototype.locate = function () {
    if (!this.activeKey) {
      return;
    }
    var rect, top, left, element = this.element, spacer = this.spacer;
    switch (this.stick) {
      case Stick.Fixed:
        rect = spacer[0].getBoundingClientRect();
        top = rect.top - this.baseTop;
        if (top >= 0 || this.isHeigher()) {
          this.reset();
        } else if (this.options.scope == Scope.Parent) {
          rect = element.parent()[0].getBoundingClientRect();
          if (rect.bottom + this.baseParentOffset + this.offsetHeight <= element.outerHeight(false) + this.basePadding) {
            this.setAbsolute(this.spacer.position().left);
          } else {
            this.updateScroll(rect.bottom);
          }
        } else {
          this.updateScroll(rect.bottom);
        }
        break;
      case Stick.Absolute:
        rect = spacer[0].getBoundingClientRect();
        top = rect.top - this.baseTop;
        left = rect.left - this.margin.left;
        if (top >= 0 || this.isHeigher()) {
          this.reset();
        } else {
          rect = element.parent()[0].getBoundingClientRect();
          if (rect.bottom + this.baseParentOffset + this.offsetHeight > element.outerHeight(false) + this.basePadding) {
            this.setFixed(left + OFFSET, rect.bottom, -this.offsetHeight);
          }
        }
        break;
      case Stick.None:
      /* falls through */
      default:
        rect = element[0].getBoundingClientRect();
        top = rect.top - this.baseTop;
        if (top >= 0 || this.isHeigher()) {
          return;
        }

        var rect2 = element.parent()[0].getBoundingClientRect();
        spacer.height(element.height());
        spacer.show();
        left = rect.left - this.margin.left;
        if (this.options.scope == Scope.Document) {
          this.setFixed(left, rect.bottom, 0);
        } else {
          if (rect2.bottom + this.baseParentOffset + this.offsetHeight <= element.outerHeight(false) + this.basePadding) {
            this.setAbsolute(this.element.position().left);
          } else {
            this.setFixed(left + OFFSET, rect.bottom, 0);
          }
        }

        if (!spacer.width()) {
          spacer.width(element.width());
        }
        break;
    }
  };

  Sticker.prototype.refresh = function () {
    this.updateOptions();
    this.bound();
    this.precalculate();
    if (this.stick == Stick.None) {
      this.locate();
      return;
    }
    var element = this.element;
    var spacer = this.spacer;
    if (this.lastValues.width != spacer.width()) {
      element.width(this.lastValues.width = spacer.width());
    }
    if (this.lastValues.height != element.height()) {
      spacer.height(this.lastValues.height = element.height());
    }
    if (this.stick == Stick.Fixed) {
      var rect = this.spacer[0].getBoundingClientRect();
      var left = rect.left - this.margin.left;
      if (this.lastValues.left != left + 'px') {
        element.css('left', this.lastValues.left = left + 'px');
      }
    }
    this.locate();
  };

  Sticker.prototype.destroy = function () {
    this.reset();
    this.spacer.remove();
    this.element.removeData(KEY);
  };

  Sticker.prototype.enableWillChange = function (enabled) {
    if (this.origWillChange != 'auto') {
      return;
    }
    this.element.css('will-change', enabled ? 'transform' : this.origWillChange);
  };

  var screenHeight, screenWidth;
  function resize() {
    screenHeight = window.innerHeight || document.documentElement.clientHeight;
    screenWidth = window.innerWidth || document.documentElement.clientWidth;
    refresh();
  }

  function refresh() {
    lock = true;
    $(SELECTOR).each(function () {
      $(this).data(KEY).refresh();
    });
    setTimeout(function () {
      lock = false;
    });
  }

  function scroll() {
    lock = true;
    $(SELECTOR).each(function () {
      $(this).data(KEY).locate();
    });
    setTimeout(function () {
      lock = false;
    });
  };

  function onFullscreenChange() {
    var fullscreen = !!(document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
    $(SELECTOR).each(function () {
      $(this).data(KEY).enableWillChange(!fullscreen);
    });
  }

  function mutationUpdate(records) {
    if (!lock) {
      refresh();
    }
  }

  var PublicMethods = ['destroy', 'refresh'];
  $.fn.stickit = function (method, options) {
    // init
    if (typeof(method) == 'string') {
      if ($.inArray(method, PublicMethods) != -1) {
        var args = arguments;
        this.each(function () {
          var sticker = $(this).data(KEY);
          if (sticker) {
            sticker[method].apply(sticker, Array.prototype.slice.call(args, 1));
          }
        });
      }
    } else {
      if (!init) {
        init = true;
        resize();
        $(document).ready(function () {
          $(window).bind('resize', resize).bind('scroll', scroll);
          $(document.body).bind(animationend + ' ' + transitionend, scroll);
          $(document).bind(fullscreenchange, onFullscreenChange);
        });

        if (MUTATION) {
          var observer = new MutationObserver(mutationUpdate);
          observer.observe(document, {
            attributes: true,
            childList: true,
            characterData: true,
            subtree: true
          });
        }
      }

      if ($.isArray(method)) {
        options = method;
      } else {
        options = Array.prototype.slice.call(arguments, 0);
      }
      this.each(function () {
        var sticker = new Sticker(this, options);
        $(this).data(KEY, sticker);
        sticker.locate();
      });
    }
    return this;
  };

  $.stickit = {
    refresh: refresh
  };
})(jQuery);
