// Define the size of each grid box
const box = 20;
// Select the canvas element from the DOM
const canvas = document.getElementById("gameCanvas");

// Get the 2D rendering context for the canvas
const ctx = canvas.getContext("2d");

// Define the canvas size (width and height)
const canvasSize = canvas.width;

// Initialize the snake with one segment at the center of the canvas
let snake = [{ x: 200, y: 200 }]; // Initial position of the snake
// Set the initial direction of the snake
let direction = "RIGHT";

// Generate the initial position of the food randomly
let food = {
  x: Math.floor(Math.random() * (canvasSize / box)) * box,
  y: Math.floor(Math.random() * (canvasSize / box)) * box,
};

// Define obstacles as an array of positions
let obstacles = [
  { x: 100, y: 100 },
  { x: 300, y: 100 },
  { x: 100, y: 300 },
  { x: 300, y: 300 },
];

// Initialize the score
let score = 0;



function drawScore() {
  ctx.fillStyle = "white"; // Set the text color
  ctx.font = "20px Arial"; // Set the font size and family
  ctx.fillText(`Score: ${score}`, 10, 20); // Draw the score at the top-left corner
}
function drawObstacles() {
  ctx.fillStyle = "gray"; // Obstacles are gray
  obstacles.forEach((obstacle) => {
    ctx.fillRect(obstacle.x, obstacle.y, box, box);
  });
}
// Function to draw the snake on the canvas
function drawSnake() {
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? "lime" : "green"; // Head is lime, body is green
    ctx.shadowColor = "lime"; // Glow color
    ctx.shadowBlur = 10; // Glow intensity
    ctx.fillRect(segment.x, segment.y, box, box);
    ctx.shadowBlur = 0; // Reset shadow blur for other elements
  });
}
function updateScore() {
  const scoreElement = document.getElementById("score"); // Select the score div
  scoreElement.textContent = `Score: ${score}`; // Update the score text
}

// Function to draw the food on the canvas
function drawFood() {
  // Draw a circular gradient for the food
  const gradient = ctx.createRadialGradient(food.x + box / 2, food.y + box / 2, 2, food.x + box / 2, food.y + box / 2, box / 2);
  gradient.addColorStop(0, "yellow");
  gradient.addColorStop(1, "orange");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(food.x + box / 2, food.y + box / 2, box / 2, 0, Math.PI * 2);
  ctx.fill();
}

// Function to draw obstacles on the canvas
function updateSnake() {
  const head = { ...snake[0] }; // Copy the head

  // Move the head in the current direction
  if (direction === "UP") head.y -= box;
  if (direction === "DOWN") head.y += box;
  if (direction === "LEFT") head.x -= box;
  if (direction === "RIGHT") head.x += box;

  // Wrap the snake's position when it goes through the wall
  if (head.x < 0) head.x = canvasSize - box; // Left wall to right
  if (head.x >= canvasSize) head.x = 0; // Right wall to left
  if (head.y < 0) head.y = canvasSize - box; // Top wall to bottom
  if (head.y >= canvasSize) head.y = 0; // Bottom wall to top

  // Add the new head to the front of the snake
  snake.unshift(head);

  // Check if the snake eats the food
  if (head.x === food.x && head.y === food.y) {
    score += 50; // Add 50 points to the score
    food = {
      x: Math.floor(Math.random() * (canvasSize / box)) * box,
      y: Math.floor(Math.random() * (canvasSize / box)) * box,
    };
  } else {
    snake.pop(); // Remove the tail if no food is eaten
  }
}

// Function to check for collisions
function checkCollision() {
  const head = snake[0];

  // Check wall collisions
  if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
    return true;
  }

  // Check self-collision
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }

  // Check obstacle collisions
  for (let obstacle of obstacles) {
    if (head.x === obstacle.x && head.y === obstacle.y) {
      return true;
    }
  }

  return false;
}

// Event listener for keyboard input to change the snake's direction
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});


function gameOver() {
  ctx.clearRect(0, 0, canvasSize, canvasSize); // Clear the canvas
  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Game Over!", canvasSize / 2, canvasSize / 2 - 20);
  ctx.fillText(`Your Score: ${score}`, canvasSize / 2, canvasSize / 2 + 20);
}

// Main game loop
function gameLoop() {
  if (checkCollision()) {
    gameOver();
    return;
  }

  ctx.clearRect(0, 0, canvasSize, canvasSize); // Clear the canvas
  drawFood(); // Draw the food
  drawObstacles(); // Draw obstacles
  updateSnake(); // Update the snake's position
  drawSnake(); // Draw the snake
  // drawScore(); // Draw the score
  updateScore(); // Update the score
}

// Run the game loop every 100ms
setInterval(gameLoop, 100);