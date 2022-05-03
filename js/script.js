const PlayerFactory = (name, marker) => {
    let moves = [];
    let winner = false;

    return {
        name,
        marker,
        moves,
        winner
    };
};

const gameBoard = (() => {
    const boxContent = [
        '', '', '',
        '', '', '',
        '', '', ''
    ];

    const winConditions = [
        ['0', '1', '2'],
        ['3', '4', '5'],
        ['6', '7', '8'],
        ['0', '3', '6'],
        ['1', '4', '7'],
        ['2', '5', '8'],
        ['0', '4', '8'],
        ['2', '4', '6']
    ]

    const player1 = PlayerFactory('Player 1', 'X');
    const player2 = PlayerFactory('Player 2', 'O');
    const computer = PlayerFactory('Computer', 'O')

    let playVsComputer = false;
    let player1Turn = true;
    let endGame = false;
    let moveCounter = 0;
    const totalMoves = 9;
    let draw = false;

    const resetPlayers = () => {
        player1.moves = [];
        player2.moves = [];
        player1.winner = false;
        player2.winner = false;
        computer.moves = [];
        computer.winner = false;
    };

    return {
        boxContent,
        winConditions,
        player1,
        player2,
        computer,
        playVsComputer,
        player1Turn,
        moveCounter,
        draw,
        endGame,
        totalMoves,
        resetPlayers
    };
})();

const game = (() => {
    const modeSwitch = () => {
        gameBoard.playVsComputer = !gameBoard.playVsComputer;
        //on mode swtich reset everything and start a new game
        newGame();
    };

    const markBox = chosenBox => {
        //prevent the player from choosing an already marked box
        if (gameBoard.boxContent[chosenBox] !== '') {
            return;
        }

        if (gameBoard.player1Turn === true && !gameBoard.playVsComputer) {
            gameBoard.boxContent[chosenBox] = gameBoard.player1.marker;
            gameBoard.player1.moves.push(chosenBox);
            gameBoard.player1Turn = false;
        } else {
            gameBoard.boxContent[chosenBox] = gameBoard.player2.marker;
            gameBoard.player2.moves.push(chosenBox);
            gameBoard.player1Turn = true;
        };

        if (gameBoard.playVsComputer) {
            gameBoard.boxContent[chosenBox] = gameBoard.player1.marker;
            gameBoard.player1.moves.push(chosenBox);
            gameBoard.computer.moves.push(computerMarkBox());
        }
    };

    const countMoves = () => {
        if (!gameBoard.playVsComputer) {
            gameBoard.moveCounter = gameBoard.player1.moves.length + gameBoard.player2.moves.length;
        } else {
            gameBoard.moveCounter = gameBoard.player1.moves.length + gameBoard.computer.moves.length;
        };
    };

    const computerMarkBox = () => {
        let freeBoxes = [];
        gameBoard.boxContent.forEach((box, index) => {
            if (box === '') {
                freeBoxes.push(index);
            };
        });
        let computerChoice = freeBoxes[Math.floor(Math.random() * freeBoxes.length)];
        gameBoard.boxContent[computerChoice] = gameBoard.computer.marker;
        return computerChoice.toString();
    };

    const checkDraw = () => {
        //if all available moves are made and there is still no winner game is draw
        if (gameBoard.moveCounter === gameBoard.totalMoves && (!gameBoard.player1.winner && !gameBoard.player2.winner && !gameBoard.computer.winner)) {
            gameBoard.draw = true;
            gameBoard.endGame = true;
        };
    };

    const checkWinner = () => {
        gameBoard.winConditions.forEach(condition => {
            if (condition.every(move => gameBoard.player1.moves.includes(move))) {
                gameBoard.player1.winner = true;
            };
            if (condition.every(move => gameBoard.player2.moves.includes(move))) {
                gameBoard.player2.winner = true;
            };
            if (condition.every(move => gameBoard.computer.moves.includes(move))) {
                gameBoard.computer.winner = true;
            }
        });
    };

    const checkGameEnd = () => {
        if (gameBoard.player1.winner || gameBoard.player2.winner || gameBoard.computer.winner || gameBoard.draw) {
            gameBoard.endGame = true;
        };
    };

    const play = (chosenBox) => {
        if (!gameBoard.endGame) {
            markBox(chosenBox);
            countMoves();
            checkWinner();
            checkGameEnd();
            checkDraw();
        };
    };

    const resetGameboard = () => {
        gameBoard.player1Turn = true;
        gameBoard.endGame = false;
        gameBoard.moveCounter = 0;
        gameBoard.draw = false;
        gameBoard.resetPlayers();
        gameBoard.boxContent.fill('');
    };

    const newGame = () => {
        resetGameboard();
        gameUI.resetGameBoardUI();
    };

    return {
        play,
        modeSwitch,
        newGame //call this function on the html element button onclick
    };
})();

