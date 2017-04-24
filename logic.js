'use strict';

var toggleElement = document.getElementsByClassName("nav-toggle")[0];
var navElement = document.getElementsByTagName("nav")[0];
// var currentDesignerElement = document.getElementsByClassName("current-designer")[0];

toggleElement.addEventListener('click', function (event) {
    if (navElement.classList.contains('expanded')) {
        navElement.classList.remove('expanded');
    } else {
        navElement.classList.add('expanded');
    }
});