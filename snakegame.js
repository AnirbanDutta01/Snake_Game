const gameBoard=document.querySelector("#gameBoard");
const resetBtn=document.querySelector("#resetBtn");
const scoreText=document.querySelector("#scoreText");
const startBtn=document.querySelector("#startBtn");
const pauseBtn=document.querySelector("#pauseBtn");
const continueBtn=document.querySelector("#continueBtn");
const ctx=gameBoard.getContext("2d");
const gameHeight=gameBoard.height;
const gameWidth=gameBoard.width;
const boardBackground="#ADD8E6";
const snakeColor="lightgreen";
const snakeBorder="black";
const foodcolor="red";
let intervalID;
const unitSize=20;
let ballRadius=12.5;
//let pause=false;
let savedGameState=null;
let running=false;
let xVelocity=unitSize;
let yVelocity=0;
let foodX;
let foodY;
let score=0;
let time=100;
let snake=[
    {x:unitSize*4, y:0},
    {x:unitSize*3, y:0},
    {x:unitSize*2, y:0},
    {x:unitSize*1, y:0},
    {x:0, y:0}
];
window.addEventListener("keydown",changeDirection);
resetBtn.addEventListener("click",resetGame);
startBtn.addEventListener("click",gameStart);
pauseBtn.addEventListener("click",pauseGame);
continueBtn.addEventListener("click",continueGame);
function gameStart(){
        startBtn.disabled=true;
        running=true;
        scoreText.textContent=score;
        createFood();
        drawFood();
        nextTick();
}
/*function continueGame(){
    if(pause%2==0){
        running=true;
        startBtn.innerHTML='Start';
    }
}*/
function pauseGame(){
    //pause=true;
    /*startBtn.style.display="none";*/
    /*continueBtn.style.display="block";*/
    if(running){
        running=false;
        savedGameState={
            xVelocity:xVelocity,
            yVelocity:yVelocity,
            foodX:foodX,
            foodY:foodY,
            score:score,
            time:time,
            snake:snake
        }
    }
}
function continueGame(){
    //pause=false;
    /*continueBtn.style.display="none";*/
    /*startBtn.style.display="block";*/
    if(!running && savedGameState!==null){
        xVelocity=savedGameState.xVelocity;
        yVelocity=savedGameState.yVelocity;
        foodX=savedGameState.foodX;
        foodY=savedGameState.foodY;
        score=savedGameState.score;
        time=savedGameState.time;
        snake=savedGameState.snake;
        running=true;
        nextTick();
        savedGameState=null;
    }
}
function nextTick(){
    if(running){
        intervalID=setTimeout(()=>{
         clearBoard();
         //createFood();
         drawFood();
         moveSnake();
         drawSnake();
         checkGameOver();
         nextTick();
        },time)
    }
    else{
        diplayGameOver();
    }
};
function clearBoard(){
    ctx.fillStyle=boardBackground;
    ctx.fillRect(0,0,gameHeight,gameWidth);
}
function drawFood(){
    ctx.fillStyle=foodcolor;
    //ctx.arc(foodX,foodY,ballRadius,0,2*Math.PI);
    ctx.fillRect(foodX,foodY,unitSize,unitSize);
}
function createFood(){
    foodX=randomFood(0,gameWidth-unitSize);
    foodY=randomFood(0,gameHeight-unitSize);
    function randomFood(min,max){
        const randNum=Math.floor((Math.random()*(max-min)+min)/unitSize)*unitSize;
        return randNum;
    }
}
function drawSnake(){
    //ctx.strokeStyle=snakeBorder;
    ctx.fillStyle=snakeColor;
    snake.forEach(snakePart=>{
        ctx.strokeRect(snakePart.x,snakePart.y,unitSize,unitSize);
        ctx.fillRect(snakePart.x,snakePart.y,unitSize,unitSize)
    })
};
function moveSnake(){
    const head={x:snake[0].x+xVelocity, //object creating
                y:snake[0].y+yVelocity}//snake length increase
    snake.unshift(head);
    if(foodX==snake[0].x && foodY==snake[0].y){
        score+=1;
        time-=2;
        console.log(time)
        scoreText.textContent=score;
        createFood();
    }
    else{
        snake.pop()
    }
};

function changeDirection(event){
    const keyPressed=event.keyCode;
    //console.log(keyPressed)
    const LEFT=37;
    const UP=38;
    const RIGHT=39;
    const w=87
    const a= 65;
    const s= 83
    const d=68
    const DOWN=40;
    let goingUp=(yVelocity==-unitSize);
    let goingDown=(yVelocity==unitSize);
    let goingLeft=(xVelocity==-unitSize);
    let goingRight=(xVelocity==unitSize);
    switch(true){
        case((keyPressed==LEFT ||keyPressed==a) && !goingRight):
            yVelocity=0;
            xVelocity=-unitSize;
            break;
        
        case((keyPressed==RIGHT || keyPressed==d) && !goingLeft):
            yVelocity=0;
            xVelocity=unitSize;
            break;
        
        case((keyPressed==UP||keyPressed==w) && !goingDown):
            xVelocity=0;
            yVelocity=-unitSize;
            break;
        
        case((keyPressed==DOWN|| keyPressed==s) && !goingUp):
            xVelocity=0;
            yVelocity=unitSize;
            break;        
    }
};

function diplayGameOver(){
    ctx.font="50px MV Boli";
    ctx.fillStyle="red";
    ctx.textAlign="center";
    ctx.fillText("Game Over !",gameHeight/2,gameWidth/2);
};

function checkGameOver(){
    switch(true){
        case(snake[0].x<0):{
            running=false;
            break;
        }
        case(snake[0].y<0):{
            running=false;
            break;
        }
        case(snake[0].x>=gameWidth):{
            running=false;
            break;
        }
        case(snake[0].y>=gameHeight):{
            running=false;
            break;
        }
    }
    for(let i=1;i<snake.length;i++){
        if(snake[i].x==snake[0].x && snake[i].y==snake[0].y){
            running=false;
        }
    }
};

function resetGame(){
    score=0;
    xVelocity=unitSize;
    yVelocity=0;
    snake=[
        {x:unitSize*4, y:0},
        {x:unitSize*3, y:0},
        {x:unitSize*2, y:0},
        {x:unitSize*1, y:0},
        {x:0, y:0}
    ]
    time=100;
    //pause=false;
    /*startBtn.style.display="block";*/
    /*continueBtn.style.display="none";*/
    clearTimeout(intervalID);
    gameStart();
};