const gameUI = (() => {
    const initMarkBoxes = (gameBoardContainer) => {
        gameBoardContainer.addEventListener('click', (e) => {
            let chosenBox = e.target.id;
            game.play(chosenBox);
            populateGameBoard();
        });
    };

    const populateGameBoard = () => {
        const boxes = document.querySelectorAll('.box');
        gameBoard.boxContent.forEach((markedBox, index) => {
            if (markedBox !== '') {
                boxes[index].textContent = markedBox;
            };
        });
        populateGameStatus();
    };

    const resetGameBoardUI = () => {
        const status = document.querySelector('.game-status');
        status.textContent = 'New game started.';

        const boxes = document.querySelectorAll('.box');
        boxes.forEach(box => {
            box.textContent = '';
        });
    };

    const initChangeNameBtns = () => {
        const changeNameBtns = document.querySelectorAll('div.players input[type="button"]');

        changeNameBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (e.target.id === 'p1-name-btn') {
                    const p1NameLabel = document.querySelector('div.player1 label');
                    const nameTextField = document.getElementById('player1-name');
                    if (nameTextField.value !== '') {
                        p1NameLabel.textContent = nameTextField.value;
                        gameBoard.player1.name = p1NameLabel.textContent;
                        nameTextField.value = '';
                    };
                };

                if (e.target.id === 'p2-name-btn') {
                    const p2NameLabel = document.querySelector('div.player2 label');
                    const nameTextField = document.getElementById('player2-name');
                    if (nameTextField.value !== '') {
                        p2NameLabel.textContent = nameTextField.value;
                        gameBoard.player2.name = p2NameLabel.textContent;
                        nameTextField.value = '';
                    };
                };
                //if Player's name is changed, change the game status default Player 1 name text to the changed name
                populateGameStatus();
            });
        });
    };

    const populateGameStatus = () => {
        const p1name = gameBoard.player1.name;
        const p2name = gameBoard.player2.name;
        const status = document.querySelector('.game-status');
        if (gameBoard.endGame) {
            if (gameBoard.draw) {
                status.textContent = 'Game is Draw';
            } else if (gameBoard.player1.winner) {
                status.textContent = `${p1name} is the winner`;
            } else if (gameBoard.player2.winner) {
                status.textContent = `${p2name} is the winner`;
            } else if (gameBoard.computer.winner) {
                status.textContent = `The Computer is the winner`;
            };
            return;
        };

        if (gameBoard.player1Turn) {
            status.textContent = `${p1name}'s turn.`;
        } else {
            status.textContent = `${p2name}'s turn.`;
        };
    };

    const switchUImode = () => {
        const switchModeBtn = document.querySelector('.mode');
        const player2panel = document.querySelector('.player2');
        const computerPanel = document.querySelector('.computer')
        if (gameBoard.playVsComputer === false) {
            switchModeBtn.textContent = 'Play vs Computer';
            player2panel.style.visibility = 'visible';
            computerPanel.style.visibility = 'hidden';
        } else {
            switchModeBtn.textContent = 'Play 1 vs 1';
            player2panel.style.visibility = 'hidden';
            computerPanel.style.visibility = 'visible';
        };
    };

    const render = (gameBoardContainer) => {
        initMarkBoxes(gameBoardContainer);
        initChangeNameBtns();
    }

    return {
        render,
        resetGameBoardUI,
        switchUImode
    }
})();

function init() {
    const gameBoardContainer = document.querySelector('.gameBoard');
    gameUI.render(gameBoardContainer);
}
init();