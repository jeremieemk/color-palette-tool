let img;
let canvas;

function setup() {
  canvas = createCanvas(1, 1); // Create an initial small canvas
  canvas.parent('canvasContainer');
}

function loadInputImage() {
  const inputImage = document.getElementById('inputImage');
  if (inputImage.files && inputImage.files[0]) {
	const reader = new FileReader();
	reader.onload = function (e) {
	  img = loadImage(e.target.result, () => {
		resizeCanvas(img.width, img.height);
		image(img, 0, 0);
		applyColorPalette();
	  });
	};
	reader.readAsDataURL(inputImage.files[0]);
  }
}

function applyColorPalette() {
  const palette = [
	"##FE3326",
	"#FEBB00",
	"#009374",
	"#00802E",
	"#007E83",
	"#00802E",
	"#753B32",
	"#020E21",
	"#fff"
];

  img.loadPixels();

  for (let i = 0; i < img.pixels.length; i += 4) {
	const r = img.pixels[i];
	const g = img.pixels[i + 1];
	const b = img.pixels[i + 2];

	let minDist = Infinity;
	let closestColor;

	palette.forEach(color => {
	  const paletteColor = colorFromString(color);
	  const dist = colorDistance(r, g, b, paletteColor[0], paletteColor[1], paletteColor[2]);
	  if (dist < minDist) {
		minDist = dist;
		closestColor = color;
	  }
	});

	const [newR, newG, newB] = colorFromString(closestColor);
	img.pixels[i] = newR;
	img.pixels[i + 1] = newG;
	img.pixels[i + 2] = newB;
  }

  img.updatePixels();
  image(img, 0, 0);
}

function colorFromString(color) {
  return [unhex(color.slice(1, 3)), unhex(color.slice(3, 5)), unhex(color.slice(5, 7))];
}

function colorDistance(r1, g1, b1, r2, g2, b2) {
  return ((r2 - r1) ** 2 + (g2 - g1) ** 2 + (b2 - b1) ** 2);
}
