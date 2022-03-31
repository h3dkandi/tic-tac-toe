const PlayerFactory = (name, marker) => {

    return {
        name,
        marker
    };
};

const gameBoard = (() => {
    const box = [
        '', '', '',
        '', '', '',
        '', '', ''
    ];

    const player1 = PlayerFactory('ivan', 'X');
    const player2 = PlayerFactory('misho', 'O');

    return {
        box,
        player1,
        player2
    };
})();

const game = (() => {
    let player1Turn = true;
    const markBox = chosenBox => {
        //prevent the player from choosing an already marked box
        if (gameBoard.box[chosenBox] !== '') {
            return;
        }

        if (player1Turn === true) {
            gameBoard.box[chosenBox] = gameBoard.player1.marker;
            player1Turn = false;
        } else {
            gameBoard.box[chosenBox] = gameBoard.player2.marker;
            player1Turn = true;
        }
    };

    return {
        markBox,
    };
})();