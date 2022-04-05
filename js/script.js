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

const game = (() => {
    let player1Turn = true;
    let active = true;
    let moveCounter = 0;
    let draw = false;

    const markBox = chosenBox => {
        //prevent the player from choosing an already marked box
        if (gameBoard.boxContent[chosenBox] !== '') {
            return;
        }

        moveCounter++;

        if (player1Turn === true) {
            gameBoard.boxContent[chosenBox] = gameBoard.player1.marker;
            gameBoard.player1.moves.push(chosenBox);
            player1Turn = false;
        } else {
            gameBoard.boxContent[chosenBox] = gameBoard.player2.marker;
            gameBoard.player2.moves.push(chosenBox);
            player1Turn = true;
        }
    };

    const play = () => {
        const gameBoardContainer = document.querySelector('.gameBoard');
        gameBoardContainer.addEventListener('click', (e) => {
            if (active === true) {
                let chosenBox = e.target.id;
                markBox(chosenBox);
                checkWinner();
                renderGameBoard.render();
            };
        });
    };

    const checkWinner = () => {
        gameBoard.winConditions.forEach(condition => {
            if (condition.every(move => gameBoard.player1.moves.includes(move))) {
                gameBoard.player1.winner = true;
                active = false;
                console.log('plyaer 1 wins');
            }
            if (condition.every(move => gameBoard.player2.moves.includes(move))) {
                gameBoard.player2.winner = true;
                active = false;
                console.log('player 2 wins');
            }
        })
    }
    //if all available moves are made and there is still no winner game is draw
    if (moveCounter === 9) {
        draw = true;
    }

    return {
        play
    };
})();

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

    const player1 = PlayerFactory('ivan', 'X');
    const player2 = PlayerFactory('misho', 'O');

    game.play();

    return {
        boxContent,
        winConditions,
        player1,
        player2
    };
})();

const renderGameBoard = (() => {
    const boxes = document.querySelectorAll('.box');
    const render = () => gameBoard.boxContent.forEach((markedBox, index) => {
        if (markedBox !== '') {
            boxes[index].textContent = markedBox;
        }
    });

    return {
        render
    }
})();