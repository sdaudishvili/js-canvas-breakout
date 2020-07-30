import { fromEvent } from "rxjs";
import { map, pairwise } from "rxjs/operators";
import Brick from "./Brick";

const canvasWidth = 400;
const canvasHeight = 800;
const bricksPerRow = 8;
const spaceBetween = 5;
const brickHeight = 15;
const rows = 4;
const brickWidth =
  (canvasWidth - (bricksPerRow - 1) * spaceBetween) / bricksPerRow;

const bricks = new Array(rows).fill(new Array(bricksPerRow).fill(new Brick()));

const ballRadius = 10;
let ballX = canvasWidth / 2 - ballRadius;
let ballY = canvasHeight / 2 - ballRadius;
let dx = 1.3;
let dy = -1.3;

const paddleWidth = 60;
const paddleHeight = 20;
const bottomOffset = 20;
let paddleX = 0;
let paddleY = canvasHeight - paddleHeight - bottomOffset;

let playInterval = null;

const canvas = document.querySelector("canvas");
canvas.width = 400;
canvas.height = 800;
const range = document.getElementById("range");
const color = document.getElementById("color");
const mouseDown$ = fromEvent(canvas, "mousedown");
const mouseMove$ = fromEvent(canvas, "mousemove");

const ctx = canvas.getContext("2d");

const stream$ = mouseMove$.pipe(map((e) => e.offsetX));
stream$.subscribe((x) => {
  if (x + paddleWidth / 2 < canvasWidth && x - paddleWidth / 2 > 0)
    paddleX = x - paddleWidth / 2;
});

function drawBricks() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < bricksPerRow; j++) {
      const x = j * (brickWidth + spaceBetween);
      const y = i * (brickHeight + spaceBetween);
      bricks[i][j].x = x;
      bricks[i][j].y = y;
      if (bricks[i][j].isVisible) {
        ctx.fillRect(x, y, brickWidth, brickHeight);
      }
    }
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.fillRect(paddleX, paddleY, paddleWidth, paddleHeight);
}

function init() {
  drawBricks();
  drawBall();
  drawPaddle();
}

function checkForCollisions() {
  if (ballX + dx - ballRadius < 0 || ballX + dx + ballRadius > canvasWidth)
    dx = -dx;
  if (
    ballY + dy - ballRadius < 0 ||
    (ballY + dy >= paddleY && ballX > paddleX && ballX < paddleX + paddleWidth)
  ) {
    dy = -dy;
  }

  if (ballY + dy + ballRadius > canvasHeight) {
    clearInterval(playInterval);
    init();
  }
}

function checkForBrickCollisions() {}

function moveBall() {
  checkForCollisions();
  checkForBrickCollisions();

  ballX += dx;
  ballY += dy;
}

function play() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  moveBall();
  init();
}

playInterval = setInterval(play, 10);
