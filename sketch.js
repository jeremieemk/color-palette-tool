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
  const palette = ['#4a2c2c', '#d3504a', '#ffdc76', '#fefea4'];

  // Convert the image to an array of pixels
  const pixels = [];
  img.loadPixels();
  for (let i = 0; i < img.pixels.length; i += 4) {
    const r = img.pixels[i];
    const g = img.pixels[i + 1];
    const b = img.pixels[i + 2];
    pixels.push([r, g, b]);
  }

  // Perform k-means clustering
  const clusters = skmeans(pixels, palette.length);

  // Find the closest color in the predefined palette for each cluster centroid
  const closestPaletteColors = clusters.centroids.map((centroid) => {
    let minDist = Infinity;
    let closestColor;

    palette.forEach((color) => {
      const paletteColor = colorFromString(color);
      const dist = colorDistance(
        centroid[0],
        centroid[1],
        centroid[2],
        paletteColor[0],
        paletteColor[1],
        paletteColor[2]
      );
      if (dist < minDist) {
        minDist = dist;
        closestColor = color;
      }
    });

    return closestColor;
  });

  // Replace each pixel with the closest color from the predefined palette
  for (let i = 0, j = 0; i < img.pixels.length; i += 4, j++) {
    const closestColor = closestPaletteColors[clusters.idxs[j]];
    const [newR, newG, newB] = colorFromString(closestColor);

    img.pixels[i] = newR;
    img.pixels[i + 1] = newG;
    img.pixels[i + 2] = newB;
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
