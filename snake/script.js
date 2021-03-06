const menu = document.querySelector('.menu')
const audio = document.querySelector('.audio')
const options = document.querySelector('.options')
const controls = document.querySelector('.controls')
const volButtons = document.querySelector('.volume-buttons')
const volPause = document.querySelector('.volume-pause')
const volUp = document.querySelector('.volume-up')
const canvas = document.querySelector('.canvas')
const ctx = canvas.getContext('2d')
const showScore = document.querySelector('.score-val')
const finalScore = document.querySelector('.final-score')
const playBtn = document.querySelector('.play-button')
const pauseBtn = document.querySelector('.pause-button')
const menuBtn = document.querySelector('.menu-btn')
const menuPlayBtn = document.querySelector('.menu__play-button')
const menuOptBtn = document.querySelector('.menu__options-button')
const menuCtrlBtn = document.querySelector('.menu__control-button')
const menuBackBtn = document.querySelector('.back-button')
const menuBackBtnCtrl = document.querySelector('.back-button-ctrl')
const sizeVal = document.querySelector('.size-val')
const sizeInput = document.querySelector('.size-input')
const volVal = document.querySelector('.volume-val')
const volInput = document.querySelector('.volume-input')
const resultField = document.querySelector('.result-field')
const winLose = document.querySelector('.win-lose')
const speedInput = document.querySelector('.speed-input')
const speedVal = document.querySelector('.speed-val')
const gameContent = document.querySelector('.game-content')
const currTable = document.querySelector('.score-list')
const bestVal = document.querySelector('.best-val')


function getLocalStorage() {
    if(localStorage.getItem('table')){
        for (let i = 0; i < localStorage.getItem('table').split(',').length; i++){
            let par = document.createElement('p')
            par.innerHTML = `${i + 1}. ${localStorage.getItem('table').split(',')[i]}`
            currTable.appendChild(par)
        }
    }
}
window.addEventListener('load', getLocalStorage)

audio.volume = 0.2
let cellSize = 20 //???????????? ????????????
let cellCnt = canvas.width / cellSize //???????????????????? ?????????? ?? ??????????????
let dir,
    score = 0,
    pause,
    checkKey = 0,
    speed = 130,
    redColor = [255, 0, 0],
    greenColor = [0, 163, 0],
    totalScore = localStorage.getItem('table') ? localStorage.getItem('table').split(',') : [],
    best = localStorage.getItem('best') ? localStorage.getItem('best') : score
bestVal.textContent = best
console.log(best)
console.log(totalScore)
//???????????????? ????????????
let snakeSpeed = {
    x: 0,
    y: 0
}

//???????????????????? ??????
let food = {
    x: Math.floor(Math.random() * cellCnt),
    y: Math.floor(Math.random() * cellCnt)
}

let snake = []

//???????????? ????????????
let snakeHead = {
    x: cellCnt / 2,
    y: cellCnt / 2
}

//?????????? ????????????
let snakeWidth = 1

