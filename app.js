$(function(){
	var game = new Game();
	var $table = $("table");
	game.drawGrid($table);
	$("td").click(function(){
		alert("You clicked it!");
	});
	$(".piece").click(Game(calcMoves));
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
      var name = startingPiece(i,j),
          piece;
      if(name)  piece = new Piece(name);
      this.grid[i][j] = new Cell(j,i,piece);
      if((i+j)%2 === 0) this.grid[i][j].black = true;
    }
  }

  this.selected = null;
  this.player = true;

  this.drawGrid = function(table){
    //Clears the table and
    //draws the grid on the table parameter element
  };

  this.possibleMoves = function(x,y){
    // returns an array of cells of possible moves
    // for a piece at a given coordinate
    var grid = this.grid, 
        cell = grid[y][x],
        player = this.player,
        piece = cell.piece;
    if (!piece) {return;}

    switch(piece.name.split('-')[1]){
      case 'p':
        return pawn(this);
      case 'r':
        return rbq([[0,1],[0,-1],[1,0],[-1,0]]);
        break;
      case 'kn':
        break;
      case 'b':
        return rbq([[1,1],[1,-1],[-1,1],[-1,-1]]);
        break;
      case 'q':
        return rbq([[1,1],[1,-1],[-1,1],[-1,-1],[0,1],[0,-1],[1,0],[-1,0]]);
        break;
      case 'k':
        break;
    }


    function pawn(ctx){
      //moving straight forward
      //able to move twice if it is the first move
      var direction = player ? 1 : -1,
          result = [];
      if (grid[y+direction]){
        result.push(grid[y+direction][x]);
        if(!piece.moved&&grid[y+direction*2]){ 
          result.push(grid[y+direction*2][x]);
        }
        //Handle sideways attacking
        if (grid[y+direction][x+1] &&
            grid[y+direction][x+1].piece.player!==player)
              result.push(grid[y+direction][x+1][y]);
        if (grid[y+direction][x-1] &&
            grid[y+direction][x-1].piece.player!==player)
              result.push(grid[y+direction][x-1][y]);
      }
      return result;
    }
    
    function rbq(directions){
      var direction,
          result = [];
      for (i = 0; i < directions.length; i++) {
        direction = directions[i];
        while(grid[y+direction[0]]&&
              highlight(grid[y+direction[0]][x+direction[1]])
             ){

          direction[0] += directions[i][0];
          direction[1] += directions[i][1];
        }
      }
    }

  };

  this.calcMoves = function(x,y){
    //calculates the possible moves for a selected piece,
    //sets highlight to true on possible cells.
    var grid = this.grid, 
        cell = grid[y][x];
    //set the selected piece to the one we are doing 
    //the highlighting for. 
    this.selected = cell;
  };

  //highlight checks if a piece can move to a cell, if so
  //it highlights it. returns false if it hits a piece or 
  //the space oes not exist.
  function highlight(cell, diagonalPawn){
    if (!diagonalPawn){
      if (!cell.piece){
        cell.highlight = true;
        return true;
      }
      else if(cell.piece.player!=player){
        cell.highlight = true;
        return false;
      }
    }
    else if(diagonalPawn&&cell.piece&&cell.piece.player != player){
        cell.highlight = true;
        return true;
    }
    else return false;
  }

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
    // example: return new Piece(1-p-1);
    
    
    if (x === 0 && y === 0) {               // Light side Royal Family
      // White left Rook
      return ("1-r-1");
    } else if (x === 0 && y === 1) {
      // White left Knight
      return ("1-kn-1");
    } else if (x === 0 && y === 2) {
      // White left Bishop
      return ("1-b-1");
    } else if (x === 0 && y === 3) {
      // White Queen
      return ("1-q");
    } else if (x === 0 && y === 4) {
      // White King
      return ("1-k");
    } else if (x === 0 && y === 5) {
      // White right Bishop
      return ("1-b-2");
    } else if (x === 0 && y === 6) {
      // White right Knight
      return ("1-kn-2");
    } else if (x === 0 && y === 7) {
      // White right Rook
      return ("1-r-2");
    } else if (x === 1 && y === 0) {        // Light side Pawns
      // Pawn 1
      return ("1-p-1");
    } else if (x === 1 && y === 1) {
      // Pawn 2
      return ("1-p-2");
    } else if (x === 1 && y === 2) {
      // Pawn 3
      return ("1-p-3");
    } else if (x === 1 && y === 3) {
      // Pawn 4
      return ("1-p-4");
    } else if (x === 1 && y === 4) {
      // Pawn 5
      return ("1-p-5");
    } else if (x === 1 && y === 5) {
      // Pawn 6
      return ("1-p-6");
    } else if (x === 1 && y === 6) {
      // Pawn 7
      return ("1-p-7");
    } else if (x === 1 && y === 7) {
      // Pawn 8
      return ("1-p-8");
    } else if (x === 7 && y === 0) {         // Dark Side Royal Family
      // Dark left Rook
      return ("2-r-1");
    } else if (x === 7 && y === 1) {
      // Dark left Knight
      return ("2-kn-1");
    } else if (x === 7 && y === 2) {
      // Dark left Bishop
      return ("2-b-1");
    } else if (x === 7 && y === 3) {
      // Dark Queen
      return ("2-q");
    } else if (x === 7 && y === 4) {
      // Dark King
      return ("2-k");
    } else if (x === 7 && y === 5) {
      // Dark right Bishop
      return ("2-b-2");
    } else if (x === 7 && y === 6) {
      // Dark right Knight
      return ("2-kn-2");
    } else if (x === 7 && y === 7) {
      // Dark right Rook
      return ("2-r-2");
    } else if (x === 6 && y === 0) {        // Dark side Pawns
      // Pawn 1
      return ("2-p-1");
    } else if (x === 6 && y === 1) {
      // Pawn 2
      return ("2-p-2");
    } else if (x === 6 && y === 2) {
      // Pawn 3
      return ("2-p-3");
    } else if (x === 6 && y === 3) {
      // Pawn 4
      return ("2-p-4");
    } else if (x === 6 && y === 4) {
      // Pawn 5
      return ("2-p-5");
    } else if (x === 6 && y === 5) {
      // Pawn 6
      return ("2-p-6");
    } else if (x === 6 && y === 6) {
      // Pawn 7
      return ("2-p-7");
    } else if (x === 6 && y === 7) {
      // Pawn 8
      return ("2-p-8");
    }
  }
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
  this.name = name?name:undefined;
  this.moved = false;
  this.player = (this.name && this.name.split('-')[0] === '1') ? true : false;

  return this;
}
