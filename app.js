$(function(){
	var game = new Game();
	var $table = $("table");
	game.drawGrid($table);
});


function Game(){
  //@grid: array of Cell objects that contain game data : array
  //@player: current player (true is white, false is black) : bool

  //@selected: the currently selected cell, if any : Cell

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

  this.selected = null;
  this.player = true;

  this.drawGrid = function(table){
		table.empty();					// clears table 
		for (i = 0; i < 8; i++) {
			var $tr = $('<tr></tr>')
				for (j = 0; j < 8; j++) {
					var $td = $('<td></td>')
					if (this.grid[i][j].black){
						$tr.addClass($td);
					}
					if (this.grid[i][j].piece.name{	
						$tr.text("1-p-1");
					}
			table.append($tr);
			}
 		}
 	};	
  this.calcMoves = function(x,y){
    //calculates the possible moves for a selected piece,
    //sets highlight to true on possible cells.
  };

  this.processMove = function(x,y){
    //moves piece from selected cell (selected) to the 
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
  /*@name: name of the piece : string
  //@moved: if the piece has ever been moved : boolean
  //@player: the owner of the piece, true or false : boolean
	//naming of pieces:
	//
	//Player 1 Pieces--
	//1-p-1		pawn 1
	//1-p-2		pawn 2
	//1-p-3		pawn 3
	//1-p-4		pawn 4
	//1-p-5		pawn 5
	//1-p-6		pawn 6
	//1-p-7		pawn 7
	//1-p-8		pawn 8
	//1-r-1		rook, left
	//1-kn-1	knight, left
	//1-b-1		bishop, left
	//1-k			king
	//1-q			queen
	//1-b-2		bishop, right
	//1-kn-2	knight, right
	//1-r-1		rook, right
	//
	//Player 2 Pieces--
	//2-p-1		pawn 1
	//2-p-2		pawn 2
	//2-p-3		pawn 3
	//2-p-4		pawn 4
	//2-p-5		pawn 5
	//2-p-6		pawn 6
	//2-p-7		pawn 7
	//2-p-8		pawn 8
	//2-r-1		rook, left
	//2-kn-1	knight, left
	//2-b-1		bishop, left
	//2-k			king
	//2-q			queen
	//2-b-2		bishop, right
	//2-kn-2	knight, right
	//2-r-1		rook, right*/
	
  this.name = name;
  this.moved = false;

  return this;
}
