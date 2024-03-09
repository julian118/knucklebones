
let bot = {
    calculateMove : function(botGrid, playerGrid, nextNumber, level) {
        switch (level) {
            case 'easy':

                var nums = [0,1,2],
                ranNums = [],
                length = nums.length,
                j = 0;

                while (length--) {
                    j = Math.floor(Math.random() * (length+1));
                    ranNums.push(nums[j]);
                    nums.splice(j,1);
                }
                console.log(ranNums)
                for(let i = 0; i < 3; i++) {
                    console.log(i)
                    if (botGrid[ranNums[i]].length <= 2) {
                            return ranNums[i]
                    }  
                }
                alert('full board')
                return 
            case 'medium':
                
            case 'hard':
            
        }
                
    },

    random : function(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
export default bot