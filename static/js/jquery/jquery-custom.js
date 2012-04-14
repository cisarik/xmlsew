(function($){
"use strict"

// Simple helper function creates a new element from a name, so you don't have to add the brackets etc.
$.new$ = function(name) {
    return $('<'+name+' />')
}

$.log=function(object){
	console.log(object)
}

})(jQuery)
