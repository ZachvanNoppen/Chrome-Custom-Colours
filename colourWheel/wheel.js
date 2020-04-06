let circle = {
  init: function(){
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext("2d");
    this.drawCircle(ctx);
    this.events(ctx);
  },
  // All event handlers
  events: function(ctx){

    let self = this;
    canvas.addEventListener("mousedown", function(e)
    {
        self.getMousePosition(canvas, ctx, e);
    });
    canvas.addEventListener("drag", function(e)
    {
        self.getMousePosition(canvas, ctx, e);
    });
  },
  drawCircle: function(ctx){
    let radius = 50;
    let image = ctx.createImageData(2*radius, 2*radius);
    let data = image.data;

    for (let x = -radius; x < radius; x++) {
      for (let y = -radius; y < radius; y++) {

        let [r, phi] = this.xy2polar(x, y);

        if (r > radius) {
          // skip all (x,y) coordinates that are outside of the circle
          continue;
        }

        let deg = this.rad2deg(phi);

        // Figure out the starting index of this pixel in the image data array.
        let rowLength = 2*radius;
        let adjustedX = x + radius; // convert x from [-50, 50] to [0, 100] (the coordinates of the image data array)
        let adjustedY = y + radius; // convert y from [-50, 50] to [0, 100] (the coordinates of the image data array)
        let pixelWidth = 4; // each pixel requires 4 slots in the data array
        let index = (adjustedX + (adjustedY * rowLength)) * pixelWidth;

        let hue = deg;
        let saturation = r / radius;
        let value = 1.0;

        let [red, green, blue] = this.hsv2rgb(hue, saturation, value);
        let alpha = 255;

        data[index] = red;
        data[index+1] = green;
        data[index+2] = blue;
        data[index+3] = alpha;
      }
    }

    ctx.putImageData(image, 0, 0);
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
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    console.log("Coordinate x: " + x,"Coordinate y: " + y);

    ctx.clearRect(0,0,rect.left, rect.top);
    this.drawCircle(ctx);


    ctx.beginPath();
    ctx.arc(x, y, 2, 0, 2 * Math.PI);
    ctx.stroke();
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
circle.init();
//loop
//This is just a very simple game loop
