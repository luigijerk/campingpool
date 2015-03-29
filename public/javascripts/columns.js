/*  Adjusts all columns to be the same size as tallest column.
	Load this file, then call function columns on page passing parameters.

	@param label    class name of columns
*/

var columns = function(label) {
	var items = document.getElementsByClassName(label);
  var windowHeight = window.innerHeight + 'px';
	var height = 0;
	for (var i = 0; i < items.length; i++) {
    items[i].style.minHeight = windowHeight;
		if (items[i].offsetHeight > height) {
			height = items[i].offsetHeight;
		}
	}
	for (var j = 0; j < items.length; j++) {
		items[j].style.height = height + "px";
	}
};