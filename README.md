# jQuery-jSticker
This is a jQuery plugin provides a sticky header, sidebar or else when scrolling.

## Demo
[Sidebar](http://emn178.github.io/jquery-jsticker/demo/sidebar/)  
[Header](http://emn178.github.io/jquery-jsticker/demo/header/)  
[Navbar](http://emn178.github.io/jquery-jsticker/demo/navbar/)

## Browser Support
jQuery-jSticker currently supports IE8+, Chrome, Firefox, Safari and Opera.

## Usage
```JavaScript
$('#you-want-stick').stick(options);
```

### Options
#### *scope: StickScope (default: `StickScope.Parent`)*

Sets the element stick in the parent element or entire document.

*`StickScope.Parent`*: Sets the element stick in the parent element.

*`StickScope.Document`*: Sets the element stick in the entire document.

## Example
Code
```JavaScript
$('#sidebar').stick(); // default StickScope.Parent
$('#header').stick({scope: StickScope.Parent});
$('#navbar').stick({scope: StickScope.Document});
```

## License
The project is released under the [MIT license](http://www.opensource.org/licenses/MIT).

## Contact
The project's website is located at https://github.com/emn178/jquery-jsticker  
Author: emn178@gmail.com