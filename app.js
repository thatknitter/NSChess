$(function(){
	var game = new Game();
	var $table = $("table");
	game.drawGrid($table);
});


function Game(){
  //@grid: array of Cell objects that contain game data : array
  //@player: current player (true is white, false is black) : bool
<<<<<<< HEAD
  //@selected: the currently selected cell, if any : Cell
=======
  //@sel: the currently selected cell, if any : Cell
>>>>>>> FETCH_HEAD
  //
  this.grid = [];
  for (i = 0; i < 8; i++) {
    this.grid[i] = [];
    for (j = 0; j < 8; j++) {
      //if a piece should exist on start of game insert it
      var piece = startingPiece(i,j);
      this.grid[i][j] = new Cell(i,j,piece);
      if((i+j)%2 === 0) grid[i][j].black = true;
    }
  }
<<<<<<< HEAD
  this.selected = null;
=======
  this.cell = null;
>>>>>>> FETCH_HEAD
  this.player = true;

  this.drawGrid = function(table){
    //Clears the table and
    //draws the grid on the table parameter element
  };

  this.calcMoves = function(x,y){
    //calculates the possible moves for a selected piece,
    //sets highlight to true on possible cells.
  };

  this.processMove = function(x,y){
<<<<<<< HEAD
    //moves piece from selected cell (selected) to the 
=======
    //moves piece from selected cell (sel) to the 
>>>>>>> FETCH_HEAD
    //x,y coordinates of the arguments. Sets sel to 
    //null and removes piece from the selected cell
  };

  this.isMated = function(){
    //checks if the current player is in check or checkmate, if so
    //alerts him and selects the king or ends the game.
  };

  function startingPiece(x,y){
    //returns a Piece if a piece is on the board at
    //the start of a game for a given x:y coordinate
    return new Piece();
  }

<<<<<<< HEAD
=======
  return this;
}

function Cell(x,y,piece){
  //@piece: Piece object if one exists, otherwise null : Piece
  //@x: x coordinate of cell : integer
  //@y: y coordinate of cell : integer
  //@black: true or false if cell is black : bool
  //@highlight: true if cell is highlighted as possible move : bool
  
  this.x = x;
  this.y = y;
  this.piece = piece || null;
  this.black = false;

  return this;
}

function Piece(name){
  //@name: name of the piece : string
  //@moved: if the piece has ever been moved : boolean
  //@player: the owner of the piece, true or false : boolean
  this.name = name;
  this.moved = false;

>>>>>>> FETCH_HEAD
  return this;
}

function Cell(x,y,piece){
  //@piece: Piece object if one exists, otherwise null : Piece
  //@x: x coordinate of cell : integer
  //@y: y coordinate of cell : integer
  //@black: true or false if cell is black : bool
  //@highlight: true if cell is highlighted as possible move : bool
  
  this.x = x;
  this.y = y;
  this.piece = piece || null;
  this.black = false;
  this.highlight = false;

  return this;
}

function Piece(name){
  //@name: name of the piece : string
  //@moved: if the piece has ever been moved : boolean
  //@player: the owner of the piece, true or false : boolean
  this.name = name;
  this.moved = false;

  return this;
}
