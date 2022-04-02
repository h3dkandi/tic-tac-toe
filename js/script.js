const PlayerFactory = (name, marker) => {

    return {
        name,
        marker
    };
};

const gameBoard = (() => {
    const boxContent = [
        'X', 'X', 'O',
        '', '', '',
        '', '', 'X'
    ];

    const player1 = PlayerFactory('ivan', 'X');
    const player2 = PlayerFactory('misho', 'O');

    return {
        boxContent,
        player1,
        player2
    };
})();

const game = (() => {
    let player1Turn = true;
    const markBox = chosenBox => {
        //prevent the player from choosing an already marked box
        if (gameBoard.boxContent[chosenBox] !== '') {
            return;
        }

        if (player1Turn === true) {
            gameBoard.boxContent[chosenBox] = gameBoard.player1.marker;
            player1Turn = false;
        } else {
            gameBoard.boxContent[chosenBox] = gameBoard.player2.marker;
            player1Turn = true;
        }
    };

    return {
        markBox,
    };
})();

const renderGameBoard = (() => {
    const boxes = document.querySelectorAll('.box');
    gameBoard.boxContent.forEach((box, index) => {
        if (box !== '') {
            boxes[index].textContent = box;
        }
    })
})();