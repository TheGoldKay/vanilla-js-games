
// Get the canvas element from the DOM
const canvas = document.getElementById('myCanvas');
// Get the 2D rendering context
const ctx = canvas.getContext('2d');

// Set canvas width and height
canvas.width = 810;
canvas.height = 600;
const BOX_SIZE = 30;

const FPS = 60;
let prevTime = 0;

let board = {
    cols: canvas.width / BOX_SIZE,
    rows: canvas.height / BOX_SIZE,
};

class Snake{
    constructor(){
        this.head = {col: randCol(), row: randRow()};
        this.body = [];
        this.color = "#a9a9a9";
    }
    draw(){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.head.col * BOX_SIZE, this.head.row * BOX_SIZE, BOX_SIZE, BOX_SIZE);
        if(this.body.length){
            this.body.forEach(part => {
                ctx.fillRect(part.col * BOX_SIZE, part.row * BOX_SIZE, BOX_SIZE, BOX_SIZE);
            });
        }
    }
}

function randCol(){
    return Math.floor(Math.random() * board.cols);
}

function randRow(){
    return Math.floor(Math.random() * board.rows);
}

let snake = new Snake();

function gameLoop(time) {
  requestAnimationFrame(gameLoop);

  const deltaTime = time - prevTime;
  const interval = 1000 / FPS;

  if (deltaTime > interval) {
    prevTime = time - (deltaTime % interval);

    snake.draw();
  }
}

gameLoop();

