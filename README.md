# jQuery-stickit
A jQuery plugin provides a sticky header, sidebar or else when scrolling.

If you want it works in mobile device when scrolling, you could try [jQuery-mscroll](https://github.com/emn178/jquery-mscroll).

## Download
[Compress](https://raw.github.com/emn178/jquery-stickit/master/build/jquery.stickit.min.js)  
[Uncompress](https://raw.github.com/emn178/jquery-stickit/master/src/jquery.stickit.js)

## Installation
You can also install jquery-stickit by using Bower.
```
bower install jquery-stickit
```

## Demo
[Sidebar](http://emn178.github.io/jquery-stickit/samples/sidebar/)  
[Header](http://emn178.github.io/jquery-stickit/samples/header/)  
[Navbar](http://emn178.github.io/jquery-stickit/samples/navbar/)

## Browser Support
jQuery-stickit currently supports IE, Chrome, Firefox, Safari and Opera.

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

#### *extraHeight: number (default: `0`)*

Sets extra height for parent element, it could be used only StickScope.Parent. When the contents of parent has margin or something let the actual height out of container, you could use this options to fix.

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
Author: emn178@gmail.com
