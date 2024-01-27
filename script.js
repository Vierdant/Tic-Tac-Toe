const grid = document.getElementById("board");
const turnText = document.getElementById("turntext");
const endScene = document.getElementById("endscene");
const endSceneStatus = document.getElementById("endscene-status");
const endSceneImg = document.getElementById("endscene-img");
const playAgainButton = document.getElementById("playagain");
const player = {
    x : "x",
    o : "o"
};
const gameStatus = {
    running: "running",
    won: "won",
    draw: "draw"
};
let board = new Array(9).fill("");
let currentTurn = Math.random() > 0.5 ? player.x : player.o;
let currentStatus = gameStatus.running;

const winningConditions = [
    [1, 2, 3], // top row
    [4, 5, 6], // middle row
    [7, 8, 9], // bottom row
    [1, 4, 7], // left column
    [2, 5, 8], // middle column
    [3, 6, 9], // right column
    [1, 5, 9], // left diagonal
    [3, 5, 7] // right diagonal
]

const updateTurnText = () => {
    turnText.textContent = `Turn: ${currentTurn.toUpperCase()}`
}

const init = () => {
    const cells = [];
    for (let i = 0; i < 9; i++) {
        var cell = document.createElement("dev")
        cell.classList.add("cell")
        cell.id = `cell${i + 1}`
        grid.appendChild(cell);
        cells.push(cell);
    }
    
    cells.forEach((cell) => {
        cell.addEventListener("click", handleCellClick)
    });

    updateTurnText();
}

const setBoardCell = (cell, value) => {
    board[cell - 1] = value;
}

const getBoardCell = (cell) => {
    return board[cell - 1];
}

const isBoardFull = () => {
    return board.filter((cell) => cell === "").length === 0;
}

const switchTurn = () => {
    currentTurn = currentTurn === player.x ? player.o : player.x;
    updateTurnText();
}

const checkStatus = () => {
    for (let i = 0; i < winningConditions.length; i++) {
        let count = 0;
        for (let k = 0; k < 3; k++) {
            let value = getBoardCell(winningConditions[i][k])
            if (value === currentTurn) {
                count++;
            }
        }

        if (count === 3) {
            currentStatus = gameStatus.won;
            return true;
        }
    }

    if (isBoardFull()) {
        currentStatus = gameStatus.draw;
        return true;
    }

    return false;
}

const reset = () => {
    grid.replaceChildren();

    turnText.classList.remove("hide");
    endSceneImg.classList.remove("hide");
    grid.classList.remove("erase");
    endScene.classList.remove("show-hidden");
    board = new Array(9).fill("");
    currentStatus = gameStatus.running;

    init();
}

const end = () => {
    turnText.classList.add("hide");
    if (currentStatus === gameStatus.draw) {
        endSceneStatus.textContent = "Draw!";
        endSceneImg.classList.add("hide");
    } else {
        endSceneImg.src = `./assets/ttt-${currentTurn}.png`;
    }

    grid.classList.add("erase");
    endScene.classList.add("show-hidden");
}

const handleCellClick = (event) => {
    if (currentStatus != gameStatus.running) {
        return;
    }

    let cell = event.srcElement;
    const id = cell.id.slice(-1);

    if (getBoardCell(id) != "") {
        return;
    }

    const img = document.createElement("img");
    img.src = `./assets/ttt-${currentTurn}.png`;
    img.alt = `${currentTurn}`;

    cell.appendChild(img);
    cell.setAttribute("marked", true);
    setBoardCell(id, currentTurn);

    if (checkStatus()) {
        end();
        return;
    }

    switchTurn();
}

playAgainButton.addEventListener("click", reset);

document.addEventListener("DOMContentLoaded", init);



