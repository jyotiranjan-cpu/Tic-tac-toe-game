// ---------------- Winning patterns ---------------- //
const win_move = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

// ---------------- Variables ---------------- //
let turnon = true; // For PVP turn tracking
let choose_player = null;
let playerSymbol = null;
let computerSymbol = null;
let move_array = [];

const boxes = document.querySelectorAll(".box");
const msg = document.getElementById("msg");
const reset = document.getElementById("reset");
const new_game = document.getElementById("new-game");
const main = document.querySelector("main");
const choice_box = document.querySelector(".choice");
const container_2 = document.getElementById("c2");
const pvp = document.getElementById("btn-pvp");
const pvc = document.getElementById("btn-pvc");
const choice_x = document.getElementById("btn-x");
const choice_o = document.getElementById("btn-o");

main.style.display = "none";

// ---------------- Event Listeners ---------------- //
boxes.forEach((e, index) => {
  e.addEventListener("click", () => {
    if(!choose_player) return;

    if(choose_player === "pvp") handlePVP(e, index);
    else if(choose_player === "pvc") handlePVC(e, index);

    checkwinner();
  });
});

reset.addEventListener("click", function() {
  boxes.forEach(box => {
    box.innerHTML = "";
    box.style.pointerEvents = "all";
  });
  move_array = [];
  turnon = true;
  msg.innerHTML = "";
});

pvp.addEventListener("click", function() {
  choice_logo_display();
  pvp.classList.add("focused");
  pvc.style.pointerEvents = "none";
  choice_box.style.display = "none";
  main.style.display = "flex";
  choose_player = "pvp";
});

pvc.addEventListener("click", function() {
  choice_logo_display();
  pvc.classList.add("focused");
  pvp.style.pointerEvents = "none";
  choose_player = "pvc";
});

choice_x.addEventListener("click", function() {
  choice_logo_display();
  choice_x.classList.add("focused");
  choice_o.style.pointerEvents = "none";
  playerSymbol = "X";
  computerSymbol = "O";
  choice_box.style.display = "none";
  main.style.display = "flex";
  move_array = [];
});

choice_o.addEventListener("click", function() {
  choice_logo_display();
  choice_o.classList.add("focused");
  choice_x.style.pointerEvents = "none";
  playerSymbol = "O";
  computerSymbol = "X";
  choice_box.style.display = "none";
  main.style.display = "flex";
  move_array = [];
});

new_game.addEventListener("click", function() {
  window.location.reload();
});

// ---------------- Functions ---------------- //
function checkwinner() {
  for(const pattern of win_move) {
    const first = boxes[pattern[0]].innerHTML;
    const second = boxes[pattern[1]].innerHTML;
    const third = boxes[pattern[2]].innerHTML;

    if(first && first === second && second === third) {
      messageDisplay(first);
      return;
    }
  }

  // Check for draw
  if(move_array.length >= 9 && !msg.innerHTML) {
    msg.innerHTML = "It's a draw!";
  }
}

function messageDisplay(win) {
  msg.innerHTML = `The winner is ${win}`;
  boxes.forEach(box => box.style.pointerEvents = "none");
}

function choice_logo_display() {
  container_2.style.display = "flex";
}

function auto_generate(prev_move) {
  if(prev_move.length >= 9) return null;
  while (true) {
    const move = Math.floor(Math.random() * 9);
    if (!prev_move.includes(move)) return move;
  }
}

// smart move finder: win > block > random
function findWinningMove(moves, available) {
  for (var i=0;i<win_move.length;i++) {
    var line = win_move[i];
    var takenCount = 0;
    var free = [];
    for (var j=0;j<line.length;j++) {
      var pos = line[j];
      if (moves.indexOf(pos) !== -1) {
        takenCount++;
      } else if (available.indexOf(pos) !== -1) {
        free.push(pos);
      }
    }
    if (takenCount === 2 && free.length === 1) {
      return free[0];
    }
  }
  return null;
}

// ----------- PVP Handler ----------- //
function handlePVP(e, index) {
  if(turnon){
    e.innerHTML = "X"; 
    e.style.color = "blue";
  } else {
    e.innerHTML = "O"; 
    e.style.color = "coral";
  }
  e.style.pointerEvents = "none";
  move_array.push(index);
  turnon = !turnon;
}

// ----------- PVC Handler ----------- //
function handlePVC(e, index) {
  if(!playerSymbol) return;

  // Player move
  e.innerHTML = playerSymbol;
  e.style.color = playerSymbol==="X" ? "blue" : "coral";
  e.style.pointerEvents = "none";
  move_array.push(index);

  checkwinner(); // Check winner before computer moves
  if(move_array.length >= 9) return;

  // --- Computer move logic ---
  // Collect current moves
  var playerMoves = [];
  var compMoves = [];
  for (var i=0;i<boxes.length;i++) {
    if (boxes[i].innerHTML === playerSymbol) playerMoves.push(i);
    if (boxes[i].innerHTML === computerSymbol) compMoves.push(i);
  }
  var availableMoves = [];
  for (var i=0;i<boxes.length;i++) {
    if (!move_array.includes(i)) availableMoves.push(i);
  }

  var move = findWinningMove(compMoves, availableMoves);
  if (move === null) move = findWinningMove(playerMoves, availableMoves);
  if (move === null) move = auto_generate(move_array);

  if(move !== null) {
    boxes[move].innerHTML = computerSymbol;
    boxes[move].style.color = computerSymbol==="X" ? "blue" : "coral";
    boxes[move].style.pointerEvents = "none";
    move_array.push(move);
    checkwinner();
  }
}
