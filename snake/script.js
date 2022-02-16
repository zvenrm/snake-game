const canvas = document.querySelector('.canvas')
const ctx = canvas.getContext('2d')

let cellSize = 20 //размер ячейки
let cellCnt = canvas.width / cellSize //количество ячеек в канвасе
let dir
//скорость змейки
let snakeSpeed = {
    x: 0,
    y: 0
}

//координаты еды
let food = {
    x: 17,
    y: 10
}


let snake = []

//голова змейки
let snakeHead = {
    x: 10,
    y: 10
}

//длина змейки
let snakeWidth = 1

//рисование
function draw (){
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

//рисование змейки
function drawSnake(){
    for (let i = 0; i < snake.length; i++){
        ctx.fillStyle = i === snake.length - 1 ? '#ff0000' : '#00A300'
        ctx.fillRect(snake[i].x * cellSize, snake[i].y * cellSize, cellSize - 2, cellSize - 2)
        if (snake[i].x === snakeHead.x && snake[i].y === snakeHead.y && snake.length > 1){
            clearInterval(game)
        }
        
    }
}

//рисование еды
function drowFood(){
    ctx.fillStyle = '#fff000'
    ctx.fillRect(food.x * cellSize, food.y * cellSize, cellSize - 2, cellSize - 2)
}

//обновление головы змейки
function snakeHeadUpdate(){
    snakeHead.x += snakeSpeed.x
    snakeHead.y += snakeSpeed.y
    if(snakeHead.x < 0){
        snakeHead.x = cellCnt - 1
    }

    if (snakeHead.x > cellCnt - 1){
        snakeHead.x = 0
    }

    if(snakeHead.y < 0){
        snakeHead.y = cellCnt - 1
    }

    if (snakeHead.y > cellCnt - 1){
        snakeHead.y = 0
    }
    
}

//увеличение тела змейки
function snakeBodyUpdate(){
    snake.push({
        x: snakeHead.x,
        y: snakeHead.y,
    })
    while (snake.length > snakeWidth){
        snake.shift()
    }
}

//поедание еды
function eatFood(){
    if (food.x === snakeHead.x && food.y === snakeHead.y){
        snakeWidth += 1
        food.x = Math.floor(Math.random() * cellCnt)
        food.y = Math.floor(Math.random() * cellCnt)
    }
}

//нажатие стрелок
function onKeyDown(e){
    if(e.keyCode === 37 && dir != 'right'){
        dir = 'left'
        snakeSpeed.x = -1
        snakeSpeed.y = 0
    }
    else if(e.keyCode === 38 && dir != 'down'){
        dir = 'up'
        snakeSpeed.x = 0
        snakeSpeed.y = -1
    }
    else if(e.keyCode === 39 && dir != 'left'){
        dir = 'right'
        snakeSpeed.x = 1
        snakeSpeed.y = 0
    }
    else if(e.keyCode === 40 && dir != 'up'){
        dir = 'down'
        snakeSpeed.x = 0
        snakeSpeed.y = 1
    }
}

function gameUpdate (){
    snakeHeadUpdate()
    draw()
    drawSnake()
    eatFood()
    drowFood()
    snakeBodyUpdate()
}



document.addEventListener('keydown', onKeyDown)

let game = setInterval(gameUpdate, 100)