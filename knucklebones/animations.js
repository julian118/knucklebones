
let animations = {
animateMove : async function(row, randomNumber) {
        
    // fetch the new block from the HTML and give it the classname of the new position
    let animation = document.getElementById('nextItem')
    animation.className = 'nextItem'
    animation.innerHTML = this.previousNumber
    xAxes = [-6.25, 0, 6.25]            // x&y positions of the 9 elemnts
    yAxes = [-21.4, -15.2, -8,8]
    animation.style.transform = 
    'translateX('
    + xAxes[row]+ 'rem) translateY('              //translateX value depends on the row
    + yAxes[this.board[1][row].length] + 'rem)'   //translateY value depends on the amount of items in the game
    
    //sleep for .2s so the css moves the block to the corect position
    await sleep(200)

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
}
}