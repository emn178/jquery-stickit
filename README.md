# jQuery-stickit
A jQuery plugin provides a sticky header, sidebar or else when scrolling.

## Demo
[Sidebar](https://emn178.github.io/jquery-stickit/samples/sidebar/)  
[Header](https://emn178.github.io/jquery-stickit/samples/header/)  
[Navbar](https://emn178.github.io/jquery-stickit/samples/navbar/)  
[Stack Pages](https://emn178.github.io/jquery-stickit/samples/stack/)  
[Sticky Columns](https://emn178.github.io/jquery-stickit/samples/columns/)

## Download
[Compress](https://raw.github.com/emn178/jquery-stickit/master/build/jquery.stickit.min.js)  
[Uncompress](https://raw.github.com/emn178/jquery-stickit/master/src/jquery.stickit.js)

## Installation
You can also install jquery-stickit by using Bower.
```
bower install jquery-stickit
```

## Usage
```JavaScript
$('#you-want-stick').stickit(options);
```

### Options
#### *scope: StickScope (default: `StickScope.Parent`)*

Sets the element stick in the parent element or entire document.

*`StickScope.Parent`*: Sets the element stick in the parent element.

*`StickScope.Document`*: Sets the element stick in the entire document.

#### *className: string (default: `'stick'`)*

Sets the class name to the element when it's stick.

#### *top: number (default: `0`)*

Sets sticky top, eg. it will be stuck at position top 50 if you set 50.

#### *zIndex: number (default: `100` or z-index of element css)*

Sets z-index. Default is try to get element z-index property from css style. If undefined, default is 100.

#### *extraHeight: number (default: `0`)*

Sets extra height for parent element, it could be used only StickScope.Parent. When the contents of parent has margin or something let the actual height out of container, you could use this options to fix.

#### *screenMinWidth: number (default: `undefined`)*

Sets min width for RWD. This is equal to min-width in media query.

#### *screenMaxWidth: number (default: `undefined`)*

Sets max width for RWD. This is equal to max-width in media query.

#### *overflowScrolling: boolean (default: `true`)*

Sets true to enable scrolling sticky element when its height is higher than the screen.

#### *onStick: function (default: `undefined`)*

Callback event when the element becomes stuck. Or `stickit:stick` event.

#### *onUnstick: function (default: `undefined`)*

Callback event when the element becomes unstuck. Or `stickit:unstick` event.

#### *onEnd: function (default: `undefined`)*

Callback event when the element arrives at the end of container. Or `stickit:end` event.

#### *onUnend: function (default: `undefined`)*

Callback event when the element leaves from the end of container. Or `stickit:unend` event.

### Methods

#### destroy()

Removes the stickit functionality completely. 

#### refresh()

Refresh the position of stickit element manually. 

#### $.stickit.refresh()

Refresh the position of all stickit elements manually. 

## Example
```JavaScript
// use default settings
$('.stickit').stickit();

// or assign settings
$('.stickit').stickit({top: 43});

// callback events
$('.stickit').stickit({
  onStick: function () {
    // do something
  }
});
// equal to
$('.stickit').stickit().bind('stickit:stick', function () {
  // do something
});

// call pre-defined methods
$('.stickit').stickit('destroy');
$('.stickit').stickit('refresh');

// refresh all
$.stickit.refresh();
```

## Responsive
You can set up multiple options with different min-width and max-width.
```JavaScript
$('.stickit').stickit({
  screenMinWidth: 1024    // apply if width >= 1024
}, {
  screenMinWidth: 768,    // apply if width >= 768 && width <= 1023
  screenMaxWidth: 1023,
  top: 10
}, {
  screenMaxWidth: 767,    // apply if width <= 767
  top: 20
});
// array is also fine, equal to
$('.stickit').stickit([{
  screenMinWidth: 1024    // apply if width >= 1024
}, {
  screenMinWidth: 768,    // apply if width >= 768 && width <= 1023
  screenMaxWidth: 1023,
  top: 10
}, {
  screenMaxWidth: 767,    // apply if width <= 767
  top: 20
}]);
```
If multiple settings match, it will merge and overwrite the setting like css. Eg.
```JavaScript
$('.stickit').stickit({
  top: 10,                 // always match
  extraHeight: 10
}, {
  screenMaxWidth: 767,     // apply if width <= 767
  top: 20,
  zIndex: 10
});
// In this case, the settings will be following if width > 767
{
  top: 10,
  extraHeight: 10
}
// the settings will be following if width <= 767
{
  top: 20,
  extraHeight: 10,
  zIndex: 10
}
```

## License
The project is released under the [MIT license](http://www.opensource.org/licenses/MIT).

## Contact
The project's website is located at https://github.com/emn178/jquery-stickit  
Author: Chen, Yi-Cyuan (emn178@gmail.com)
