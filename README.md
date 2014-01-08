# jQuery-stickit
This is a jQuery plugin provides a sticky header, sidebar or else when scrolling.

## Demo
[Sidebar](http://emn178.github.io/jquery-stickit/demo/sidebar/)  
[Header](http://emn178.github.io/jquery-stickit/demo/header/)  
[Navbar](http://emn178.github.io/jquery-stickit/demo/navbar/)

## Browser Support
jQuery-stickit currently supports IE8+, Chrome, Firefox, Safari and Opera.

## Usage
```JavaScript
$('#you-want-stick').stickit(options);
```

### Options
#### *scope: StickScope (default: `StickScope.Parent`)*

Sets the element stick in the parent element or entire document.

*`StickScope.Parent`*: Sets the element stick in the parent element.

*`StickScope.Document`*: Sets the element stick in the entire document.

## Example
Code
```JavaScript
$('#sidebar').stickit(); // default StickScope.Parent
$('#header').stickit({scope: StickScope.Parent});
$('#navbar').stickit({scope: StickScope.Document});
```

## License
The project is released under the [MIT license](http://www.opensource.org/licenses/MIT).

## Contact
The project's website is located at https://github.com/emn178/jquery-stickit  
Author: emn178@gmail.com
