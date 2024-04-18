const Util ={
    prin2DArray:function(grid){
        for(let i=0;i<grid.length;i++){
            console.log(...grid[i]);
        }
        console.log();
    },
};

export {Util};