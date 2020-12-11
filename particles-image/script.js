const canvas = document.querySelector("#canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];

let mouse = {
	x: null,
	y: null,
	radius: 100,
};

window.addEventListener("mousemove", (event) => {
	mouse.x = event.x + canvas.clientLeft / 2;
	mouse.y = event.y + canvas.clientTop / 2;
});

function drawImage() {
	//get image data
	let imageWidth = png.width;
	let imageHeight = png.height;
	const data = ctx.getImageData(0, 0, imageWidth, imageHeight);

	// we don't need the image anymore so clear it from canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	class Particle {
		constructor(x, y, color, size = 2) {
			// center image in middle of canvas
			this.x = x + canvas.width / 2 - png.width * 2;
			this.y = y + canvas.height / 2 - png.height * 2;
			this.color = color;
			this.size = size;
			//hold initial position of particle
			this.baseX = this.x;
			this.baseY = this.y;
			//changes the movement speed
			this.density = Math.random() * 10 + 2;
		}

		draw() {
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
			ctx.closePath();
			ctx.fill();
		}

		update() {
			ctx.fillStyle = this.color;

			//collision detection
			let dx = mouse.x - this.x;
			let dy = mouse.y - this.y;
			let distance = Math.sqrt(dx * dx + dy * dy);

			let forceDirectionX = dx / distance;
			let forceDirectionY = dy / distance;

			//max distance, past that the force will be 0
			let maxDistance = mouse.radius;
			let force = (maxDistance - distance) / maxDistance;
			if (force < 0) force = 0;

			let directionX = forceDirectionX * force * this.density * 0.6;
			let directionY = forceDirectionY * force * this.density * 0.6;

			//check if particle is close to mouse
			if (distance < mouse.radius + this.size) {
				//if close move particle away from mouse
				this.x -= directionX;
				this.y -= directionY;
			} else {
				//if mouse is not longer close move particle back to original position
				if (this.x !== this.baseX) {
					let dx = this.x - this.baseX;
					this.x -= dx / 20;
				}
				if (this.y !== this.baseY) {
					let dy = this.y - this.baseY;
					this.y -= dy / 20;
				}
			}
			this.draw();
		}
	}
	function init() {
		particleArray = [];
		let y2 = data.height;
		let x2 = data.width;
		for (let y = 0; y < y2; y++) {
			for (let x = 0; x < x2; x++) {
				//number 128 or greater means 50% opacity (or alpha) as possbile range for alpha is clamped between 0 and 255
				if (data.data[y * 4 * data.width + x * 4 + 3] > 128) {
					let positionX = x;
					let positionY = y;
					let color = `rgb(${
						data.data[y * 4 * data.width + x * 4]
					}, ${data.data[y * 4 * data.width + x * 4 + 1]}, ${
						data.data[y * 4 * data.width + x * 4 + 2]
					})`;
					particleArray.push(
						// note by multiplying by 4 you blow up the image by 4 times
						new Particle(positionX * 6, positionY * 6, color)
					);
				}
			}
		}
	}
	function animate() {
		requestAnimationFrame(animate);

		//draw black canvas over and over with alpha to let trail slowly disappear
		ctx.fillStyle = "rgba(0,0,0,0.05)";
		ctx.fillRect(0, 0, innerWidth, innerHeight);

		for (let particle of particleArray) {
			particle.update();
		}
	}

	init();
	animate();

	window.addEventListener("resize", () => {
		canvas.width = innerWidth;
		canvas.height = innerHeight;
		init();
	});
}

const png = new Image();
png.src = `data:image/png;base64,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`;

window.addEventListener("load", (event) => {
	ctx.drawImage(png, 0, 0);
	drawImage();
});
