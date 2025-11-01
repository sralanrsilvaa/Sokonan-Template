var touchStartX = 0;
var touchStartY = 0;

var touchDistX = 0;
var touchDistY = 0;

var endX = 0;
var endY = 0;

var swipeThreshold = 20;

var touchsurface;

$(document).ready(function(){

  touchsurface = document.getElementById('screen');

  //touchstart
  touchsurface.addEventListener('touchstart', function(e){

      var touchobj = e.changedTouches[0]; // reference first touch point (ie: first finger)
      touchStartX = parseInt(touchobj.clientX); // get x position of touch point relative to left edge of browser
      touchStartY = parseInt(touchobj.clientY);
      e.preventDefault();

  }, false);

  //touchmove
  touchsurface.addEventListener('touchmove', function(e){

    var touchobj = e.changedTouches[0] // reference first touch point for this event
    touchDistX = parseInt(touchobj.clientX) - touchStartX;
    touchDistY = parseInt(touchobj.clientY) - touchStartY;
    e.preventDefault();

  }, false);

  //touchend
  touchsurface.addEventListener('touchend', function(e){

    var touchobj = e.changedTouches[0]; // reference first touch point for this event
    endX = parseInt(touchobj.clientX);
    endY = parseInt(touchobj.clientY);
    e.preventDefault();

    var horizontalDirection;
    var verticlaDirection;
    var inputDirection;

    if(touchStartX < endX){horizontalDirection = 'right';} else {horizontalDirection = 'left';}
    if(touchStartY < endY){verticlaDirection = 'down';} else {verticlaDirection = 'up';}

    var absX = abs(touchDistX);
    var absY = abs(touchDistY);

    if(absX > absY){
      if(horizontalDirection == 'left'){inputHandler(37);} else {inputHandler(39);}
    } else {
      if(verticlaDirection == 'up'){inputHandler(38);} else {inputHandler(40);}
    }

  }, false);

  function abs(value)
  {
    return Math.abs(value);
  }

});
