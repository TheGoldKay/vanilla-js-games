
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
        ctx.beginPath();
        ctx.arc(this.col * BOX_SIZE + BOX_SIZE / 2, this.row * BOX_SIZE + BOX_SIZE / 2, BOX_SIZE / 2, 0, 2 * Math.PI);
        ctx.fillStyle = "blue";
        ctx.fill();
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
            for(const part of this.body){
                ctx.fillRect(part.col * BOX_SIZE, part.row * BOX_SIZE, BOX_SIZE, BOX_SIZE);
            }
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
            [this.head.col, this.head.row] = outWin(this.head.col, this.head.row);
            for(let i = 0; i < this.body.length; ++i){
                [this.body[i].col, this.body[i].row] = outWin(this.body[i].col, this.body[i].row); 
            }
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

function newFood(){
    food.col = randCol();
    food.row = randRow();
}

function collide(){
    if(food.col === snake.head.col && food.row === snake.head.row){
        // insert the head's pos as the body first part (growing it)
        snake.body.unshift({
            col: snake.head.col,
            row: snake.head.row,
        });
        // the food position will become the snake's head
        snake.head = {
            col: food.col,
            row: food.row,
        };
        // place food in random position
        newFood();
    }
}

function gameOver(){
    console.log(snake.head, snake.body);
    for(let i = 1; i < snake.body.length; i++){
        let part = snake.body[i];
        if(part.col === snake.head.col && part.row === snake.head.row){
            newFood();
            // erase the snake's body
            snake.body = [];
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
    gameOver();
    snake.update();
    collide();
    food.draw();
    snake.draw();
    drawBoard();

  }
}

gameLoop();