$(document).ready(function() {
  
  //chooses the X on the 'left and vanishes the selection screen to display the board
  $("#left").click(function() {
    $("#start-screen, #first").css("visibility", "hidden");
    $(".game-board").removeClass("hide");
    playerPiece = "X";
    aiPiece = "O";
    playerColor = "lime";
    aiColor = "cyan";
  });

  //chooses the O on the 'right' and vanishes the selection screen to display the board
  $("#right").click(function() {
    $("#start-screen, #first").css("visibility", "hidden");
    $(".game-board").removeClass('hide');
    playerPiece = "O";
    aiPiece = "X";
    playerColor = "cyan";
    aiColor = "lime";
  });

  //click events to play the game
  $(".box").click(function() {
    move(this, playerPiece, playerColor);
  });


//variable initializations to be used in the game 
var board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
var playerPiece = "";
var aiPiece = "";
var playerColor = "";
var aiColor = "";
var round = 0;

//function that searches for a winning combination and returns a truthy value if one exists
function winning(board, player) {
  if (
    (board[0] == player && board[1] == player && board[2] == player) ||
    (board[3] == player && board[4] == player && board[5] == player) ||
    (board[6] == player && board[7] == player && board[8] == player) ||
    (board[0] == player && board[3] == player && board[6] == player) ||
    (board[1] == player && board[4] == player && board[7] == player) ||
    (board[2] == player && board[5] == player && board[8] == player) ||
    (board[0] == player && board[4] == player && board[8] == player) ||
    (board[2] == player && board[4] == player && board[6] == player)
  ) {
    return true;
  } else {
    return false;
  }
}
//determines which spots on the board are empty
function avail(reboard) {
  return reboard.filter(s => s != "X" && s != "O");
}

//the AI of the program, determines the best computer move
function minimax(reboard, player) {
  let array = avail(reboard);
  if (winning(reboard, playerPiece)) {
    return {
      score: -10
    };
  } else if (winning(reboard, aiPiece)) {
    return {
      score: 10
    };
  } else if (array.length === 0) {
    return {
      score: 0
    };
  }

  var moves = [];
  for (var i = 0; i < array.length; i++) {
    var move = {};
    move.index = reboard[array[i]];
    reboard[array[i]] = player;
    if (player == aiPiece) {
      var g = minimax(reboard, playerPiece);
      move.score = g.score;
    } else {
      var g = minimax(reboard, aiPiece);
      move.score = g.score;
    }
    reboard[array[i]] = move.index;
    moves.push(move);
  }

  var bestMove;
  if (player == aiPiece) {
    var bestScore = -10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    var bestScore = 10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i; 
      }
    }
  }
  return moves[bestMove];
}

//resets the game board after the game is completed
function reset() {
  round = 0;
  board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  $(".box").css("background-color", "transparent");
  $(".box h1").text("");
}

//outputs each players move and determines the winner of the game
function move(element, player, color) {
  //prevents a used space from being overwritten
  if (board[element.id[6]] != "X" && board[element.id[6]] != "O") {
    round++;
    var selector = "#" + element.id;
    $(selector).css("background-color", color);
    $(selector + " h1").text(player);
    board[element.id[6]] = player;
    console.log(board);

    if (winning(board, player)) {
      setTimeout(function() {
        alert("You win!");
        reset();
      }, 500);
      return;
    } else if (round > 8) {
      setTimeout(function() {
        alert("Tie!"); 
        reset();
      }, 500);
      return;
    } else {
      round++;
      var index = minimax(board, aiPiece).index;
      var selector = "#space-" + index;
      $(selector).css("background-color", aiColor);
      $(selector + " h1").text(aiPiece);
      board[index] = aiPiece;
      console.log(board);
      console.log(index);
      if (winning(board, aiPiece)) {
        setTimeout(function() {
          alert("You lose!");
          reset();
        }, 500);
        return;
      }
    }
  }
}
});