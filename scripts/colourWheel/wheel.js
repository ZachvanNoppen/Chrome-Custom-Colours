/*
Code Modified by Zachary van Noppen
from the blog post by Cory Forsyth found here:
https://medium.com/@bantic/hand-coding-a-color-wheel-with-canvas-78256c9d7d43

TODO:
Store the array of colours so it doesn't have to recreate the circle every time, only redraw it
*/
let circle = {
  RADIUS: null, //default 70
  MARKER_SIZE: 5,
  DRAG: false,
  DIMENSIONS: {
    width: null, //will be set to 2*RADIUS by default
    height: null
  },
  CUR_COLOUR:{
    r:0,
    g:0,
    b:0,
    a:1,
  },
  ENABLE_SLIDERS: null, ///Disabled Sliders by default
  SLIDER_ID: {
    r: "rRange",
    rLabel: "redVal",
    g:"gRange",
    gLabel: "greenVal",
    b:"bRange",
    bLabel: "blueVal",
    a:"aRange",
    aLabel: "alphaVal"
  },
  init: function(radius, sliders= false){
    this.RADIUS = radius;
    this.ENABLE_SLIDERS = sliders;
    let canvas = document.getElementById('canvas');
    this.setDimensions();
    this.setupCanvas(canvas);
    let ctx = canvas.getContext("2d");
    //Drawing circle on screen
    this.drawCircle(ctx, canvas,0,0);
    //Setting up even handlers
    this.events(ctx);
  },
  //By default the canvas fits the circle perfectly
  setDimensions: function(x = this.RADIUS*2, y = this.RADIUS*2){
    this.DIMENSIONS.width = x;
    this.DIMENSIONS.height = y;
  },
  setupCanvas: function(canvas){
    canvas.width = this.DIMENSIONS.width;
    canvas.height = this.DIMENSIONS.height;
  },
  // All event handlers
  events: function(ctx){
    let self = this;
    //Canvas Events
    canvas.addEventListener("mousedown", function(e){
        self.DRAG = true;
    });
    canvas.addEventListener("mousemove", function(e){
      if(self.DRAG){
        self.getMousePosition(canvas, ctx, e);
        self.setColour();
      }
    });
    canvas.addEventListener("mouseup", function(e){
        self.DRAG = false;
    });

    //Slider events
    if(self.ENABLE_SLIDERS){
      document.getElementById(this.SLIDER_ID.r).oninput = function(){
        self.CUR_COLOUR.r = this.value;
        self.setColour();
      }
      document.getElementById(this.SLIDER_ID.g).oninput = function(){
        self.CUR_COLOUR.g = this.value;
        self.setColour();
      }
      document.getElementById(this.SLIDER_ID.b).oninput = function(){
        self.CUR_COLOUR.b = this.value;
        self.setColour();
      }
      document.getElementById(this.SLIDER_ID.a).oninput = function(){
        self.CUR_COLOUR.a = this.value/100;
        self.setColour();
      }
    }

  },
  drawCircle: function(ctx, canvas, posX, posY){
    let image = ctx.createImageData(2*this.RADIUS, 2*this.RADIUS);
    let data = image.data;
    let offsetX = (canvas.width - this.RADIUS*2) / 2;
    let offsetY = (canvas.height - this.RADIUS*2) / 2;

    for (let x = -this.RADIUS; x < this.RADIUS; x++) {
      for (let y = -this.RADIUS; y < this.RADIUS; y++) {

        let [r, phi] = this.xy2polar(x, y);

        if (r > this.RADIUS) {
          // skip all (x,y) coordinates that are outside of the circle
          continue;
        }

        let deg = this.rad2deg(phi);

        // Figure out the starting index of this pixel in the image data array.
        let rowLength = 2*this.RADIUS;
        let adjustedX = x + this.RADIUS; // convert x from [-50, 50] to [0, 100] (the coordinates of the image data array)
        let adjustedY = y + this.RADIUS; // convert y from [-50, 50] to [0, 100] (the coordinates of the image data array)
        let pixelWidth = 4; // each pixel requires 4 slots in the data array
        let index = (adjustedX + (adjustedY * rowLength)) * pixelWidth;

        let hue = deg;
        let saturation = r / this.RADIUS;
        let value = 1.0;

        let [red, green, blue] = this.hsv2rgb(hue, saturation, value);
        let alpha = 255;

        data[index] = red;
        data[index+1] = green;
        data[index+2] = blue;
        data[index+3] = alpha;

        //Setting the current colour
        if(posX == adjustedX+offsetX && posY == adjustedY+offsetY){
            this.CUR_COLOUR.r = red;
            this.CUR_COLOUR.g = green;
            this.CUR_COLOUR.b = blue;
            this.CUR_COLOUR.a = alpha/255;
        }
      }
    }
    ctx.putImageData(image, offsetX, offsetY);
  },
  setColour: function(colour = null){
    //If colour is not null it expects an object in the format {r,g,b,a}
    if(colour == null){
      //if no colour is specified, use the one in the colour picker
      document.getElementById("display").style.background = "rgba("+this.CUR_COLOUR.r+","+this.CUR_COLOUR.g+","+this.CUR_COLOUR.b+","+this.CUR_COLOUR.a+")";
      //Debugging
      //console.log("rgba("+this.CUR_COLOUR.r+","+this.CUR_COLOUR.g+","+this.CUR_COLOUR.b+","+this.CUR_COLOUR.a+")");

      if(this.ENABLE_SLIDERS){
        //update Slider information
        document.getElementById(this.SLIDER_ID.r).value = this.CUR_COLOUR.r;
        document.getElementById(this.SLIDER_ID.g).value = this.CUR_COLOUR.g;
        document.getElementById(this.SLIDER_ID.b).value = this.CUR_COLOUR.b;
        document.getElementById(this.SLIDER_ID.a).value = this.CUR_COLOUR.a*100;
        document.getElementById(this.SLIDER_ID.rLabel).innerHTML = Math.round(this.CUR_COLOUR.r);
        document.getElementById(this.SLIDER_ID.gLabel).innerHTML = Math.round(this.CUR_COLOUR.g);
        document.getElementById(this.SLIDER_ID.bLabel).innerHTML = Math.round(this.CUR_COLOUR.b);
        document.getElementById(this.SLIDER_ID.aLabel).innerHTML = Math.round((this.CUR_COLOUR.a*100));
      }
    }else{
      //the colour is specified
      document.getElementById("display").style.background = "rgba("+colour.r+","+colour.g+","+colour.b+","+colour.a+")";

    }


  },
  xy2polar: function(x,y){
    let r = Math.sqrt(x*x + y*y);
    let phi = Math.atan2(y, x);
    return [r, phi];
  },

  // rad in [-π, π] range
  // return degree in [0, 360] range
  rad2deg: function(rad){
    return ((rad + Math.PI) / (2 * Math.PI)) * 360;
  },

  getMousePosition: function(canvas, ctx, event){
    let rect = canvas.getBoundingClientRect();
    //Get mouse position
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    //Draw a marker at the location of the mouse
    this.drawMarker(canvas,x,y,this.MARKER_SIZE);

    return [x,y];
  },
  drawMarker: function(canvas,x,y,size = 2){
    let ctx = canvas.getContext('2d');
    //Check if the marker is in the bounds of the circle
    let center = [canvas.width / 2, canvas.height / 2];
    //distance in a line from the center of the wheel
    let distance = Math.sqrt(((x-center[0])*(x-center[0]))+((y-center[1])*(y-center[1])));
    if(distance < this.RADIUS){
      //Clear any old information on it and remake the gradient
      ctx.clearRect(0,0,canvas.width, canvas.height);
      this.drawCircle(ctx, canvas,x,y);
      //Draw the marker
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.stroke();
    }
  },
  // hue in range [0, 360]
  // saturation, value in range [0,1]
  // return [r,g,b] each in range [0,255]
  // See: https://en.wikipedia.org/wiki/HSL_and_HSV#From_HSV
  hsv2rgb: function(hue, saturation, value){
    let chroma = value * saturation;
    let hue1 = hue / 60;
    let x = chroma * (1- Math.abs((hue1 % 2) - 1));
    let r1, g1, b1;
    if (hue1 >= 0 && hue1 <= 1) {
      ([r1, g1, b1] = [chroma, x, 0]);
    } else if (hue1 >= 1 && hue1 <= 2) {
      ([r1, g1, b1] = [x, chroma, 0]);
    } else if (hue1 >= 2 && hue1 <= 3) {
      ([r1, g1, b1] = [0, chroma, x]);
    } else if (hue1 >= 3 && hue1 <= 4) {
      ([r1, g1, b1] = [0, x, chroma]);
    } else if (hue1 >= 4 && hue1 <= 5) {
      ([r1, g1, b1] = [x, 0, chroma]);
    } else if (hue1 >= 5 && hue1 <= 6) {
      ([r1, g1, b1] = [chroma, 0, x]);
    }

    let m = value - chroma;
    let [r,g,b] = [r1+m, g1+m, b1+m];

    // Change r,g,b values from [0,1] to [0,255]
    return [255*r,255*g,255*b];
  }
}

//init
circle.init(100,false);
