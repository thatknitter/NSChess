$(function(){
});

function Game(){
  this.grid = [];
  for (i = 0; i < 8; i++) {
    this.grid[i] = [];
    for (j = 0; j < 8; j++) {
      this.grid[i][j] = 0;
    }
  }
  return this;
}
