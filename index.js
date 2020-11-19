/* ***************************************************************

Challenge 1 - Make Constants

Challenge 2 - Identify duplicate code
** This block of code is repeated better to make a function for this.

Challenge 3 - Use Subroutines
*** This block of code would be better as a function.

Challenge 4 - Encapsulating code
**** Use objects to encapsulate code

***************************************************************** */

// **************************************************************
// DOM references
// **************************************************************

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// **************************************************************
// Variables
// **************************************************************

// --------------------------------------------------------------
// Constants
// --------------------------------------------------------------

const ballRadius = 10;
const paddleHeight = 10;
const paddleWidth = 75;
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
const mathPi = (Math.PI * 2);
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const youWin = 'YOU WIN, CONGRATULATIONS!';
const gameOver = ('GAME OVER');

ctx.fillStyle = '#0095DD';
ctx.font = '16px Arial';

// --------------------------------------------------------------
// Variables
// --------------------------------------------------------------

// ** Initialize the position of the ball and paddle
// ** and set the ball speed and direction
// **** A Ball Object would be good.
let x = canvasWidth / 2;
let y = canvasHeight - 30;
// * This calculation could be better as a value
let paddleX = (canvasWidth - paddleWidth) / 2;
let dx = 2;
let dy = -2;

let score = 0;
let lives = 3;

let rightPressed = false;
let leftPressed = false;

// --------------------------------------------------------------
// Setup Bricks Array
// --------------------------------------------------------------

const bricks = [];

// *** This would be better in a function
for (let c = 0; c < brickColumnCount; c += 1) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r += 1) {
    bricks[c][r] = {
      x: 0,
      y: 0,
      status: 1,
    };
  }
}

// **************************************************************
// Functions
// **************************************************************

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, mathPi);
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvasHeight - paddleHeight, paddleWidth, paddleHeight);
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c += 1) {
    for (let r = 0; r < brickRowCount; r += 1) {
      if (bricks[c][r].status === 1) {
      // **** This block should really be part of the brick initialization
        const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
        const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c += 1) {
    for (let r = 0; r < brickRowCount; r += 1) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
          score += 1;
          if (score === brickRowCount * brickColumnCount) {
          // eslint-disable-next-line no-alert
            alert(youWin);
            document.location.reload();
          }
        }
      }
    }
  }
}

function drawScore() {
  ctx.fillText(`Score: ${score}`, 8, 20);
}

function drawLives() {
  ctx.fillText(`Lives: ${lives}`, canvasWidth - 65, 20);
}

// --------------------------------------------------------------
// Game Loop
// --------------------------------------------------------------

function draw() {
// Clear the canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  // Call helper functions
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();

  // Bounce the ball off the left and right of the canvas
  if (x + dx > canvasWidth - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }

  // Bounce the ball off the top, paddle, or hit the bottom of the canvas
  if (y + dy < ballRadius) {
  // hit the top
    dy = -dy;
  } else if (y + dy > canvasHeight - ballRadius) {
  // hit the bottom
    if (x > paddleX && x < paddleX + paddleWidth) {
    // Hit the paddle
      dy = -dy;
    } else {
    // Lose a life
      lives -= 1;
      if (!lives) {
      // Game Over
      // eslint-disable-next-line no-alert
        alert(gameOver);
        x = 200;
        y = 200;
        document.location.reload();
      } else {
        // Start the over you hit the bottom
        // ** Set the position of ball and paddle
        // ** And set the speed and direction of the ball
        x = canvasWidth / 2;
        y = canvasHeight - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvasWidth - paddleWidth) / 2;
      }
    }
  }

  // Move Ball
  // *** Better as a separate function
  x += dx;
  y += dy;

  // Check for arrow keys
  // *** Better as a function
  if (rightPressed && paddleX < canvasWidth - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  // Draw the screen again
  requestAnimationFrame(draw);
}

// --------------------------------------------------------------
// Event Listeners
// --------------------------------------------------------------

function keyDownHandler(e) {
  if (e.keyCode === 39) {
    rightPressed = true;
  } else if (e.keyCode === 37) {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode === 39) {
    rightPressed = false;
  } else if (e.keyCode === 37) {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvasWidth) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

// **************************************************************
// Register Events
// **************************************************************

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);

// **************************************************************
// Starts program entry point
// **************************************************************

draw();
