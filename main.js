let rows;
let columns;
let totalMines;
let cellSize = 30;
let gameBoardCells = [];
let mines = [];
let gameOver = false;
let minesPlaced = false;
let gameBoard = document.getElementById("gameBoard");
let resetBtn = document.getElementById("resetBtn");
let gameFinished = document.getElementById("gameOver");
let gameDifficulty = document.getElementById("difficultyBtns");
let easyBtn = document.getElementById("easyDifficulty");
let mediumBtn = document.getElementById("mediumDifficulty");
let hardBtn = document.getElementById("hardDifficulty");

window.onload = function() {
    gameDifficulty.classList.add("show");
    easyBtn.addEventListener('click', easyDifficulty);
    mediumBtn.addEventListener('click', mediumDifficulty);
    hardBtn.addEventListener('click', hardDifficulty);
}

function easyDifficulty() {
    rows = 10;
    columns = 10;
    totalMines = 10;
    gameDifficulty.classList.remove("show");
    startGame();
}

function mediumDifficulty() {
    rows = 16;
    columns = 16;
    totalMines = 25;
    gameDifficulty.classList.remove("show");
    startGame();
}

function hardDifficulty() {
    rows = 20;
    columns = 20;
    totalMines = 40;
    gameDifficulty.classList.remove("show");
    startGame();
}

function startGame() {
    gameBoard.style.width = `${columns * cellSize}px`;
    gameBoard.style.height = `${rows * cellSize}px`;
    gameBoard.addEventListener('click', onLeftClick);
    gameBoard.addEventListener('contextmenu', onRightClick);
    generateGameboard();
    resetBtn.addEventListener('click', resetGame);
}

function resetGame() {
    gameFinished.classList.remove("show");
    gameBoard.innerHTML = "";
    gameOver = false;
    minesPlaced = false;
    generateGameboard();
}

function onRightClick(e) {
    e.preventDefault();
    let tgt = e.target;
    let closestDiv = tgt.closest("div");
    if (gameOver == true || tgt.classList.contains("show")) {
        return;
    }
    closestDiv.flag = !closestDiv.flag;
    if (closestDiv.flag == true) {
        closestDiv.innerHTML = '<img src=" ./Images/flag.png "></img';
        if (mines.every(x => x.flag == true)) {
            gameOver == true;
            gameFinished.classList.add("show");
            document.getElementById("displayGameOverMsg").innerHTML = "You Won!";
        }
    } else {
        closestDiv.innerHTML = "";
    }
}

function onLeftClick(e) {
    let tgt = e.target.closest("div");
    if (minesPlaced == false) {
        placeMines(totalMines);
        minesPlaced = true;
    }
    if (gameOver == true || tgt.flag == true || tgt.classList.contains("show")) {
        return;
    }
    if (tgt.value == "m") {
        tgt.innerHTML = '<img src=" ./Images/mine.png "></img>';
        gameOver = true;
    } else {
        tgt.textContent = tgt.value;
    }
    tgt.classList.add('show');
    if (!tgt.value) {
        showAll(tgt);
    }
    if (gameOver) {
        gameFinished.classList.add("show");
        document.getElementById("displayGameOverMsg").innerHTML = "You Lost!";
    }
}

function showAll(tgt) {
    let x = tgt.x;
    let y = tgt.y;
    tgt.textContent = tgt.value;
    tgt.classList.add("show");
    if (tgt.value) {
        return;
    }
    let gameCells = Array.from(gameBoard.children).filter(elem => elem != tgt &&
        !elem.classList.contains("show") && x - 1 <= elem.x && x + 1 >= elem.x &&
        y - 1 <= elem.y && y + 1 >= elem.y);
    gameCells.forEach(showAll);
}

function generateGameboard() {
    gameBoardCells.length = 0;
    for (let i = 0; i < rows; ++i) {
        gameBoardCells.push(Array(columns));
        for (let j = 0; j < columns; ++j) {
            let cell = document.createElement('div');
            cell.x = j;
            cell.y = i;
            cell.style.top = `${i * cellSize}px`;
            cell.style.left = `${j * cellSize}px`;
            gameBoardCells[i][j] = cell;
            gameBoard.appendChild(cell);
        }
    }
}

function placeMines(nrOfMines) {
    let totalCells = rows * columns;
    mines.length = 0;
    for (let i = 0; i < nrOfMines; ++i) {
        let currentElement;
        do {
            let minePosition = setPosition(0, totalCells - 1);
            currentElement = gameBoard.children[minePosition];
        } while (currentElement.value)
            currentElement.value = "m";
            mines.push(currentElement);
    }
        minesNeighbours(mines);
}

    
function setPosition(min, max) {
    return Math.floor(min + Math.random() * (max - min));
}

function minesNeighbours(mines) {
    let elemRow, elemCol, elemVal;
    mines.forEach(mine =>  {
        elemRow = mine.y;
        elemCol = mine.x;
        if (elemRow >= 1) {
            elemVal = gameBoardCells[elemRow - 1][elemCol].value;
            if (elemVal != "m") {
                gameBoardCells[elemRow - 1][elemCol].value = (elemVal || 0) + 1;
            }
        }
        if (elemRow < rows - 1) {
            elemVal = gameBoardCells[elemRow + 1][elemCol].value;
            if (elemVal != "m") {
                gameBoardCells[elemRow + 1][elemCol].value = (elemVal || 0) + 1;
            }
        }
        for (let i = 0; i < 3; ++i) {
            if (elemRow - 1 + i < 0 || elemRow - 1 + i >= rows || elemCol == 0) {
                continue;
            }
            elemVal = gameBoardCells[elemRow - 1 + i][elemCol - 1].value;
            if (elemVal == "m") {
                continue;
            }
            gameBoardCells[elemRow - 1 + i][elemCol - 1].value = (elemVal || 0) + 1;
        }
        for (let i = 0; i < 3; ++i) {
            if (elemRow - 1 + i < 0 || elemRow - 1 + i >= rows || elemCol == columns - 1) {
                continue;
            }
            elemVal = gameBoardCells[elemRow - 1 + i][elemCol + 1].value;
            if (elemVal == "m") {
                continue;
            }
            gameBoardCells[elemRow - 1 + i][elemCol + 1].value = (elemVal || 0) + 1;
        }
    });
}