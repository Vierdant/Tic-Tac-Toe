const GRID = document.getElementById("grid");
const TURN_TEXT = document.getElementById("turntext");
const END_SCENE = document.getElementById("endscene");
const END_SCENE_STATUS = document.getElementById("endscene-status");
const END_SCENE_IMG = document.getElementById("endscene-img");
const PLAY_AGAIN_BUTTON = document.getElementById("playagain");
const PLAYER = {
    X: "x",
    O: "o"
};
const GAME_STATUS = {
    RUNNING: "running",
    WON: "won",
    DRAW: "draw"
};
let board = new Array(9).fill(""); // Represents the Tic Tac Toe board
let currentTurn = Math.random() > 0.5 ? PLAYER.X : PLAYER.O; // Represents the current player's turn
let currentStatus = GAME_STATUS.RUNNING; // Represents the current game status

const WINNING_CONDITIONS = [
    [1, 2, 3], // top row
    [4, 5, 6], // middle row
    [7, 8, 9], // bottom row
    [1, 4, 7], // left column
    [2, 5, 8], // middle column
    [3, 6, 9], // right column
    [1, 5, 9], // left diagonal
    [3, 5, 7] // right diagonal
];

// Updates the text indicating whose turn it is
const updateTurnText = () => {
    TURN_TEXT.textContent = `Player ${currentTurn.toUpperCase()}'s Turn`;
};

// Initializes the game board
const init = () => {
    const cells = [];
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.cellId = i + 1;
        GRID.appendChild(cell);
        cells.push(cell);
    }

    cells.forEach((cell) => {
        cell.addEventListener("click", handleCellClick);
    });

    updateTurnText();
};

// Sets the value of a cell on the board
const setBoardCell = (cell, value) => {
    board[cell - 1] = value;
};

// Retrieves the value of a cell on the board
const getBoardCell = (cell) => {
    return board[cell - 1];
};

// Checks if the board is full
const isBoardFull = () => {
    return board.every(cell => cell !== "");
};

// Switches the turn to the next player
const switchTurn = () => {
    currentTurn = currentTurn === PLAYER.X ? PLAYER.O : PLAYER.X;
    updateTurnText();
};

// Checks the current game status (running, won, draw)
const checkStatus = () => {
    for (const condition of WINNING_CONDITIONS) {
        const [a, b, c] = condition;
        if (getBoardCell(a) === currentTurn && getBoardCell(b) === currentTurn 
            && getBoardCell(c) === currentTurn) {
            currentStatus = GAME_STATUS.WON;
            return true;
        }
    }

    if (isBoardFull()) {
        currentStatus = GAME_STATUS.DRAW;
        return true;
    }

    return false;
};

// Resets the game board and status
const reset = () => {
    GRID.innerHTML = "";
    TURN_TEXT.classList.remove("hide");
    END_SCENE_IMG.classList.remove("hide");
    GRID.classList.remove("display-none");
    END_SCENE.classList.remove("show-hidden");
    board = new Array(9).fill("");
    currentStatus = GAME_STATUS.RUNNING;
    init();
};

// Ends the game and displays the result
const end = () => {
    TURN_TEXT.classList.add("hide");
    
    if (currentStatus === GAME_STATUS.DRAW) {
        END_SCENE_STATUS.textContent = "Draw!";
        END_SCENE_IMG.classList.add("hide");
    } else {
        END_SCENE_STATUS.textContent = "Game Won!"
        END_SCENE_IMG.src = `./assets/ttt-${currentTurn}.png`;
    }

    GRID.classList.add("display-none");
    END_SCENE.classList.add("show-hidden");
};

// Handles the click event on a cell
const handleCellClick = (event) => {
    if (currentStatus !== GAME_STATUS.RUNNING) {
        return;
    }

    const cell = event.target;
    const cellId = cell.dataset.cellId;

    if (getBoardCell(cellId) !== "") {
        return;
    }

    const img = document.createElement("img");
    img.src = `./assets/ttt-${currentTurn}.png`;
    img.alt = currentTurn;
    img.draggable = false;

    cell.appendChild(img);
    cell.setAttribute("marked", true);
    setBoardCell(cellId, currentTurn);

    if (checkStatus()) {
        end();
        return;
    }

    switchTurn();
};

// Resets the game when the "Play Again" button is clicked
PLAY_AGAIN_BUTTON.addEventListener("click", reset);

// Initializes the game when the DOM content is loaded
document.addEventListener("DOMContentLoaded", init);