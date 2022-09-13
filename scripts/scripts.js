const Player = (name) => {
    const getName = () => name
    const setName = (newName) => name = newName
 
    return {getName, setName}
}

const ControlMoves = (() => {
    let turn = 0

    const getTurn = () => turn
    const addTurn = () => turn++
    const resetTurn = () => turn = 0

    const checkWin = (gameArray, compareArray, player) => {
        return compareArray.some((part) => part.every((digit) => gameArray[digit] == player))
    }

    const checkTie = (gameArray) => {
        return gameArray.every((cell) => cell != "")
    }

    const resetBoard = (gameArray, nodeList) => {
        for (let i = 0; i < gameArray.length; i++) {
            if (gameArray[i] != "") {
                nodeList[i].classList.remove(gameArray[i])
            }
            gameArray[i] = "";
        }
    }
    return {getTurn, addTurn, resetTurn, checkWin, checkTie, resetBoard}
})()

const Gameboard = (() => {
    let gameArr  = ["", "", "",
                    "", "", "",
                    "", "", ""]

    let winCombinations = [ [0,1,2],
                            [3,4,5],
                            [6,7,8],
                            [0,3,6],
                            [1,4,7],
                            [2,5,8],
                            [0,4,8],
                            [2,4,6]]
    // this allows moves for the user if true
    let check = false

    let gameboard = document.querySelector(".grid-container")
    let cells = document.querySelectorAll(".grid-cell")
    let winMessage = document.querySelector(".player-win");
    
    let boardMoves = ControlMoves
    const humanPlayer = "o"
    const aiPlayer = "x"

    let player1 = Player()
    let player2 = Player()

    function minimax (board, depth, isMaximizing) {
        if (boardMoves.checkWin(gameArr, winCombinations, aiPlayer)){
            return 10 - depth;
        }
        else if (boardMoves.checkWin(gameArr, winCombinations, humanPlayer)){
            return -10 - depth;
        }
        else if (boardMoves.checkTie(gameArr)) {
            return 0;
        }

        if (isMaximizing) {
          let bestScore = -1000
          for (let i = 0; i < board.length; i++) {
              if (board[i] == "") {
                board[i] = aiPlayer
                let score = minimax(bestScore, depth + 1, true)
                bestScore = Math.max(bestScore, score)
                board[i] = ""
              }         
          }
          return bestScore
        } else {
          let bestScore = 1000
          for (let i = 0; i < board.length; i++) {
              if (board[i] == "") {
                board[i] = humanPlayer
                let score = minimax(bestScore, depth + 1, false)
                bestScore = Math.min(bestScore, score)
                board[i] = ""
            }
          }
          return bestScore
        }
    }

    function bestMove() {
        // AI to make its turn
        let bestScore = -Infinity;
        let move;
        for (let i = 0; i < gameArr.length; i++) {
            // Is the spot available?
            if (gameArr[i] == '') {
                gameArr[i] = aiPlayer;
                let score = minimax(gameArr, 0, false);
                gameArr[i] = '';
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                    }
                }
            }
            console.log(move)
            return move
        }

    const controlBoard = () => cells.forEach(cell => cell.addEventListener("click", () => {
        if (gameArr[cell.dataset.value] == "" && check == false){
            gameArr[cell.dataset.value] = boardMoves.getTurn() % 2 == 0 ? "o" : "x"
            boardMoves.addTurn()
            
            for (let i = 0; i < gameArr.length; i++) {
                if (gameArr[i] != "") {
                    cells[i].classList.add(gameArr[i])
                }
            }

        if (boardMoves.checkWin(gameArr, winCombinations, "o")) {
            winMessage.innerHTML = player1.getName() + " wins!"
            winMessage.style.display = "flex"
            check = true
        } else if (boardMoves.checkWin(gameArr, winCombinations, "x")) {
            winMessage.innerHTML = player2.getName() + " wins!"
            winMessage.style.display = "flex"
            check = true
        } else if (boardMoves.checkTie(gameArr)) {
            winMessage.innerHTML = "Tie!"
            winMessage.style.display = "flex"
            check = true
            }
        }
    }))

    const boardAI = () => cells.forEach(cell => cell.addEventListener("click", () => {
        if (gameArr[cell.dataset.value] == "" && check == false){
            gameArr[cell.dataset.value] = "o"
            boardMoves.addTurn()           
            
                let optimalMove = bestMove()       
                gameArr[optimalMove] = "x"

            for (let i = 0; i < gameArr.length; i++) {
                if (gameArr[i] != "") {
                    cells[i].classList.add(gameArr[i])
                }
            }

            if (boardMoves.checkWin(gameArr, winCombinations, "o")) {
                winMessage.innerHTML = player1.getName() + " wins!"
                winMessage.style.display = "flex"
                check = true
            } else if (boardMoves.checkWin(gameArr, winCombinations, "x")) {
                winMessage.innerHTML = "The computer wins!"
                winMessage.style.display = "flex"
                check = true
            } else if (boardMoves.checkTie(gameArr)) {
                winMessage.innerHTML = "Tie!"
                winMessage.style.display = "flex"
                check = true
                }
            }
    }))

    const playerAI = document.querySelector("#ai-player")
    const playButton = document.querySelector("#play-btn")
    const playerSelection = document.querySelector("#players")
    const resetButton = document.querySelector("#reset")
    const inputPlayer1 = document.querySelector("#player1")
    const inputPlayer2 = document.querySelector("#player2")
    const playersContainer = document.querySelector(".player-container")

    const resetGame = () => resetButton.addEventListener("click", () => {
        boardMoves.resetBoard(gameArr, cells)
        winMessage.style.display = "none"
        winMessage.innerHTML = ""
        check = false
    })

    let twoPlayers;

    const playersButton = () => playerSelection.addEventListener("click", () => {
        playersContainer.style.display = "flex";
        inputPlayer2.style.display = "flex"
        playButton.style.display = "flex"  
        twoPlayers = true; 
    })

    const aiButton = () => playerAI.addEventListener("click", () => {  
        playersContainer.style.display = "flex";
        inputPlayer1.style.display = "flex"  
        inputPlayer2.style.display = "none"
        playButton.style.display = "flex" 
        twoPlayers = false;
    })

    const playGame = () => playButton.addEventListener("click", () => {
        playersContainer.style.display = "none"
        playButton.style.display = "none" 
        playerSelection.style.display = "none"  
        playerAI.style.display = "none"
        player1.setName(inputPlayer1.getElementsByTagName("input")[0].value)
        player2.setName(inputPlayer2.getElementsByTagName("input")[0].value)  
        gameboard.style.display = "grid"  
        resetButton.style.display = "flex"
        if (twoPlayers) {
            controlBoard()
        } else {
            boardAI()  
        }
    })

    return {controlBoard, boardAI, resetGame, playersButton, playGame, aiButton}
})()

Gameboard.playersButton()
Gameboard.aiButton()
Gameboard.resetGame()
Gameboard.playGame()

