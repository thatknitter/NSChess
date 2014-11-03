$(function(){
	var game = new Game();
	var $table = $("table");
	var $option = $("sets");
	$("table").ready(function(){
		game.drawGrid($table);
	$(document).on("click", "td", function(){
		var coordinates = $(this).attr("id").split(","); 
		var cell = game.grid[+coordinates[1]][+coordinates[0]];
		//is this a piece the player owns? 
    //True = calc moves, elseif highlighted space process move
    if(game.mated){
      $('h1').text('Player ' + game.mated + " wins!");
    }
		else if(!cell.highlight && cell.piece && cell.piece.player === game.player){
			game.calcMoves(+coordinates[0], +coordinates[1]);
			game.drawGrid($table);
		}else if(cell.highlight){
			game.processMove(+coordinates[0], +coordinates[1]);
      game.isMated();
			game.drawGrid($table);
      if(game.mated){
        $('h1').text('Player ' + game.mated + " wins!");
      }
		}
	});

});
});	

function Game(){
  //@grid: array of Cell objects that contain game data : array
  //@player: current player (true is white, false is black) : bool
  //@mated: if the mage is at checkmate, this will equal the winning
  //  player, 1 or 2
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
  this.mated = false;
  this.enPassant = false;

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
					if (nameArray[0] === '1' && $option.value === 'default'){
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
				if (option.value === 'breakingBad'){
					if (nameArray[0] === '1'){
						switch(nameArray[1]){
							case 'p':
								createImgTag(/images/breaking_bad/hank_pawn_black.jpg, $td);
								break;
							case 'r':
								createImgTag(/images/breaking_bad/hank_pawn_black.jpg, $td);
								break;
					

 			}


      $td.attr('id', j+","+i);
			$tr.append($td);
			}
			table.append($tr);
 	};


 	function createImgTag(text, td){
		var $image = $('<img></img>');
		$image.attr('src', text);
		$td.append($image);
	};
  
	};
	
	this.possibleMoves = function(x,y){
    // returns an array of cells of possible moves
    // for a piece at a given coordinate
    var grid = this.grid, 
        cell = grid[y][x],
        castling = false, 
        piece = cell.piece,
        player = this.player;

    if (!piece) {return;}

    var possibleMoveArray = [];
    switch(piece.name.split('-')[1]){
      case 'p':
        possibleMoveArray=(pawn(this));
        break;
      case 'r':
        possibleMoveArray = rbq([[0,1],[0,-1],[1,0],[-1,0]]);
        break;
      case 'kn':
        possibleMoveArray = knight();
        break;
      case 'b':
        possibleMoveArray = rbq([[1,1],[1,-1],[-1,1],[-1,-1]]);
        break;
      case 'q':
        possibleMoveArray = rbq([[1,1],[1,-1],[-1,1],[-1,-1],
                   [0,1],[0,-1],[1,0],[-1,0]]);
        break;
      case 'k':
        possibleMoveArray = king(this);
        break;
    }
    //make sure none of the possible moves put the king in danger, if
    //so, remove them from the array;
    var arrLength = possibleMoveArray.length;
    for (var i = 0; i < arrLength; i++) {
      var newCell = possibleMoveArray[i],
          swap, 
          safety = true;
      //simulate the move
      swap = newCell.piece;
      newCell.piece = cell.piece;
      //swap the pieces if this is a castling move
      if(castling!==false && newCell.y ===castling && newCell.x ===7)
        cell.piece = swap;
      else
        cell.piece = null;
      //if the king isn't safe, remove move from array
      if(!isKingSafe(this)){
        safety = false;
      }
      //reset the move
      cell.piece = newCell.piece;
      newCell.piece = swap;
      //if it is not safe, splice it out of the array and 
      //set the array length and i back to not break loop
      if (!safety){
        possibleMoveArray.splice(i,1);
        i--;
        arrLength--;
      }
    }

    return possibleMoveArray;


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
    
    function king(game){
      var result = [];
      for (i = -1; i < 2; i++) {
        for (j = -1; j < 2; j++) {
          if(!(i===0 && j===0))
            pushIfAvailable(result, x+j, y+i);
        }
      }
      //Make king be able to castle if rook and king are both
      //unmoved and the empty spaces are free
      var kingY = game.player ? 0 : 7,
          kingRow = game.grid[kingY];
      //if the rook exists and is unmoved
      if(kingRow[7].piece && !kingRow[7].piece.moved &&
        //and both pieces inbetween are vacant
        !kingRow[6].piece && !kingRow[5].piece){
        //push the rook into possible moves
        result.push(kingRow[7]);
        castling = kingY;
      }
      if(kingRow[0].piece && !kingRow[0].piece.moved &&
        //and both pieces inbetween are vacant
        !kingRow[1].piece && !kingRow[2].piece && !kingRow[3].piece){
        //push the rook into possible moves
        result.push(kingRow[0]);
        castling = kingY;
      }
      
      return result;
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
      if (grid[y+direction] && grid[y+direction][x] && !grid[y+direction][x].piece){
        result.push(grid[y+direction][x]);
        if(!piece.moved&&grid[y+direction*2] &&
          grid[y+direction*2][x] &&
          !grid[y+direction*2][x].piece){ 
          result.push(grid[y+direction*2][x]);
        }
      }
      if(grid[y+direction]){
        //Handle sideways attacking
        if (grid[y+direction][x+1] &&
            grid[y+direction][x+1].piece &&
            grid[y+direction][x+1].piece.player!==player)
              {result.push(grid[y+direction][x+1]);}
        if (grid[y+direction][x-1] &&
            grid[y+direction][x-1].piece &&
            grid[y+direction][x-1].piece.player!==player)
              {result.push(grid[y+direction][x-1]);}
        //Handle enPassants
        if (ctx.enPassant && grid[y+direction][x-1] &&
            !grid[y+direction][x-1].piece &&
            grid[y][x-1].piece===ctx.enPassant.piece)
              {result.push(grid[y+direction][x-1]);}
        if (ctx.enPassant && grid[y+direction][x+1] &&
            !grid[y+direction][x+1].piece &&
            grid[y][x+1].piece===ctx.enPassant.piece)
              {result.push(grid[y+direction][x+1]);}
      }
      return result;
    }
    
    function rbq(directions){
      var direction,
          result = [];
      //loop for each direction given
      for (var i = 0; i < directions.length; i++) {
        // take the first direction and for each possible move loop
        direction = directions[i].slice();
        for (var move = 0; move < 8; move++) {
          var curCell=null;
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
    clearHighlight(grid);
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
    // Make a case to swap pieces if castling is happening
    // if the oldCell is a king and the newCell is a rook
    if(oldCell.piece.name.split('-')[1] === 'k' &&
       newCell.piece &&
       newCell.piece.name.split('-')[1] === 'r'){
      //carry out a swapping of pieces if this is a castling move 
      //figure which side the rook is on
      var newKingSpot = newCell.x === 0?2:6,
          castling = newCell.y;
      //move the king two space towards that way
      swap = oldCell.piece;
      oldCell.piece = null;
      this.grid[castling][newKingSpot].piece = swap;
      this.grid[castling][newKingSpot].piece.moved = true;
      //move the rook outside the king
      swap = newCell.piece;
      newCell.piece = null;
      var rookMovement = newKingSpot === 6? -1: +1;
      this.grid[castling][newKingSpot+rookMovement].piece = swap;
    }
    //Otherwise process move as normal.
    else {
      //if the pawn is moving sideways and there is no piece
      //present, it is an enPassant, so kill the enPassant piece;
      if(oldCell.piece.name.split('-')[1] ==='p' &&
        oldCell.x !== newCell.x &&
        !newCell.piece){
        this.enPassant.piece = null;
      }
      //check if this is a pawn's first move and it is moving 2,
      //if so, enPassant should equal the newCell otherwise
      //set enPassant to false;
      var passantDir = this.player ? 2: -2;
      if(oldCell.piece.name.split('-')[1] === 'p' &&
        oldCell.y+passantDir === newCell.y){
        this.enPassant = newCell;
      }else{this.enPassant = false;}
      newCell.piece = oldCell.piece;
      newCell.piece.moved = true;
      oldCell.piece = undefined;
      //Make pawn turn into queen if it has traversed entire board
      var finalRow = this.player ? 7 : 0;
      if(newCell.piece.name.split('-')[1]==='p'&&newCell.y ===finalRow){
        newCell.piece.name = newCell.piece.name.replace('p','q');
      }
    }    
    this.selected = null;
    //clear the highlight and switch the players
    clearHighlight(this.grid);
    this.player = !this.player;
  };

  function clearHighlight(grid){
    for (i = 0; i < 8; i++) {
      for (j = 0; j < 8; j++) {
        grid[i][j].highlight = false;
      }
    }
  }

  this.isMated = function(){
    //checks if the current player is in check or checkmate, if so
    //alerts him and selects the king or ends the game.
    var grid = this.grid,
        player = this.player,
        king = findKing(this),
        i,j,k,
        checkmate = false;


    if(!isKingSafe(this)){
      //do more stuff to see if the check is a checkmate
      this.calcMoves(king.x, king.y);
      $('h1').html('Player ' + (player?1:2) + ' is in check.' );
      checkmate = true;

      //get all the players pieces
      var playersPieces = [];
      for (i = 0; i < 8; i++) {
        for (j = 0; j < 8; j++) {
          var cell = grid[i][j];
          if(cell.piece && cell.piece.player === player ){
            playersPieces.push(cell);
          }
        }
      }
      for (i = 0; i < playersPieces.length; i++) {
      //  loop through the pieces
        var checkMoves = this.possibleMoves(playersPieces[i].x,
                                            playersPieces[i].y),
            swap;
        for (j = 0; j < checkMoves.length; j++) {
          // loop through all the moves that a piece can make
          //apply the move, holding the old piece in swap
          swap = checkMoves[j].piece;
          checkMoves[j].piece = playersPieces[i].piece;
          playersPieces[i].piece = null;
          //see if the king is still in check, if so set checkmate to
          //true
          if(isKingSafe(this)){
            checkmate = false;
          }
          //reset the pieces back to how they were.
          playersPieces[i].piece = checkMoves[j].piece;
          checkMoves[j].piece = swap;
        }
      }
      if(checkmate){
        console.log('checkmate');
        this.mated = !player? 1 : 2;
      }
    }else{
      $('h1').html('Player ' + (this.player?1:2) + "'s turn.");
    }

    return checkmate;
  };

  function isKingSafe(game){
    var king = findKing(game),
        grid = game.grid,
        player = game.player,
        x = king.x, y = king.y;
    //check pawns
    var oppositeDirection = game.player?1:-1,
        oneRowUp = game.grid[king.y+oppositeDirection];
    if(oneRowUp &&
       oneRowUp[king.x+1] &&
       oneRowUp[king.x+1].piece && 
       oneRowUp[king.x+1].piece.player !== player &&
       oneRowUp[king.x+1].piece.name.split('-')[1]==='p')
        return false;
    if(oneRowUp &&
       oneRowUp[king.x-1] &&
       oneRowUp[king.x-1].piece && 
       oneRowUp[king.x-1].piece.player !== player &&
       oneRowUp[king.x-1].piece.name.split('-')[1]==='p')
        return false;
    //check knights
      var twos = [2,-2],
          ones = [1,-1];
      for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 2; j++) {
          if(grid[y+ones[i]] &&
             grid[y+ones[i]][x+twos[j]] &&
             grid[y+ones[i]][x+twos[j]].piece &&
             grid[y+ones[i]][x+twos[j]].piece.player!==player &&
             grid[y+ones[i]][x+twos[j]].piece.name
              .split('-')[1] === 'k')
                {return false;}
          if(grid[y+twos[j]] &&
             grid[y+twos[j]][x+ones[i]] &&
             grid[y+twos[j]][x+ones[i]].piece &&
             grid[y+twos[j]][x+ones[i]].piece.player!==player &&
             grid[y+twos[j]][x+ones[i]].piece.name
              .split('-')[1] === 'k')
                {return false;}
        }
      }
    //check rooks and rook-moving queen
    var directions = [[0,1],[1,0],[-1,0],[0,-1]];
    for (var i = 0; i < 4; i++) {
      var direction = directions[i].slice();
      for (var move = 0; move < 8; move++) {
        var curCell = null;
        if(grid[y+direction[0]] && grid[y+direction[0]][x+direction[1]]){
          curCell = grid[y+direction[0]][x+direction[1]];
        }
        if(!curCell) {break;}
        if(curCell.piece){
          var rqPiece = curCell.piece,
              rqType = rqPiece.name.split('-')[1];
          if(rqPiece.player !== player &&
            (rqType === 'r' || rqType === 'q')){return false;}
          else {break;}
        }
        direction[0] += directions[i][0];
        direction[1] += directions[i][1];
      }
    }
    //check bishops and bishop-moving queens
    directions = [[1,1],[1,-1],[-1,1],[-1,-1]];
    for (var i = 0; i < 4; i++) {
      var direction = directions[i].slice();
      for (var move = 0; move < 8; move++) {
        var curCell = null;
        if(grid[y+direction[0]] && grid[y+direction[0]][x+direction[1]]){
          curCell = grid[y+direction[0]][x+direction[1]];
        }
        if(!curCell) {break;}
        if(curCell.piece){
          var bqPiece = curCell.piece,
              bqType = bqPiece.name.split('-')[1];
          if(bqPiece.player !== player &&
            (bqType === 'b' || bqType === 'q')){return false;}
          else {break;}
        }
        direction[0] += directions[i][0];
        direction[1] += directions[i][1];
      }
    }
    //nothing can hit the king
    return true;
  }

    function findKing(game){
      for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
          var cell = game.grid[i][j];
          if(cell.piece && cell.piece.player === game.player &&
            cell.piece.name.split('-')[1] === 'k')
              return cell;
        }
      }
    }

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
