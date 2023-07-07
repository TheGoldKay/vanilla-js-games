
// Get the canvas element from the DOM
const canvas = document.getElementById('myCanvas');
// Get the 2D rendering context
const ctx = canvas.getContext('2d');

// Set canvas width and height
canvas.width = 810;
canvas.height = 600;
const BOX_SIZE = 30;

const FPS = 5;
let prevTime = 0;
const interval = 1000 / FPS;

const board = {
    cols: canvas.width / BOX_SIZE,
    rows: canvas.height / BOX_SIZE,
};

let food = {
    col: randCol(),
    row: randRow(),
    draw: function (){
        ctx.fillStyle = "pink";
        ctx.fillRect(this.col * BOX_SIZE, this.row * BOX_SIZE, BOX_SIZE, BOX_SIZE);
    },
};

class Snake{
    constructor(){
        this.head = {col: randCol(), row: randRow()};
        this.body = [];
        this.color = "white";
        this.velx = 0; // one column/row at a time
        this.vely = 1;
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
    update(){
        if(this.body.length){
            let last = this.body.pop();
            last.col = this.head.col;
            last.row = this.head.row;
            this.head.col += this.velx;
            this.head.row += this.vely;
            this.body.unshift(last);
            this.head.col, this.head.row = outWin(this.head.col, this.head.row);
            this.body.forEach(part => {
                part.col, part.row = outWin(part.col, part.row);
            });
        }else{
            this.head.col += this.velx;
            this.head.row += this.vely;
            [this.head.col, this.head.row] = outWin(this.head.col, this.head.row);
        }
    }
}

function outWin(col, row){
    let ncol = col, nrow = row;
    if(ncol < 0){
        ncol = board.cols;
    }else if(ncol > board.cols){
        ncol = 0;
    }
    if(nrow < 0){
        nrow = board.rows;
    }else if(nrow > board.rows){
        nrow = 0;
    }
    return [ncol, nrow];
}

function randCol(){
    return Math.floor(Math.random() * board.cols);
}

function randRow(){
    return Math.floor(Math.random() * board.rows);
}

function drawBoard(){
    ctx.strokeStyle = "#155F55";
    for(let row = 0; row < board.rows; ++row){
        for(let col = 0; col < board.cols; ++col){
            ctx.strokeRect(col * BOX_SIZE, row * BOX_SIZE, BOX_SIZE, BOX_SIZE);
        }
    }
}

document.addEventListener('keydown', function(event) {
    if (event.code === 'ArrowLeft' && snake.velx !== 1) {
        snake.velx = -1;
        snake.vely = 0;
    } else if (event.code === 'ArrowRight' && snake.velx !== -1) {
        snake.velx = 1;
        snake.vely = 0;
    } else if (event.code === 'ArrowUp' && snake.vely !== 1) {
        snake.vely = -1;
        snake.velx = 0;
    } else if (event.code === 'ArrowDown' && snake.vely !== -1) {
        snake.vely = 1;
        snake.velx = 0;
    }
});  

let snake = new Snake();

function gameLoop(time) {
  requestAnimationFrame(gameLoop);
  const deltaTime = time - prevTime;
  if (deltaTime > interval) {
    prevTime = time - (deltaTime % interval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snake.update();
    drawBoard();
    food.draw();
    snake.draw();
  }
}

gameLoop();