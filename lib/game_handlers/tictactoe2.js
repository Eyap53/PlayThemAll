class TicTacToe {
    constructor() {

    }

    getCurrentPlayerSymbol() {
		//should return `x` or `o`

    }

    nextTurn(rowIndex, columnIndex) {
		//should properly update class state (change current player, update marks storage etc.)

    }

    isFinished() {
		//should return true if game is finished (e.g. there is a winner or it is a draw)

    }

    getWinner() {
		//should return winner symbol (`x` or `o`) or null if there is no winner yet

    }

    noMoreTurns() {
		//should return true if there is no more fields to place a `x` or `o`

    }

    isDraw() {
		//should return true if there is no more turns and no winner

    }

    getFieldValue(rowIndex, colIndex) {
		//should return `matrix[row][col]` value (if any) or `null`

    }
}

module.exports = TicTacToe;
