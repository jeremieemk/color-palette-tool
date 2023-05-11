let img;
let canvas;

function setup() {
	canvas = createCanvas(1, 1); // Create an initial small canvas
	canvas.parent("canvasContainer");
}

function loadInputImage() {
	const inputImage = document.getElementById("inputImage");
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
	const originalPalette = [
		"#0F6DA6",
		"#DB6814",
		"#DD360A",
		"#EAD19B",
		"#FF8D0D",
		"#FDD807",
        "#000",
        "#fff"
	];
	let palette = [];

	// Expand the original palette
	for (let i = 0; i < originalPalette.length - 1; i++) {
		let color1 = color(originalPalette[i]);
		let color2 = color(originalPalette[i + 1]);

		palette.push(color1);

		// Generate and push two intermediary colors
		for (let j = 1; j <= 2; j++) {
			let interpolatedColor = lerpColor(color1, color2, j / 3);
			palette.push(interpolatedColor);
		}
	}

	palette.push(color(originalPalette[originalPalette.length - 1]));

	img.loadPixels();
    img = adjustContrast(img, 100);

	for (let i = 0; i < img.pixels.length; i += 4) {
		const r = img.pixels[i];
		const g = img.pixels[i + 1];
		const b = img.pixels[i + 2];

		let minDist = Infinity;
		let closestColor;

		palette.forEach((color) => {
			const paletteColor = [red(color), green(color), blue(color)];
			const dist = colorDistance(r, g, b, ...paletteColor);
			if (dist < minDist) {
				minDist = dist;
				closestColor = color;
			}
		});

		img.pixels[i] = red(closestColor);
		img.pixels[i + 1] = green(closestColor);
		img.pixels[i + 2] = blue(closestColor);
	}

	img.updatePixels();
	image(img, 0, 0);
}

function colorFromString(color) {
	return [
		unhex(color.slice(1, 3)),
		unhex(color.slice(3, 5)),
		unhex(color.slice(5, 7)),
	];
}

function colorDistance(r1, g1, b1, r2, g2, b2) {
	return (r2 - r1) ** 2 + (g2 - g1) ** 2 + (b2 - b1) ** 2;
}


function adjustContrast(img, contrast) {
    let d = contrast / 100.0;
    let avg = 0;
    img.loadPixels();
  
    for (let i = 0; i < img.pixels.length; i += 4) {
      let r = img.pixels[i];
      let g = img.pixels[i + 1];
      let b = img.pixels[i + 2];
      avg += (r + g + b) / 3;
    }
  
    avg /= (img.pixels.length / 4);
  
    for (let i = 0; i < img.pixels.length; i += 4) {
      img.pixels[i] += d * (img.pixels[i] - avg);
      img.pixels[i + 1] += d * (img.pixels[i + 1] - avg);
      img.pixels[i + 2] += d * (img.pixels[i + 2] - avg);
    }
  
    img.updatePixels();
    return img;
  }