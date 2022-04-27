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

    let player1Turn = true;
    let endGame = false;
    let moveCounter = 0;
    const totalMoves = 9;
    let draw = false;

    return {
        boxContent,
        winConditions,
        player1,
        player2,
        player1Turn,
        moveCounter,
        draw,
        endGame,
        totalMoves
    };
})();

const game = (() => {
    const markBox = chosenBox => {
        //prevent the player from choosing an already marked box
        if (gameBoard.boxContent[chosenBox] !== '') {
            return;
        }

        gameBoard.moveCounter++;

        if (gameBoard.player1Turn === true) {
            gameBoard.boxContent[chosenBox] = gameBoard.player1.marker;
            gameBoard.player1.moves.push(chosenBox);
            gameBoard.player1Turn = false;
        } else {
            gameBoard.boxContent[chosenBox] = gameBoard.player2.marker;
            gameBoard.player2.moves.push(chosenBox);
            gameBoard.player1Turn = true;
        }
    };

    const checkDraw = () => {
        //if all available moves are made and there is still no winner game is draw
        if (gameBoard.moveCounter === gameBoard.totalMoves && (!gameBoard.player1.winner || !gameBoard.player2.winner)) {
            gameBoard.draw = true;
            gameBoard.endGame = true;
        };
    };

    const checkWinner = () => {
        gameBoard.winConditions.forEach(condition => {
            if (condition.every(move => gameBoard.player1.moves.includes(move))) {
                gameBoard.player1.winner = true;
                console.log('plyaer 1 wins');
            }
            if (condition.every(move => gameBoard.player2.moves.includes(move))) {
                gameBoard.player2.winner = true;
                console.log('player 2 wins');
            }
        })
    }

    const checkGameEnd = () => {
        if (gameBoard.player1.winner || gameBoard.player2.winner || gameBoard.draw) {
            gameBoard.endGame = true;
        };
    };

    const play = (chosenBox) => {
        if (!gameBoard.endGame) {
            markBox(chosenBox);
            checkWinner();
            checkGameEnd();
            checkDraw();
        };
    };

    return {
        play
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
            }
            return;
        };

        if (gameBoard.player1Turn) {
            status.textContent = `${p1name}'s turn`;
        } else {
            status.textContent = `${p2name}'s turn`;
        };
    };

    const render = (gameBoardContainer) => {
        initMarkBoxes(gameBoardContainer);
        initChangeNameBtns();
    }

    return {
        render
    }
})();

function init() {
    const gameBoardContainer = document.querySelector('.gameBoard');
    gameUI.render(gameBoardContainer);
}
init();