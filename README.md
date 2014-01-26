# jQuery-stickit
This is a jQuery plugin provides a sticky header, sidebar or else when scrolling.

If you want it works in mobile device when scrolling, you could try [jQuery-mscroll](http://emn178.github.io/jquery-mscroll).

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

#### *className: string (default: `"stick"`)*

Sets the class name to the element when it's stick.

#### *top: number (default: `0`)*

Sets sticky top, eg. it will be stuck at position top 50 if you set 50.

## Example
Code
```JavaScript
$('#sidebar').stickit(); // default StickScope.Parent
$('#header').stickit({scope: StickScope.Parent});
$('#navbar').stickit({scope: StickScope.Document, top: 50});
```

## License
The project is released under the [MIT license](http://www.opensource.org/licenses/MIT).

## Contact
The project's website is located at https://github.com/emn178/jquery-stickit  
Author: emn178@gmail.com
