import bot from './bot.js';

document.addEventListener("keyup", function(e) {
    let direction = null;

    if(e.keyCode === 38) {
        game.add(0, bot.calculateMove(game.board[0],game.board[1],'easy'))

    }
})

let game = {
    lowest : 1,
    highest : 6,
    mainContainer : document.getElementById('boardSquare'),
    fieldElement1 : document.getElementById('board1'),
    fieldElement2 : document.getElementById('board2'),
    previousRandomNumber : getRandomInt(1, 6),
    parentBoards : document.querySelectorAll('div#mainContainer div.board'),
    transitionTime : 200,
    board : [
        [
            [],
            [],
            []
        ],
        [
            [],
            [],
            []
        ]
    ],
    doubleBoard : [
        [
            [],
            [],
            []
        ],
        [
            [],
            [],
            []
        ]
    ],

    setup : function() { 

        //just makes the rows clickable
        this.fieldElement1.children[0].addEventListener('click', function() {game.add(0, 0)})
        this.fieldElement1.children[1].addEventListener('click', function() {game.add(0, 1)})
        this.fieldElement1.children[2].addEventListener('click', function() {game.add(0, 2)})
        this.fieldElement2.children[0].addEventListener('click', function() {game.add(1, 0)})
        this.fieldElement2.children[1].addEventListener('click', function() {game.add(1, 1)})
        this.fieldElement2.children[2].addEventListener('click', function() {game.add(1, 2)})

       //the very first previeuw of the next block
       let nextItem = document.createElement('div')
        nextItem.innerHTML =  this.previousRandomNumber // starts as a random number, 
        nextItem.className = 'nextItem'
        nextItem.id = 'nextItem'
        this.mainContainer.appendChild(nextItem)
    },
    setGameMode : function() {
       let gamemode = getUrlVariable('gamemode')
        console.log(gamemode)
    },
    add : async function (board, row, number) {
        if (number) {
            this.previousRandomNumber = number
        }
        if (this.board[board][row].length >= 3) { //check if row is full, if full returns false and end the function
            return false
        } 

        //create a random number
        let randomNumber;
        
        randomNumber = getRandomInt(this.lowest, this.highest)
        
        
        //create animation for moving to the correct position
        await this.animateMove(row, randomNumber)

        // create the real item
        let newItem = document.createElement('div')
        newItem.innerHTML = this.previousRandomNumber

        this.board[board][row].push(this.previousRandomNumber) // add it to the array
        this.doubleBoard[board][row].push(this.previousRandomNumber) // add it to the array with multiplied values

        newItem.className = 'item'
        this.parentBoards[board].children[row].appendChild(newItem)
        
       
        let oppositeBoard = 1 - board // turns the board into0 the opposite

        this.removeNumber(oppositeBoard, row, this.previousRandomNumber)

        // change random number
        this.previousRandomNumber = randomNumber

        // add to the board array array array - sorry lol :)

        if (this.board[1][0].length >= 3 
            && this.board[1][1].length >= 3 
            && this.board[1][2].length >= 3) {
                await sleep (100)
                alert('FULL BOARD')
        }

        this.highlightDoubles(board,row)
        this.countBoard()
         
    },
    animateMove : async function(row, randomNumber) {
        
        // fetch the new block from the HTML and give it the classname of the new position
        let animation = document.getElementById('nextItem')
        
        // create a new block for at the bottom of the page
        let nextItem = document.createElement('div')
        
        nextItem.innerHTML =  randomNumber // RANDOM!!!
        nextItem.className = 'nextItem'
        nextItem.id = 'nextItem'
        nextItem.style.opacity = 0

        // after it has moved remove the animation classname and turn it into a normal block
        animation.outerHTML = ''
        this.mainContainer.appendChild(nextItem)
        nextItem.style.opacity = 1
    },
    countBoard : function() {
        for (let i=0; i < this.board.length; i++) { // looping all arrays in game
            let boardTotal = 0
            for (let j=0; j < this.board[i].length; j++) {
                if (game.board[i][j]) {
                    for(let k=0; k < this.doubleBoard[i][j].length; k++) {
                        if (game.doubleBoard[i][j][k]) {
                            //this.doubleBoard[i][j][k] *= 2
                        }
                    }
                    
                    // adds all numbers in the array together
                    let rowTotal = this.doubleBoard[i][j].reduce((partialSum, a) => partialSum + a, 0) 
                    
                    boardTotal+= rowTotal // add it to the board total

                    let numbers = document.querySelectorAll('div#mainContainer div.rowTotal')
                    numbers[i].children[j].innerHTML = rowTotal // add the row total to the list element above
                }
            }
            let totalElement = document.querySelectorAll('div#mainContainer div.boardTotal') // added rowtotals to the corresponding board total
            totalElement[i].innerHTML = 'total: ' + boardTotal
        }
    },
    removeNumber : async function(board, row,number) {
        let targetRow = this.board[board][row]
        let removedNumbers = 0
        //loops to see if the row has the number
        for (let i = 0; i<=targetRow.length;) { 
            if (targetRow[i] == number || targetRow[i] == (0 - number)) { // if it is the number we want remove
                let targetChild = game.parentBoards[board].children[row].children[i]

                this.doubleBoard[board][row].splice(i,1) // remove the number from the board array with multiplied values
                targetRow.splice(i,1) // remove the number from the board array

                targetChild.style.height = 0
                //targetChild.style.transform = translateY
                targetChild.style.color = 'transparent'

                await sleep(this.transitionTime)
                
                targetChild.outerHTML = '' //removes the corrsponing element
  
                removedNumbers+=1 // so the for-loop goes back one item after removing one item
                
            } else  {
                i++
            }
            
        } 
        this.countBoard()
        
    },
    // game.removeNumber(1,1,0)
    highlightDoubles : async function(board, row) {

        let targetRow = this.board[board][row]
        let duplicateNumber = findDuplicates(targetRow)
        duplicateNumber = duplicateNumber[0]

        //run the for loop for every child in board ---> row
        let childElements = game.parentBoards[board].children[row].children

        for(let i=0; i<childElements.length; i++) {
            if (childElements[i].innerHTML == duplicateNumber) {
                childElements[i].classList.add('doubleItem')
                
                if (this.doubleBoard[board][row][i] == targetRow[i] || (targetRow[i] *2)) { // check if they have already been doubled
                    game.doubleBoard[board][row][i] *= 2 // sets the item in the paralel board array to true so in countboard() the value gets multiplied
                }
                
            }
           
        }
        
    }
    // game.highlightDoubles(1,1)
}





// basic functions
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const findDuplicates = (arr) => {
    let sorted_arr = arr.slice().sort() //  the comparing function here. 

    // JS by default uses a crappy string compare.
    // (we use slice to clone the array so the
    // original array won't be modified)

    let results = [];

    if(sorted_arr.length <= 1) {
        
        results = []
        return results
        
    }
    
    for (let i = 0; i < sorted_arr.length - 1; i++) {
        if (sorted_arr[i + 1] == sorted_arr[i]) {
          results.push(sorted_arr[i])
        }
      }
    
     if (results.length >= 2) {
        results = findDuplicates(results)  
    }
    return results
  }
function getUrlVariable(variableName) {
    var url_string = window.location.href
    var url = new URL(url_string)  
    return url.searchParams.get(variableName)
}
game.setup()
game.setGameMode()