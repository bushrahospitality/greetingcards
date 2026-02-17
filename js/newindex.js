var text_title ="Overlay text";

var canvas = document.getElementById('imageCanvas');
var ctx = canvas.getContext('2d');
var img = new Image();
img.crossOrigin="anonymous";

window.addEventListener('load', DrawPlaceholder(img,ctx,"#FFFFFF",'111.jpg',1080,2910));



function DrawPlaceholder(photo,canv,clr,sorc,x,y) {
    photo.onload = function() {
        DrawOverlay(photo,canv);
        DrawText(canv,clr);
        DynamicText(canv,photo,clr,x,y)
};
    photo.src =sorc;
  
}
function DrawOverlay(photo,canv) {
canv.drawImage(photo,0,0);
    canv.fillStyle = 'rgba(0, 0, 0, 0)';
    canv.fillRect(0, 0, canvas.width, canvas.height);
}
function DrawText(canv,fillcolor) {
    canv.fillStyle = fillcolor; 
    canv.textBaseline = 'middle';
    canv.font = " 90px 'Tajawal', sans-serif ";
}
function DynamicText(canv,photo,clr,x,y) {
  document.getElementById('name').addEventListener('keyup', function() {
    canv.clearRect(0, 0, canvas.width, canvas.height);
    DrawOverlay(photo,canv);
    DrawText(canv,clr); 
    text_title = this.value;
    canv.fillText(text_title, x, y);
    canv.textAlign = 'center';

  });
}



download_img = function(el) {
  var image = canvas.toDataURL("image/jpg");
  el.href = image;
};