//??????????????????
function draw (){
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

//?????????????????? ????????????
function drawSnake(){
    for (let i = 0; i < snake.length; i++){
        ctx.fillStyle = i === snake.length - 1 ? '#ff0000' : '#00A300'
        ctx.fillRect(snake[i].x * cellSize, snake[i].y * cellSize, cellSize - 2, cellSize - 2)
        
        if (snake[i].x === snakeHead.x && snake[i].y === snakeHead.y && snake.length > 1){
            clearInterval(game)
            canvas.classList.add('canvas-none')
            resultField.classList.add('result-block')
            finalScore.textContent = score
            scoreTableCreate()
        }
        else if(snakeWidth === cellCnt * cellCnt){
            clearInterval(game)
            canvas.classList.add('canvas-none')
            resultField.classList.add('result-block')
            finalScore.textContent = score
            winLose.textContent = 'You win!!!!'
            scoreTableCreate()
        }
    }
}

//???????????????? ?????????????? ??????????
function scoreTableCreate(){
    if (bestVal.textContent.length === 0){
        bestVal.textContent = score
        best = score
    }
    else if(+bestVal.textContent < score){
        bestVal.textContent = score
        best = score
    }
    
    if(totalScore.length < 10){
        totalScore.push(score)
        let par = document.createElement('p')
        par.innerHTML = `${totalScore.length}. ${score}`
        currTable.appendChild(par)
    }
    else if (totalScore.length === 10){
        totalScore.shift()
        totalScore.push(score)
        let childrens = [...currTable.children]
        let i = 0
        childrens.forEach(el => {
            el.innerHTML = `${i + 1}. ${totalScore[i]}`
            i++
        })
    }
    

    console.log(totalScore)
}

//?????????????????? ??????
function drowFood(){
    let curColor = []
    for (let i = 0; i < 3; i++){
        curColor.push(ctx.getImageData(food.x * cellSize, food.y * cellSize, cellSize - 2, cellSize - 2).data[i])
    }
    if (JSON.stringify(curColor) === JSON.stringify(redColor) || JSON.stringify(curColor) === JSON.stringify(greenColor)){
        food.x = Math.floor(Math.random() * cellCnt)
        food.y = Math.floor(Math.random() * cellCnt)
        drowFood()
    }
    else{
        ctx.fillStyle = '#fff000'
        ctx.fillRect(food.x * cellSize, food.y * cellSize, cellSize - 2, cellSize - 2)
    }
    
}

//???????????????????? ???????????? ????????????
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

//???????????????????? ???????? ????????????
function snakeBodyUpdate(){
    snake.push({
        x: snakeHead.x,
        y: snakeHead.y,
    })
    while (snake.length > snakeWidth){
        snake.shift()
    }
}

//???????????????? ??????
function eatFood(){
    if (food.x === snakeHead.x && food.y === snakeHead.y){
        snakeWidth += 1 
        food.x = Math.floor(Math.random() * cellCnt)
        food.y = Math.floor(Math.random() * cellCnt)
        score += 10
        showScore.textContent = score
    }
}

//?????????????? ??????????????
function onKeyDown(e){
    if(e.keyCode === 37 && dir != 'right'){
        isPauseTrue()
        playBtn.textContent = 'Restart'
        pauseBtn.textContent = 'Pause'
        dir = 'left'
        snakeSpeed.x = -1
        snakeSpeed.y = 0
    }
    else if(e.keyCode === 38 && dir != 'down'){
        isPauseTrue()
        playBtn.textContent = 'Restart'
        pauseBtn.textContent = 'Pause'
        dir = 'up'
        snakeSpeed.x = 0
        snakeSpeed.y = -1
    }
    else if(e.keyCode === 39 && dir != 'left'){
        isPauseTrue()
        playBtn.textContent = 'Restart'
        pauseBtn.textContent = 'Pause'
        dir = 'right'
        snakeSpeed.x = 1
        snakeSpeed.y = 0
    }
    else if(e.keyCode === 40 && dir != 'up'){
        isPauseTrue()
        playBtn.textContent = 'Restart'
        pauseBtn.textContent = 'Pause'
        dir = 'down'
        snakeSpeed.x = 0
        snakeSpeed.y = 1
    }
    else if(e.keyCode === 80){
        if(playBtn.textContent === 'Start' || canvas.classList.contains('canvas-none')){
            e.preventDefault()
        }
        else if(pauseBtn.textContent === 'Pause'){
            pause = true
            checkKey = 0
            clearInterval(game)
            pauseBtn.textContent = 'Play'
        }
        else{
            pause = false
            game = setInterval(gameUpdate, speed)
            pauseBtn.textContent = 'Pause'
        }
    }
    else if (e.keyCode === 82){
        canvas.classList.remove('canvas-none')
        resultField.classList.remove('result-block')
        playBtn.textContent = 'Restart'
        pauseBtn.textContent = 'Pause'
        pause = false
        score = 0
        showScore.textContent = 0
        clearInterval(game)
        dir = 'down'
        snakeSpeed.x = 0
        snakeSpeed.y = 1
        snake = []
        snakeHead = {
            x: cellCnt / 2,
            y: cellCnt / 2
        }

        snakeWidth = 1
        food = {
            x: Math.floor(Math.random() * cellCnt),
            y: Math.floor(Math.random() * cellCnt)
        }
        game = setInterval(gameUpdate, speed)
    }
    else if (e.keyCode === 27){
        clearInterval(game)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        menu.classList.remove('menu-none')
        gameField.classList.remove('game-block')
        resultField.classList.remove('result-block')
        canvas.classList.remove('canvas-none')
        pauseBtn.textContent = 'Pause'
        playBtn.textContent = 'Start'
        pause = false
        score = 0
        showScore.textContent = 0
        
        snakeSpeed = {
            x: 0,
            y: 0
        }

        food = {
            x: Math.floor(Math.random() * cellCnt),
            y: Math.floor(Math.random() * cellCnt)
        }


        snake = []

        snakeHead = {
            x: cellCnt / 2,
            y: cellCnt / 2
        }

        snakeWidth = 1
        game = setInterval(gameUpdate, speed)
    }
    else if(e.keyCode === 90){
        if (audio.volume > 0.1 && audio.muted === true){
            volInput.value = String(+volInput.value - 1)
            volVal.textContent = volInput.value * 10
            audio.volume = +volInput.value / 10
            volUp.classList.remove('volume-mute')
            audio.muted = false  
        }
        else if(audio.volume > 0.1 && audio.muted === false){
            volInput.value = String(+volInput.value - 1)
            volVal.textContent = volInput.value * 10
            audio.volume = +volInput.value / 10
        }
        else if (audio.volume === 0.1 && audio.muted === false){
            volUp.classList.add('volume-mute')
            audio.muted = true
        }
        else{
            volUp.classList.add('volume-mute')
            audio.muted = true
        }
        console.log(audio.volume)
    }
    else if(e.keyCode === 88){
        if (audio.volume === 0.1 && audio.muted === true){
            volUp.classList.remove('volume-mute')
            audio.muted = false
        }
        else if (audio.volume < 1 && audio.muted === true){
            volInput.value = String(+volInput.value + 1)
            volVal.textContent = volInput.value * 10
            audio.volume = +volInput.value / 10
            volUp.classList.remove('volume-mute')
            audio.muted = false  
        }
        else if(audio.volume < 1 && audio.muted === false){
            volInput.value = String(+volInput.value + 1)
            volVal.textContent = volInput.value * 10
            audio.volume = +volInput.value / 10
        }
        else if (audio.volume === 1 && audio.muted === true){
            volUp.classList.remove('volume-mute')
            audio.muted = false
        }
        else{
            volUp.classList.remove('volume-mute')
            audio.muted = false
        }
        console.log(audio.volume)
    }
}

function isPauseTrue(){
    if(pause === true && checkKey === 0){
        game = setInterval(gameUpdate, speed)
        checkKey = 1
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

let game = setInterval(gameUpdate, speed)


playBtn.addEventListener('click', () => {
    canvas.classList.remove('canvas-none')
    resultField.classList.remove('result-block')
    playBtn.textContent = 'Restart'
    pauseBtn.textContent = 'Pause'
    pause = false
    score = 0
    showScore.textContent = 0
    clearInterval(game)
    dir = 'down'
    snakeSpeed.x = 0
    snakeSpeed.y = 1
    snake = []
    snakeHead = {
        x: cellCnt / 2,
        y: cellCnt / 2
    }

    snakeWidth = 1
    food = {
        x: Math.floor(Math.random() * cellCnt),
        y: Math.floor(Math.random() * cellCnt)
    }
    game = setInterval(gameUpdate, speed)
})

pauseBtn.addEventListener('click', (e) => {
    
    if(playBtn.textContent === 'Start' || canvas.classList.contains('canvas-none')){
        e.preventDefault()
    }
    else if(pauseBtn.textContent === 'Pause'){
        pause = true
        checkKey = 0
        clearInterval(game)
        pauseBtn.textContent = 'Play'
    }
    else{
        pause = false
        game = setInterval(gameUpdate, speed)
        pauseBtn.textContent = 'Pause'
    }
    
})

menuBtn.addEventListener('click', () => {
    clearInterval(game)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    menu.classList.remove('menu-none')
    gameContent.classList.remove('content-block')
    resultField.classList.remove('result-block')
    canvas.classList.remove('canvas-none')
    pauseBtn.textContent = 'Pause'
    playBtn.textContent = 'Start'
    pause = false
    score = 0
    showScore.textContent = 0
    
    snakeSpeed = {
        x: 0,
        y: 0
    }
    
    food = {
        x: Math.floor(Math.random() * cellCnt),
        y: Math.floor(Math.random() * cellCnt)
    }
    
    
    snake = []
    
    snakeHead = {
        x: cellCnt / 2,
        y: cellCnt / 2
    }
    
    snakeWidth = 1
    game = setInterval(gameUpdate, speed)
})

menuPlayBtn.addEventListener('click', () => {
    if (!volPause.classList.contains('volume-play')){
        audio.play()
    }
    menu.classList.add('menu-none')
    gameContent.classList.add('content-block')
    volButtons.classList.add('volume-block')
    
})

menuOptBtn.addEventListener('click', () => {
    menu.classList.add('menu-none')
    options.classList.add('options-block')
})

menuCtrlBtn.addEventListener('click', () => {
    menu.classList.add('menu-none')
    controls.classList.add('controls-block')
})

menuBackBtn.addEventListener('click', () => {
    menu.classList.remove('menu-none')
    options.classList.remove('options-block')
})

menuBackBtnCtrl.addEventListener('click', () => {
    menu.classList.remove('menu-none')
    controls.classList.remove('controls-block')
})

sizeInput.addEventListener('input', () => {
    sizeVal.textContent = sizeInput.value * 10
    cellSize = 400 / sizeVal.textContent
    cellCnt = canvas.width / cellSize
    snakeHead = {
        x: cellCnt / 2,
        y: cellCnt / 2
    }
})

volInput.addEventListener('input', () => {
    volVal.textContent = volInput.value * 10
    audio.volume = volInput.value / 10
})

volPause.addEventListener('click', () => {
    volPause.classList.toggle('volume-play')
    if (volPause.classList.contains('volume-play')){
        audio.pause()
    }
    else{
        audio.play()
    }
})

volUp.addEventListener('click', () => {
    volUp.classList.toggle('volume-mute')
    if (volUp.classList.contains('volume-mute')){
        audio.muted = true
    }
    else{
        audio.muted = false
    }
})

speedInput.addEventListener('input', () => {
    if (speedInput.value === '1'){
        speed = 200
        speedVal.textContent = '10'
        clearInterval(game)
        game = setInterval(gameUpdate, speed)
    }
    else if (speedInput.value === '3'){
        speed = 80
        speedVal.textContent = '30'
        clearInterval(game)
        game = setInterval(gameUpdate, speed)
    }
    else if(speedInput.value === '2'){
        speed = 130
        speedVal.textContent = '20'
        clearInterval(game)
        game = setInterval(gameUpdate, speed)
    }
})

function setLocalStorage() {
    localStorage.setItem('best', best)
    localStorage.setItem('table', totalScore)
}
window.addEventListener('beforeunload', setLocalStorage)