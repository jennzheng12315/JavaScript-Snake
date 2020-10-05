// Name any p5.js functions we use in the global so Glitch can recognize them.
/* global
 *    createCanvas, background
 *    colorMode, HSB
 *    frameRate,
 *    width, height,
 *    rect, text, textSize,
 *    stroke, noStroke, noFill, fill, random,
 *    keyCode, UP_ARROW, LEFT_ARROW, RIGHT_ARROW, DOWN_ARROW, ENTER,
 *    collideRectRect,
 */

let backgroundColor, playerSnake, currentApple, score, fRate, lives;
let gameIsOver;

function setup() {
  // Canvas & color settings
  createCanvas(400, 400);
  colorMode(HSB, 360, 100, 100);
  backgroundColor = 0;
  
  fRate = 12;
  playerSnake = new Snake();
  currentApple = new Apple();
  score = 0;
  lives = 5;
  gameIsOver = false;
}

function draw() {
  background(backgroundColor);
  frameRate(fRate);
  
  // The snake performs the following four methods:
  if (!gameIsOver) {
    playerSnake.moveSelf();
    playerSnake.showSelf();
    playerSnake.checkCollisions();
    playerSnake.checkApples();
  }
  
  currentApple.showSelf();
  
  // We put the score in its own function for readability.
  displayScore();
  checkLives();
  if (gameIsOver) {
    gameOver();
  }
  
}

function displayScore() {
  fill("white");
  text(`Score: ${score}`, 10, 20);
  text(`Lives: ${lives}`, 10, 40);
}

class Snake {
  constructor() {
    this.size = 10;
    this.x = width / 2;
    this.y = height - 10;
    this.direction = "N";
    this.speed = 12;
    this.tail = []; // Array of TailSegment
  }

  moveSelf() {
    if (!gameIsOver) {
      if (this.tail.length > 0) {
        // Before moving the head, update the tail segments.
        // Take the segment at the back of the tail off.
        this.tail.pop();

        // Add a new segment at the front, which is where the
        // head (this.x, this.y) is now.
        let frontSegment = new TailSegment(this.x, this.y);
        this.tail.unshift(frontSegment);
      }

      if (this.direction === "N") {
        this.y -= this.speed;
      } else if (this.direction === "S") {
        this.y += this.speed;
      } else if (this.direction === "E") {
        this.x += this.speed;
      } else if (this.direction === "W") {
        this.x -= this.speed;
      } else {
        console.log("Error: invalid direction");
      }
      
      //if snake hits the edge of the canvas
      if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
        lives--;
        this.x = random(15, width - 15);
        this.y = random(15, height - 15);
      }
    }
  }

  showSelf() {
    noStroke();
    fill(random(360), 100, 100);
    rect(this.x, this.y, this.size, this.size);
    noStroke();

    // Show its tail
    for (let i = 0; i < this.tail.length; i++) {
      this.tail[i].showSelf();
    }
  }

//check if snake has collided with apple
  checkApples() {
    let snakeEatsApple = collideRectRect(
      this.x,
      this.y,
      this.size,
      this.size,
      currentApple.x,
      currentApple.y,
      currentApple.size,
      currentApple.size
    );
    
    if (snakeEatsApple) {
      score++;
      fRate++;
      currentApple = new Apple();
      this.extendTail();
    }
  }

 //check if snake has collided with itself
  checkCollisions() {
    if (this.tail.length > 2) {
      for (let i = 1; i < this.tail.length; i++) {
        if (this.x == this.tail[i].x && this.y == this.tail[i].y) {
          lives--;
        }
        // This helper text will show the index of each tail segment.
        // text(i, this.tail[i].x, this.tail[i].y)
      }
    }
  }

  extendTail() {
    this.tail.push(new TailSegment(this.x, this.y));
  }
}

class TailSegment {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.size = 9;
  }

  showSelf() {
    noStroke();
    fill(random(360), 80, 80);
    rect(this.x, this.y, this.size, this.size);
  }
}

class Apple {
  constructor() {
    this.x = random(15, width - 15);
    this.y = random(15, height - 15);
    this.size = 10;
  }

  showSelf() {
    noStroke();
    fill("red");
    rect(this.x, this.y, this.size, this.size);
  }
}

function keyPressed() {
  if (keyCode === UP_ARROW && playerSnake.direction != "S") {
    playerSnake.direction = "N";
  } else if (keyCode === DOWN_ARROW && playerSnake.direction != "N") {
    playerSnake.direction = "S";
  } else if (keyCode === RIGHT_ARROW && playerSnake.direction != "W") {
    playerSnake.direction = "E";
  } else if (keyCode === LEFT_ARROW && playerSnake.direction != "E") {
    playerSnake.direction = "W";
  } 
    else {
    console.log("wrong key");
  }
}

function gameOver() {
  fill("white");
  textSize(20);
  text("Game Over!", width / 2 - 60, height / 2);
  text('Refresh to restart', width / 2 - 60, height / 2 + 20);
  textSize(13);
}

function checkLives() {
  if (lives <= 0) {
    gameIsOver = true;
  }
}
