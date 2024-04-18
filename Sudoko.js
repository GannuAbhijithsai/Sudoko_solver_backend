// sudoku.js

// Helper function
 function isvalidplace(grid, row, col, guess) {
    for(let i=0;i<9;i++){
        if(grid[i][col]===guess){
          return false;
        }
     }
     for(let i=0;i<9;i++){
      if(grid[row][i]==guess){
        return false;
      }
   }
   let localBoxRow=row-(row%3);
   let localBoxCol=col-(col%3);
   for(let i=localBoxRow;i<localBoxRow+3;i++){
      for(let j=localBoxCol;j<localBoxCol+3;j++){
          if(grid[i][j]===guess){
              return false;
          }
      }
   }
   return true;
  }
  
  // Solving function
  function solve(grid) {
    for(let row=0;row<9;row++){
        for(let col=0;col<9;col++){
            if(grid[row][col]===0){
                for(let guess=1;guess<=9;guess++){
                    if(isvalidplace(grid,row,col,guess)){
                        grid[row][col]=guess;
                        if(solve(grid)){
                             return true;
                        }else{
                            grid[row][col]=0;
                        }
                    }
                }
                return false;
            }
        }
    }
    return true;
  }
  
  // Printing function
   function print2DArray(grid) {
    for(let i=0;i<grid.length;i++){
        console.log(...grid[i]);
    }
    console.log();
  }
  
  // Copying grid function
  function copyGrid(from, to) {
    for(let i=0;i<9;i++){
        to[i]=[...from[i]];
    }
  }
  
  // Puzzle generator function
  function createPuzzle() {
    let puzzle=getRandomSudoku();
   
    solve(puzzle);
    for(let i=0;i<9;i++){
        for(let j=0;j<9;j++){
            if(Math.random()>0.3){
                puzzle[i][j]=0;
            }
        }
    }
    return puzzle;
  }
  
  // Random Sudoku generator function
  function getRandomSudoku() {
    let puzzle=[];
    for(let i=0;i<9;i++){
     puzzle[i]=Array(9).fill(0);
    }
    for(let i=0;i<8;i++){
     let number=Math.floor(Math.random()*8)+1;
       while(!isvalidplace(puzzle,0,i,number)){
         number=Math.floor(Math.random()*8)+1;
       }
       puzzle[0][i]=number;
    }
 return puzzle;
  }
  module.exports = {
    isvalidplace,
    solve,
    createPuzzle,
    copyGrid,
    print2DArray,
  };