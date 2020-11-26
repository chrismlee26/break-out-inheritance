class Game {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');

    this.ballRadius = 10;
    this.paddleHeight = 10;
    this.paddleWidth = 75;
    this.brickRowCount = 3;
    this.brickColumnCount = 5;
    this.brickWidth = 75;
    this.brickHeight = 20;
    this.brickPadding = 10;
    this.brickOffsetTop = 30;
    this.brickOffsetLeft = 30;
    this.paddleXStart = (this.canvas.width - this.paddleWidth) / 2;
    this.paddleYStart = this.canvas.height - this.paddleHeight;
    this.objectColor = '#0095DD';
    this.youWin = 'YOU WIN, CONGRATULATIONS!';
    this.gameOver = 'GAME OVER';

    this.ball = new Ball(0, 0, 2, -2, this.ballRadius, this.objectColor);
    this.paddle = new Sprite(this.paddleXStart, this.paddleYStart, this.paddleWidth, this.paddleHeight, this.objectColor);

    this.bricks = new Bricks({
      cols: this.brickColumnCount,
      rows: this.brickRowCount,
      width: this.brickWidth,
      height: this.brickHeight,
      padding: this.brickPadding,
      offsetLeft: this.brickOffsetLeft,
      offsetTop: this.brickOffsetTop,
      color: this.objectColor,
    });

    this.scoreLabel = new GameLabel('Score: ', 8, 20, this.objectColor);
    this.livesLabel = new GameLabel('Lives: ', this.canvas.width - 65, 20);

    this.rightPressed = false;
    this.leftPressed = false;

    this.setup();

    this.draw();
  }

  setup() {
    this.livesLabel.value = 3;
    this.resetBallAndPaddle();
    document.addEventListener('keydown', (e) => {
      this.keyDownHandler(e);
    }, false);
    document.addEventListener('keyup', (e) => {
      this.keyUpHandler(e);
    }, false);
    document.addEventListener('mousemove', (e) => {
      this.mouseMoveHandler(e);
    }, false);
  }

  resetBallAndPaddle() {
    this.ball.x = this.canvas.width / 2;
    this.ball.y = this.canvas.height - 30;
    this.ball.dx = 2;
    this.ball.dy = -2;
    this.paddle.x = this.paddleXStart;
  }

  collisionDetection() {
    for (let c = 0; c < this.bricks.cols; c += 1) {
      for (let r = 0; r < this.bricks.rows; r += 1) {
        const brick = this.bricks.bricks[c][r];
        if (brick.status === 1) {
          if (this.ball.x > brick.x
            && this.ball.x < brick.x + this.brickWidth
            && this.ball.y > brick.y && this.ball.y < brick.y + this.brickHeight) {
            this.ball.dy = -this.ball.dy;
            brick.status = 0;
            this.scoreLabel.value += 1;
            if (this.scoreLabel.value === this.bricks.cols * this.bricks.rows) {
              alert(this.youWin);
              document.location.reload();
            }
          }
        }
      }
    }
  } // End Collision Detection ----------------------------------

  movePaddle() {
    if (this.rightPressed && this.paddle.x < this.canvas.width - this.paddle.width) {
      this.paddle.moveBy(7, 0);
    } else if (this.leftPressed && this.paddle.x > 0) {
      this.paddle.moveBy(-7, 0);
    }
  }

  collisionsWithCanvasAndPaddle() {
    // Bounce the ball off the left and right of the canvas
    if (this.ball.x + this.ball.dx > this.canvas.width - this.ball.radius
      || this.ball.x + this.ball.dx < this.ball.radius) {
      this.ball.dx = -this.ball.dx;
    }
    // Bounce the ball off the top, paddle, or hit the bottom of the canvas
    if (this.ball.y + this.ball.dy < this.ball.radius) {
    // hit the top
      this.ball.dy = -this.ball.dy;
    } else if (this.ball.y + this.ball.dy > this.canvas.height - this.ball.radius) {
    // hit the bottom
      if (this.ball.x > this.paddle.x && this.ball.x < this.paddle.x + this.paddle.width) {
      // Hit the paddle
        this.ball.dy = -this.ball.dy;
      } else {
      // Lose a life
        this.livesLabel.value -= 1;
        if (this.livesLabel.value < 1) {
        // Game Over
          alert(this.gameOver);
          this.ball.x = 200;
          this.ball.y = 200;
          document.location.reload();
        } else {
          // Start the over you hit the bottom
          // ** Set the position of ball and paddle
          // ** And set the speed and direction of the ball
          this.resetBallAndPaddle();
        }
      }
    }
  } // Collisions Ends ------------------------------------------

  keyDownHandler(e) {
    if (e.keyCode === 39) {
      this.rightPressed = true;
    } else if (e.keyCode === 37) {
      this.leftPressed = true;
    }
  }

  keyUpHandler(e) {
    if (e.keyCode === 39) {
      this.rightPressed = false;
    } else if (e.keyCode === 37) {
      this.leftPressed = false;
    }
  }

  mouseMoveHandler(e) {
    const relativeX = e.clientX - this.canvas.offsetLeft;
    if (this.relativeX > 0 && this.relativeX < this.canvas.width) {
      this.paddle.moveTo(relativeX - this.paddle.width / 2, this.paddleYStart);
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.bricks.render(this.ctx);
    this.ball.render(this.ctx);
    this.paddle.render(this.ctx);
    this.scoreLabel.render(this.ctx);
    this.livesLabel.render(this.ctx);
    this.collisionDetection();
    this.ball.move();
    this.movePaddle();
    this.collisionsWithCanvasAndPaddle();

    // Draw the screen again
    requestAnimationFrame(() => {
      this.draw();
    });
  }
} // Game Class Ends --------------------------------------------
