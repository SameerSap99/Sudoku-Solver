function generateSudokuGrid() {
    var count = 0;
    return $('<table id="sudoku">').append(multiPush(9, function (n) {
        return $('<tr>').append(multiPush(9, function (m) {
            count+=1;
            return $('<td><input type="number" autocmin="1" maxlength="1"oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"/></td>').attr('id', "cell"+count);
        }));
    })).addClass('sudoku');
}

function generateSolvedGrid() {
    return $('<table>').append(multiPush(9, function () {
        return $('<tr>').append(multiPush(9, function () {
            return $('<td>');
        }));
    })).addClass('sudoku').addClass('sudoku 2');

    // getElementById('sudoku2').find('td').each(function (index, td) {
    //     $(td).text(data[index] || '');
    // });

}



function multiPush(count, func, scope) {
    var arr = [];
    for (var i = 0; i < count; i++) {
        arr.push(func.call(scope, i));
    }
    return arr;
}

function solver(puzzle) {
  if (findEmpty(puzzle) == null) {
    return puzzle;
  }
  var empty = findEmpty(puzzle);
  for(var num = 1; num < 10; num++) {
    if (isSafe(puzzle, empty, num)) {
      empty.val = num;
      if (solvePuzzle(puzzle)) {
        return puzzle;
      } else {
        empty.val = 0
      }
    }
  }
  return false;
}

function node(r, c, v) {
  this.row = r;
  this.col = c;
  this.val = v;
}

function isSafe(puzzle, n, v) {
  return checkRow(puzzle, n, v) && checkCol(puzzle, n, v) && checkSquare(puzzle, n, v);
}

function findEmpty(puzzle) {
  for (i=0; i<puzzle.length; i++) {
    for (j=0; j<puzzle[0].length; j++) {
      var temp = puzzle[i][j];
      if (temp.val == 0) {
        return temp;
      }
    }
  }
}

function checkRow(puzzle, n, v) {
  for (i = 0; i < puzzle[0].length; i ++) {
      if (puzzle[i][n.col].val == v) {
          return false;
      }
  }
  return true;
}

function checkCol(puzzle, n, v) {
  for (i = 0; i < puzzle.length; i ++) {
    if (puzzle[n.row][i].val == v) {
      return false;
    }
  }
  return true;
}

function checkSquare(puzzle, n, v) {
  row = Math.floor((n.row / 3)) * 3;
  col = Math.floor((n.col / 3)) * 3;
  for (i = 0; i < 3; i++) {
      for (j = 0; j < 3; j++) {
          if (puzzle[row + i][col + j].val == v) {
              return false;
          }
      }
  }
  return true;
}

function arrayTo2d(arr) {
  input = [];
  count = 0
  for (i=0; i < 9; i++) {
    input[i] = [];
    for (j=0; j<9; j++) {
      input[i][j] = new node(i,j,arr[count]);
      count+=1;
    }
  }
  return solver(input);
}




$(document).ready(function() {

  $('body').append($('<div>').addClass('wrapper')
        .append($('<div>').addClass('col')
          .append($('<h1>').html('Enter Puzzle'))
          .append(generateSudokuGrid()))
        .append($('<div>').addClass('col')
          .append($('<button type="button">Solve!</button>')))
        .append($('<div>').addClass('col')
          .append($('<h1>').html('Solved Puzzle'))
          .append(generateSolvedGrid())));



  $("button").click(function solvePuzzle() {
    var data = [];
    for (i=1; i<82;i++) {
      var val = document.getElementById("cell"+i).childNodes[0].value;
      if (val == "") {
        data[i-1] = 0;
      } else {
        data[i-1] = parseInt(val);
      }
    }
    var solved = arrayTo2d(data)
    if (solved) {
      var output = []
      var count = 0;
      for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
          output[count] = solved[i][j].val;
          count +=1;
        }
      }
      $('table[class^="sudoku 2"]').each(function (index, grid) {
        populateGrid($(grid), output);
      });

function populateGrid(grid, output) {
    grid.find('td').each(function (index, td) {
        $(td).text(output[index] || '');
    });
}

    } else {
      $('body').append('<h4>').html("Puzzle Cannot be Solved")
    }
  })
      });
