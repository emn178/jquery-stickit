# jQuery-stickit
A jQuery plugin provides a sticky header, sidebar or else when scrolling.

## Demo
[Sidebar](https://emn178.github.io/jquery-stickit/samples/sidebar/)  
[Header](https://emn178.github.io/jquery-stickit/samples/header/)  
[Navbar](https://emn178.github.io/jquery-stickit/samples/navbar/)

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

### Methods

#### destroy()

Removes the stickit functionality completely. 

## Example
Code
```JavaScript
$('.stickit').stickit({
  // Sets the element stick in the parent element or entire document.
  scope: StickScope.Parent,

  // Sets the class name to the element when it's stick.
  className: 'stick',

  // Sets sticky top, eg. it will be stuck at position top 50 if you set 50.
  top: 0,

  // Sets extra height for parent element, it could be used only StickScope.Parent. When the contents of parent has margin or something let the actual height out of container, you could use this options to fix.
  extraHeight: 0
});

$('.stickit').stickit('destroy');
```

## License
The project is released under the [MIT license](http://www.opensource.org/licenses/MIT).

## Contact
The project's website is located at https://github.com/emn178/jquery-stickit  
Author: Yi-Cyuan Chen (emn178@gmail.com)
