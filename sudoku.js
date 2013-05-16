// Generated by CoffeeScript 1.6.2
(function() {
  var $, BOX_SIZE, GCOUNT, NUM_BOXES, NUM_ROWS, NUM_SQUARES, NUM_TILES, ROW_LENGTH, board, c, count_solved, data, evil_primer, fill_tile, game, i, load_data, possible_values, process_easy, process_evil, process_fill_array, process_hard, r, solve_logic, solve_sudoku, tiles, _i, _results;

  $ = jQuery;

  /* EASY
  */


  /*
  game = [7,"","",3,"",9,"","",1,"",1,"","","","",3,"","",6,"",2,"",4,"","","",7,"",2,7,9,"","","",1,"",1,9,6,2,"",8,7,3,4,"",5,"","","",4,6,2,"",2,"","","",9,"",1,"",3,"","",1,"","","","",6,"",9,"","",1,"",2,"","",8]
  game = [8,"","",5,"","","","",9,6,"",9,"","","",3,5,"","",7,"","","",8,"",2,"","",4,5,1,3,9,"",8,"","","",8,"",7,"",5,"","","",9,"",8,5,6,1,4,"","",8,"",3,"","","",7,"","",3,1,"","","",9,"",2,9,"","","","",2,"","",1]
  */


  /*
  game = ["",4,"",9,"","","","","",7,"",5,"",6,"","","","","",3,6,2,"",4,"","","","",1,"",5,"","","","",3,"","",7,3,8,1,4,"","",8,"","","","",6,"",9,"","","","",6,"",2,3,8,"","","","","",4,"",7,"",5,"","","","","",8,"",1,""]
  */


  /* HARD
  */


  /*
  game = [9,8,"","","",5,"",7,"",6,"","","","","","","","","","","","",6,"","",3,"","",3,"","",7,4,"","","","",4,2,3,"",6,7,1,"","","","",1,9,"","",4,"","",5,"","",2,"","","","","","","","","","","","",3,"",2,"",5,"","","",9,8]
  */


  /* EVIL
  */


  /*game = [2,"","","",3,"","","","","","","","",8,"",3,4,"",5,"","",1,"","","",2,"","",7,"","","",4,"",1,"",3,"","","",6,"","","",5,"",2,"",3,"","","",9,"","",5,"","","",6,"","",8,"",9,3,"",7,"","","","","","","","",1,"","","",7]
  */


  game = [2, "", "", "", 6, "", "", "", "", "", "", "", "", "", "", 2, "", 4, "", "", 1, "", "", 7, 3, "", 9, "", "", 8, 7, 3, "", "", "", "", "", 6, "", "", 2, "", "", 4, "", "", "", "", "", 5, 8, 9, "", "", 8, "", 7, 3, "", "", 1, "", "", 1, "", 9, "", "", "", "", "", "", "", "", "", "", 9, "", "", "", 5];

  data = (function() {
    _results = [];
    for (_i = 0; _i <= 80; _i++){ _results.push(_i); }
    return _results;
  }).apply(this);

  NUM_TILES = 81;

  ROW_LENGTH = 9;

  NUM_ROWS = NUM_SQUARES = 9;

  BOX_SIZE = 3;

  NUM_BOXES = 3;

  tiles = 1;

  board = "";

  GCOUNT = 0;

  i = 1;

  while (i <= NUM_ROWS) {
    board += "<div class='trow' id='r" + i.toString() + "'>";
    r = 1;
    while (r <= ROW_LENGTH) {
      c = "tile";
      c += r % 3 === 0 && r % 9 !== 0 ? " t-br" : "";
      c += i === 3 || i === 6 ? " t-bb" : "";
      board += "<div class='" + c + "'><input type='number' id='t" + tiles.toString() + "' min='1' max='9' value='" + game[tiles - 1] + "' ";
      board += game[tiles - 1] !== "" ? "disabled" : "enabled style='font-weight:bold;'";
      board += "/></div>";
      tiles++;
      r++;
    }
    board += "</div>";
    i++;
  }

  $("#board").html(board);

  Array.prototype.remove = function(e) {
    var t, _ref;

    if ((t = this.indexOf(e)) > -1) {
      return ([].splice.apply(this, [t, t - t + 1].concat(_ref = [])), _ref);
    }
  };

  count_solved = function(d) {
    var count, v, _j, _len;

    if (d == null) {
      d = data;
    }
    count = 0;
    for (_j = 0, _len = d.length; _j < _len; _j++) {
      v = d[_j];
      if (v !== "") {
        count++;
      }
    }
    return count;
  };

  possible_values = function(index, da) {
    var col, end, j, k, row, start, values;

    if (da == null) {
      da = data;
    }
    /* index is positional
    */

    index--;
    if (da[index] !== "") {
      return da[index];
    }
    values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    /* Check rows
    */

    start = index - (index % ROW_LENGTH);
    end = start + ROW_LENGTH - 1;
    while (start <= end) {
      values.remove(parseInt(data[start]));
      start++;
    }
    /* Check columns
    */

    start = index % ROW_LENGTH;
    end = start + (ROW_LENGTH * (NUM_ROWS - 1));
    while (start <= end) {
      values.remove(parseInt(da[start]));
      start += ROW_LENGTH;
    }
    /* Check square
    */

    col = ((index + 1) % ROW_LENGTH) === 0 ? ROW_LENGTH - 1 : (index + 1) % ROW_LENGTH;
    if (col % BOX_SIZE === 0) {
      col -= BOX_SIZE;
    }
    col = col - (col % BOX_SIZE);
    row = parseInt(index / (ROW_LENGTH * BOX_SIZE));
    row *= ROW_LENGTH * BOX_SIZE;
    start = col + row;
    k = 1;
    while (k <= 3) {
      j = 0;
      while (j <= 2) {
        values.remove(parseInt(da[start + j]));
        j++;
      }
      start += ROW_LENGTH;
      k++;
    }
    return values;
  };

  fill_tile = function(index, da) {
    var value;

    if (da == null) {
      da = data;
    }
    /* index is positional
    */

    value = possible_values(index, da);
    if (value.length === 1 || typeof value === 'number') {
      da[index - 1] = value[0];
      return $("#t" + index.toString()).val(value);
    }
  };

  process_fill_array = function(pv, da) {
    var index, vals, _j, _k, _len, _results1;

    if (da == null) {
      da = data;
    }
    _results1 = [];
    for (i = _j = 1; _j <= 9; i = _j += 1) {
      index = [];
      for (_k = 0, _len = pv.length; _k < _len; _k++) {
        vals = pv[_k];
        if (vals[1].indexOf(i) !== -1) {
          index.push(vals[0]);
        }
      }
      if (index.length === 1) {
        da[index[0]] = i;
        _results1.push($("#t" + (index[0] + 1).toString()).val(i));
      } else {
        _results1.push(void 0);
      }
    }
    return _results1;
  };

  process_hard = function(da) {
    var j, k, pv, s, _j, _ref, _ref1, _results1;

    if (da == null) {
      da = data;
    }
    /* Process row
    */

    r = 0;
    while (r < NUM_ROWS) {
      pv = [];
      for (i = _j = _ref = r * ROW_LENGTH, _ref1 = (r * ROW_LENGTH) + ROW_LENGTH - 1; _j <= _ref1; i = _j += 1) {
        if (da[i] === "") {
          pv.push([i, possible_values(i + 1, da)]);
        }
      }
      process_fill_array(pv, da);
      r++;
    }
    /* Process col
    */

    c = 1;
    while (c < ROW_LENGTH) {
      pv = [];
      i = c;
      while (i <= NUM_TILES) {
        if (da[i] === "") {
          pv.push([i, possible_values(i + 1, da)]);
        }
        i += ROW_LENGTH;
      }
      process_fill_array(pv, da);
      c = 9;
    }
    /* Process square
    */

    s = 1;
    _results1 = [];
    while (s <= NUM_SQUARES) {
      pv = [];
      i = s % NUM_BOXES === 0 ? 3 : s % NUM_BOXES;
      i = (parseInt(((s * ROW_LENGTH) - 1) / (ROW_LENGTH * NUM_BOXES)) * (NUM_BOXES * ROW_LENGTH)) + ((i * NUM_BOXES) - NUM_BOXES);
      /* i is index, i+1 positional
      */

      k = 1;
      while (k <= 3) {
        j = 0;
        while (j <= 2) {
          if (da[i + j] === "") {
            pv.push([i + j, possible_values(i + j + 1, da)]);
          }
          j++;
        }
        i += ROW_LENGTH;
        k++;
      }
      process_fill_array(pv);
      _results1.push(s++);
    }
    return _results1;
  };

  solve_logic = function(d) {
    var new_count, old_count;

    if (d == null) {
      d = data;
    }
    old_count = 0;
    new_count = count_solved(d);
    while (old_count !== new_count) {
      process_easy(d);
      process_hard(d);
      old_count = new_count;
      new_count = count_solved(d);
    }
    return d;
  };

  process_evil = function(d) {
    var cell, t, tries, _j, _k, _l, _len, _ref, _ref1;

    GCOUNT++;
    tries = [[2, []], [3, []], [4, []], [5, []], [6, []], [7, []], [8, []], [9, []]];
    for (i = _j = 1; _j <= 81; i = _j += 1) {
      if (d[i - 1] === "") {
        t = possible_values(i, d);
        tries[t.length - 2][1].push([i - 1, t]);
      }
    }
    cell = [];
    while (cell.length === 0) {
      for (i = _k = 0, _ref = tries.length; _k < _ref; i = _k += 1) {
        if (tries[i][1].length !== 0) {
          cell = [tries[i][1][0][0], tries[i][1][0][1]];
          break;
        }
      }
    }
    _ref1 = cell[1];
    for (_l = 0, _len = _ref1.length; _l < _len; _l++) {
      i = _ref1[_l];
      d[cell[0]] = i;
      solve_logic(d);
      if (count_solved(d) === NUM_TILES) {
        return d;
      }
      d = process_evil(d);
      if (count_solved(d) === NUM_TILES) {
        return d;
      }
    }
    return d;
  };

  evil_primer = function(d) {
    var temp_data, _j;

    if (d == null) {
      d = data;
    }
    temp_data = d;
    d = process_evil(temp_data);
    for (i = _j = 1; 1 <= NUM_TILES ? _j <= NUM_TILES : _j >= NUM_TILES; i = 1 <= NUM_TILES ? ++_j : --_j) {
      fill_tile(i, d);
    }
    return d;
  };

  process_easy = function(da) {
    var _j, _results1;

    if (da == null) {
      da = data;
    }
    _results1 = [];
    for (i = _j = 1; 1 <= NUM_TILES ? _j <= NUM_TILES : _j >= NUM_TILES; i = 1 <= NUM_TILES ? ++_j : --_j) {
      if (da[i - 1] === "") {
        _results1.push(fill_tile(i, da));
      }
    }
    return _results1;
  };

  load_data = function() {
    var _results1;

    i = 0;
    _results1 = [];
    while (i < NUM_TILES) {
      data[i] = $("#t" + (i + 1).toString()).val();
      _results1.push(i++);
    }
    return _results1;
  };

  solve_sudoku = function() {
    load_data();
    data = solve_logic();
    if (count_solved() !== NUM_TILES) {
      return data = evil_primer(data);
    }
  };

  $("#solve-btn").click(function(e) {
    return solve_sudoku();
  });

}).call(this);
