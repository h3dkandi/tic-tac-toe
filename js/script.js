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