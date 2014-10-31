$(function(){
	var game = new Game();
	var $table = $("table");
	
	$("table").ready(function(){
		game.drawGrid($table);
	$("td").click(function(){
		var coordinates = $(this).attr("id").split(","); 
		var cell = game.grid[+coordinates[1]][+coordinates[0]];
		//is this a piece the player owns? True = calc moves, elseif highlighted space process move
		if(cell.piece && cell.piece.player === game.player){
			game.calcMoves(+coordinates[0], +coordinates[1]);
			console.log("Hey, this does something");
			game.drawGrid($table);
		}else if(cell.highlight){
			game.processMoves(+coordinates[0], +coordinates[1]);
			console.log("this does something different");
			game.drawGrid($table);
		}
	});

});
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
      var piece = startingPiece(j,i);
      this.grid[i][j] = new Cell(j,i,piece);
      if((i+j)%2 === 0) this.grid[i][j].black = true;
    }
  }

  this.selected = null;
  this.player = true;

  this.drawGrid = function(table){
		table.empty();					// clears table 
		for (i = 0; i < 8; i++) {
			var $tr = $('<tr></tr>');
				for (j = 0; j < 8; j++) {
					var $td = $('<td></td>');
					if (this.grid[i][j].black){
						$td.addClass("black");
					}
					if (this.grid[i][j].highlight){
						$td.addClass("highlight");
					}
					if (this.grid[i][j].piece){
						$td.text(this.grid[i][j].piece.name);
						var name = this.grid[i][j].piece.name;
						var nameArray = name.split('-');
					if (nameArray[0] === '1'){
						switch(nameArray[1]){
								case 'p':
									$td.html('&#9817;');
									break;
								case 'r':
									$td.html('&#9814;');
									break;
								case 'kn':
									$td.html('&#9816;');
									break;
								case 'b':
									$td.html('&#9815;');
									break;
								case 'q':
									$td.html('&#9813;');
									break;
								case 'k':
									$td.html('&#9812;');
									break;
						} 
					} else {
							switch(nameArray[1]){
								case 'p':
									$td.html('&#9823;');
									break;
								case 'r':
									$td.html('&#9820;');
									break;
								case 'kn':
									$td.html('&#9822;');
									break;
								case 'b':
									$td.html('&#9821;');
									break;
								case 'q':
									$td.html('&#9819;');
									break;
								case 'k':
									$td.html('&#9818;');
									break;
					}
				}
 			}
      $td.attr('id', j+","+i)
			$tr.append($td);
			}
			table.append($tr);
 	};
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
      case 'kn':
        return knight();
      case 'b':
        return rbq([[1,1],[1,-1],[-1,1],[-1,-1]]);
      case 'q':
        return rbq([[1,1],[1,-1],[-1,1],[-1,-1],
                   [0,1],[0,-1],[1,0],[-1,0]]);
      case 'k':
        return king();
    }

    function king(){
      var result = [];
      for (i = -1; i < 2; i++) {
        for (j = -1; j < 2; j++) {
          if(!(i===0 && j===0))
            pushIfAvailable(result, x+j, y+i);
        }
      }
      return result;
    }

    function pushIfAvailable(result, x, y){
      if(grid[y] && grid[y][x]){
        var cell = grid[y][x];

        if(cell.piece && cell.piece.player !== player)
          result.push(cell);
        else if(!cell.piece)
          result.push(cell);
        else 
          return false;
      }
    }

    function knight(){
      var twos = [2,-2],
          ones = [1,-1],
          result = [];
      for (var i = 0; i < twos.length; i++) {
        for (var j = 0; j < ones.length; j++) {
          pushIfAvailable(result,x+ones[j],y+twos[i]);
          pushIfAvailable(result,x+twos[j],y+ones[i]);
        }
      }
      return result;
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
            grid[y+direction][x+1].piece &&
            grid[y+direction][x+1].piece.player!==player)
              result.push(grid[y+direction][x+1][y]);
        if (grid[y+direction][x-1] &&
            grid[y+direction][x-1].piece &&
            grid[y+direction][x-1].piece.player!==player)
              result.push(grid[y+direction][x-1][y]);
      }
      return result;
    }
    
    function rbq(directions){
      var direction,
          result = [];
      //loop for each direction given
      for (var i = 0; i < directions.length; i++) {
        // take the first direction and for each possible move loop
        direction = directions[i];
        for (var move = 0; move < grid.length - y; move++) {
          var curCell;
          if(grid[y+direction[0]]&&
            grid[y+direction[0]][x+direction[1]]){
            curCell= grid[y+direction[0]][x+direction[1]];
          }
          //if there is no cell to move to break;
          if(!curCell){
            break;
          }
          //if current cell has a friendly piece, break
          //if current cell has an enemy piece, add to moves and break
          else if(curCell.piece){
            if(curCell.piece.player === player){break;}
            else {
              result.push(curCell);
              break;
            }
          }
          //if current cel is empty, add to possible moves and continue
          result.push(curCell);
          direction[0] += directions[i][0];
          direction[1] += directions[i][1];
        }
      }
    return result;
    }
  };


  this.calcMoves = function(x,y){
    //calculates the possible moves for a selected piece,
    //sets highlight to true on possible cells.
    var grid = this.grid, 
        cell = grid[y][x],
        possible = this.possibleMoves(x,y);
    //set the selected piece to the one we are doing 
    //the highlighting for. 
    this.selected = cell;
    for (i = 0; i < possible.length; i++) {
      possible[i].highlight = true;
    }
  };

  this.processMove = function(x,y){
    //moves piece from selected cell (selected) to the 
    //x,y coordinates of the arguments.
    var newCell = this.grid[y][x]; 
    var oldCell = this.selected;
    newCell.piece = oldCell.piece;
    oldCell.piece = undefined;
    newCell.piece.moved = true;
    this.selected = null;
  };
  this.isMated = function(){
    //checks if the current player is in check or checkmate, if so
    //alerts him and selects the king or ends the game.
    var grid = this.grid,
        player = this.player,
        king = findKing(),
        i,j,k,
        checked = false;

    for (i = 0; i < 8; i++) {
      for (j = 0; j < 8; j++) {
        var cell = grid[i][j];
        //for every enemy piece
        if(cell.piece && cell.piece.player !== player){
          //calculate moves and see if king can be hit
          var moves = this.possibleMoves(j,y);
          for (k = 0; k < moves.length; k++) {
            //if it can, set checked to true
            if(moves[k].x === cell.x && moves[k].y === cell.y){
              checked = true;
            }
          }
        }
      }
    }

    if(checked){
      //do more stuff to see if the check is a checkmate
    }

    return checked;

    function findKing(){
      for (i = 0; i < grid.length; i++) {
        for (j = 0; j < grid.length; j++) {
          var cell = grid[i][j];
          if(cell.piece && cell.piece.player === player &&
            cell.piece.name.split('-')[1] === 'k')
              return cell;
        }
      }
    }
  };

  function startingPiece(x, y){
    //returns a Piece if a piece is on the board at
    //the start of a game for a given x:y coordinate
    // example: return new Piece(1-p-1);
    var matrix = [["1-r-1", "1-kn-1", "1-b-1", "1-q", "1-k", "1-b-2", "1-kn-2", "1-r-2"], 
                  ["1-p-1", "1-p-2", "1-p-3", "1-p-4", "1-p-5", "1-p-6", "1-p-7", "1-p-8"], 
                  ["", "", "", "", "", "", "", ""],
                  ["", "", "", "", "", "", "", ""],
                  ["", "", "", "", "", "", "", ""],
                  ["", "", "", "", "", "", "", ""], 
                  ["2-p-1", "2-p-2", "2-p-3", "2-p-4", "2-p-5", "2-p-6", "2-p-7", "2-p-8"], 
                  ["2-r-1", "2-kn-1", "2-b-1", "2-q", "2-k", "2-b-2", "2-kn-2", "2-r-2"]];

    if (matrix[y][x] !== "") {
      return new Piece(matrix[y][x]);
    } else {
        return undefined;
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
  this.player = (this.name!==undefined && this.name.split('-')[0] === '1') ? true : false;

  return this;
}
