/* 
 * Full example here: http://jsfiddle.net/jboesch26/3SKsL/1/
 */

$.fn.outerHTML = function(){
    
    // IE, Chrome & Safari will comply with the non-standard outerHTML, all others (FF) will have a fall-back for cloning
    return (!this.length) ? this : (this[0].outerHTML || (
      function(el){
          var div = document.createElement('div');
          div.appendChild(el.cloneNode(true));
          var contents = div.innerHTML;
          div = null;
          return contents;
    })(this[0]));

}

//console.log('native outerHTML: ' + $('#colors')[0].outerHTML());
//console.log('jQuery cross-browser outerHTML: '+ $('#colors').outerHTML());
