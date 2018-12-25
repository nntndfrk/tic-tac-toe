export default class Game {

    constructor(board, gameInfo, restartButton) {
        this.board = board;
        this.gameInfo = gameInfo;
        this.restartButton = restartButton;
        this.xIsNext = true;
        this.squares = [
            Array(3).fill(null),
            Array(3).fill(null),
            Array(3).fill(null),
        ];
        this.winnerMatrix = [
            [[0,0], [0,1], [0,2]],
            [[1,0], [1,1], [1,2]],
            [[2,0], [2,1], [2,2]],
            [[0,0], [1,0], [2,0]],
            [[0,1], [1,1], [2,1]],
            [[0,2], [1,2], [2,2]],
            [[0,0], [1,1], [2,2]],
            [[0,2], [1,1], [2,0]],
        ];
        this.boardHandler = null;
        this.resetHandler = null;
    }

    init() {
        this.xIsNext = true;
        this.boardHandler = ({target: button}) => {
            let index = button.getAttribute('data-index');
            let [row, column] = index.split(':');

            if (this.squares[row][column]) return;
                this.squares[row][column] = this.xIsNext
                    ? 'X'
                    : 'O';

            this.xIsNext = !this.xIsNext;
            this.renderPressedSquare(row, column);
            this.renderGameInfo();
            this.checkWinner();
        };

        this.resetHandler = () => {
            this.squares = [
                Array(3).fill(null),
                Array(3).fill(null),
                Array(3).fill(null),
            ];
            this.restartButton.removeEventListener('click', this.resetHandler);
            this.init();
        };

        this.initListeners();
        this.renderAllSquares();
        this.renderGameInfo();
    }

    renderPressedSquare(row, column) {
        let pressedSquare = document.querySelector(`[data-index='${row}:${column}']`);
        pressedSquare.innerText = this.squares[row][column];
    }

    renderAllSquares() {
        [...this.board.children].forEach(boardRow => {
            [...boardRow.children].forEach(button => {
                let row = +button.getAttribute('data-row');
                let column = +button.getAttribute('data-column');
                button.innerText = this.squares[row][column];
            })
        });
    }

    renderGameInfo() {
        this.gameInfo.innerText = this.xIsNext
            ? 'Next player: X'
            : 'Next player: O';
    }

    renderWinner(winner) {
        switch (winner) {
            case 1:
                this.gameInfo.innerText = 'Winner: X';
                break;
            case 2:
                this.gameInfo.innerText = 'Winner: O';
                break;
            case 3:
                this.gameInfo.innerText = 'Nobody\'s';
        }
    }

    calculateWinner() {
        for (let winnerLine of this.winnerMatrix) {
            let valueList = [];
            for (let [y, x] of winnerLine) {
                valueList.push(this.squares[y][x]);
            }

            if (valueList.every(value => value === 'X')) {
                return 1;
            } else if (valueList.every(value => value === 'O')) {
                return 2;
            }
        }

        if (this.squares.flat().every(sq => sq)) {
            return 3;
        }
    }

    checkWinner() {
        let winner = this.calculateWinner();
        if (winner) {
            this.renderWinner(winner);
            this.board.removeEventListener('click', this.boardHandler);
        }
    }

    initListeners() {
        this.board.addEventListener('click', this.boardHandler);
        this.restartButton.addEventListener('click', this.resetHandler);
    }
}