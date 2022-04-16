const scale = 5;
let image0 = document.getElementById("img");
//let url = 'https://loremflickr.com/g/640/360/dog';
//image0.src = url + '?' + new Date().getTime();
//image0.setAttribute('crossOrigin', '');

let image = new Image();
image.crossOrigin = "Anonymous";
image.onload = function () {
    recolorImage(image, 255, 0, 0, 0, 255, 0);
}
//image.src = image0.src;

function calcLuminance(rgb)
 {
	let r = (rgb & 0xff0000) >> 16;
	let g = (rgb & 0xff00) >> 8;
	let b = (rgb & 0xff);

	return (r*0.299 + g*0.587 + b*0.114) / 256;
 }
 
let rgbToHex = function (rgb) { 
  let hex = Number(rgb).toString(16);
  if (hex.length < 2) {
       hex = "0" + hex;
  }
  return hex;
};

let fullColorHex = function(r,g,b) {   
  var red = rgbToHex(r);
  var green = rgbToHex(g);
  var blue = rgbToHex(b);
  return red+green+blue;
};

function recolorImage(img, oldRed, oldGreen, oldBlue, newRed, newGreen, newBlue) {
    let c = document.getElementById("canvasBottom");
 
    let w = img.width;
    let h = img.height;

    c.width = w;
    c.height = h;
   let ctx = c.getContext("2d");
    // draw the image on the temporary canvas
    ctx.drawImage(img, 0, 0, w*scale, h*scale);

    // pull the entire image into an array of pixel data
    let imageData = ctx.getImageData(0, 0, w, h);
	let dark = 0;
	let clear = 0;
    // examine every pixel, 
    // change any old rgb to the new-rgb
    for (let i = 0; i < imageData.data.length; i += 4) {
        // is this pixel the old rgb?
        if (imageData.data[i] == oldRed && imageData.data[i + 1] == oldGreen && imageData.data[i + 2] == oldBlue) {
            // change to your new rgb
            imageData.data[i] = newRed;
            imageData.data[i + 1] = newGreen;
            imageData.data[i + 2] = newBlue;
        }
        let hexa = fullColorHex(imageData.data[i], imageData.data[i+1], imageData.data[i+2]);
        let lum = calcLuminance(hexa);

        if(lum>0.3){
		  imageData.data[i] = 255;
		  imageData.data[i + 1] = 0;
		  imageData.data[i + 2] = 0;
          dark++;
        }
        else
          clear++;
        fullColorHex(imageData.data[i], imageData.data[i+1], imageData.data[i+2])
    }
   
    ctx.putImageData(imageData, 0, 0);
    console.log('dark:' + dark);
    console.log('clear:' + clear);
}

let cnv = document.getElementById("canvasTop");
let ctx = cnv.getContext("2d");
let size = 25;
let isDrawing = false;

cnv.addEventListener('mousedown', e => {
  isDrawing = true;
  drawHelper(e)
});

window.addEventListener('mouseup', e => {
  if (isDrawing === true) {
    isDrawing = false;
  }
});

cnv.addEventListener('mousemove', e => {
	if (isDrawing === true) {
		e.preventDefault();
		e.stopPropagation();
		drawHelper(e)
	}
});

function drawHelper(e){
	ctx.clearRect(0, 0, cnv.width, cnv.height);
    let posX = cnv.getBoundingClientRect().left; 
    let posY = cnv.getBoundingClientRect().top;

    let mouseX = parseInt(e.clientX - posX);
    let mouseY = parseInt(e.clientY - posY);
    let newX = parseInt(mouseX/size)*size;
    let newY = parseInt(mouseY/size)*size;

    ctx.fillStyle = "rgb(200,0,0)";
    ctx.strokeRect(newX, newY, size, size);
}

// Upload file

var btn = document.getElementById("photo-button");
//var img = document.getElementById("photo-image");
var setImg = document.getElementById("select-image");
btn.addEventListener("change", setImage);
setImg.addEventListener("click", setImage2);

var _URL = window.URL || window.webkitURL;

function setImage(e) {
  if (this.files && this.files[0]) {
    var file = this.files[0];
    var img = safeImage(file);
    if (img) {
      var reader = new Image();
      reader.onload = loadImage;
      reader.src = _URL.createObjectURL(this.files[0]); //this.files[0]);
    } else {
      alert("Not an accepted file type");
    }
  }
}

function safeImage(file) {
  var acceptedTypes = ["image/jpg", "image/jpeg", "image/png", "image/gif"];
  for (var i = 0; i < acceptedTypes.length; i++) {
    if (file.type === acceptedTypes[i]) {
      return true;
    }
  }
  return false;
}

function setImage2() {
  btn.click();
}

function loadImage(e) {
  //image0.setAttribute("src", this.src);
  //image0.width = this.width * scale;
  //image0.height = this.height * scale;
  
  recolorImage(this, 255, 0, 0, 0, 255, 0);
}


// Dialog

const modal = document.querySelector('dialog');

function showDialog(){
  const closeButton = document.getElementById('close');

  // close modal on backdrop click
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.close('cancelled');
    }
  });
  
  // makes modal appear (adds `open` attribute)
  if(modal.showModal){
    modal.showModal();
    modal.addEventListener('close', function onClose() {
      //outputBox.value = modal.returnValue;
    });
  } else {
  // polyfil
    modal.returnValue = 'false';
    modal.setAttribute('open', 'open');
    const closeButton = document.getElementById('close');
    if(closeButton){
      closeButton.addEventListener('click', function onClose() {
        modal.returnValue = 'false';
        //outputBox.value = modal.returnValue;
        modal.removeAttribute('open');
      });
    }
    const okButton = document.getElementById('ok');
    if(okButton){
      okButton.addEventListener('click', function onConfirm() {
        modal.returnValue = 'true';
        //outputBox.value = modal.returnValue;
        modal.removeAttribute('open');
      });
    }
  }

  setTimeout(function(){
	  // hides modal (removes `open` attribute)
    if(modal.close){
	    modal.close('false');
    } else {
      modal.removeAttribute('open');
    }
	  console.log(modal.returnValue); // logs `Accepted`
  },
  60000);
}

const showDialogButton = document.getElementById('select-imag');
if(showDialogButton){
  showDialogButton.addEventListener('click', function onClose() {
    showDialog();
  });
}

