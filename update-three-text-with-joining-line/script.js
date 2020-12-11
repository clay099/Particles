const canvas = document.querySelector("#canvas1");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particleArray = [];
// start values for x & y drawing
let adjustX = 5;
let adjustY = 20;

//handle mouse
const mouse = {
	x: null,
	y: null,
	radius: 100,
};

//update mouse location
window.addEventListener("mousemove", function (e) {
	mouse.x = e.x;
	mouse.y = e.y;
});

//create text to be displayed as particles.
//not this is not shown on display
ctx.fillStyle = "white";
ctx.font = "20px Verdana";
ctx.fillText("Clayton Whittaker", 0, 30);
//collect text Coordinates
const textCoordinates = ctx.getImageData(0, 0, 180, 40);

class Particle {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.size = 3;
		//hold initial position of particle
		this.baseX = this.x;
		this.baseY = this.y;
		//changes the movement speed
		this.density = Math.random() * 20 + 1;
	}

	draw() {
		ctx.fillStyle = "white";
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
		ctx.closePath();
		ctx.fill();
	}
	update() {
		let dx = mouse.x - this.x;
		let dy = mouse.y - this.y;
		let distance = Math.sqrt(dx * dx + dy * dy);
		let forceDirectionX = dx / distance;
		let forceDirectionY = dy / distance;
		let maxDistance = mouse.radius;
		let force = (maxDistance - distance) / maxDistance;
		let directionX = forceDirectionX * force * this.density;
		let directionY = forceDirectionY * force * this.density;
		//check if particle is close to mouse
		if (distance < mouse.radius) {
			//if close move particle away from mouse
			this.x -= directionX;
			this.y -= directionY;
		} else {
			//if mouse is not longer close move particle back to original position
			if (this.x !== this.baseX) {
				let dx = this.x - this.baseX;
				this.x -= dx / 10;
			}
			if (this.y !== this.baseY) {
				let dy = this.y - this.baseY;
				this.y -= dy / 10;
			}
		}
	}
}

function init() {
	particleArray = [];
	let y2 = textCoordinates.height;
	let x2 = textCoordinates.width;
	for (let y = 0; y < y2; y++) {
		for (let x = 0; x < x2; x++) {
			//number 128 or greater means 50% opacity (or alpha) as possbile range for alpha is clamped between 0 and 255
			if (
				textCoordinates.data[
					y * 4 * textCoordinates.width + x * 4 + 3
				] > 128
			) {
				let positionX = x + adjustX;
				let positionY = y + adjustY;
				particleArray.push(
					// note by multiplying by 10 you blow up the text by 10 times
					new Particle(positionX * 10, positionY * 10)
				);
			}
		}
	}
}

init();
console.log(particleArray);

function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (let particle of particleArray) {
		particle.draw();
		particle.update();
	}
	connect();
	requestAnimationFrame(animate);
}

animate();

//connect lines to particles
function connect() {
	let opacityValue = 1;
	for (let a = 0; a < particleArray.length; a++) {
		for (let b = a; b < particleArray.length; b++) {
			let dx = particleArray[a].x - particleArray[b].x;
			let dy = particleArray[a].y - particleArray[b].y;
			let distance = Math.sqrt(dx * dx + dy * dy);
			opacityValue = 1 - distance / 50;

			if (distance < 20) {
				ctx.strokeStyle = `rgba(255,255,255,${opacityValue})`;
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.moveTo(particleArray[a].x, particleArray[a].y);
				ctx.lineTo(particleArray[b].x, particleArray[b].y);
				ctx.stroke();
			}
		}
	}
}
