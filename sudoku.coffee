$ = jQuery

### EASY ###
###
game = [7,"","",3,"",9,"","",1,"",1,"","","","",3,"","",6,"",2,"",4,"","","",7,"",2,7,9,"","","",1,"",1,9,6,2,"",8,7,3,4,"",5,"","","",4,6,2,"",2,"","","",9,"",1,"",3,"","",1,"","","","",6,"",9,"","",1,"",2,"","",8]
game = [8,"","",5,"","","","",9,6,"",9,"","","",3,5,"","",7,"","","",8,"",2,"","",4,5,1,3,9,"",8,"","","",8,"",7,"",5,"","","",9,"",8,5,6,1,4,"","",8,"",3,"","","",7,"","",3,1,"","","",9,"",2,9,"","","","",2,"","",1]	
###

## MEDIUM ###
###
game = ["",4,"",9,"","","","","",7,"",5,"",6,"","","","","",3,6,2,"",4,"","","","",1,"",5,"","","","",3,"","",7,3,8,1,4,"","",8,"","","","",6,"",9,"","","","",6,"",2,3,8,"","","","","",4,"",7,"",5,"","","","","",8,"",1,""]
###

### HARD ###
###
game = [9,8,"","","",5,"",7,"",6,"","","","","","","","","","","","",6,"","",3,"","",3,"","",7,4,"","","","",4,2,3,"",6,7,1,"","","","",1,9,"","",4,"","",5,"","",2,"","","","","","","","","","","","",3,"",2,"",5,"","","",9,8]
###

### EVIL ###
###game = [2,"","","",3,"","","","","","","","",8,"",3,4,"",5,"","",1,"","","",2,"","",7,"","","",4,"",1,"",3,"","","",6,"","","",5,"",2,"",3,"","","",9,"","",5,"","","",6,"","",8,"",9,3,"",7,"","","","","","","","",1,"","","",7]
###
game = [2,"","","",6,"","","","","","","","","","",2,"",4,"","",1,"","",7,3,"",9,"","",8,7,3,"","","","","",6,"","",2,"","",4,"","","","","",5,8,9,"","",8,"",7,3,"","",1,"","",1,"",9,"","","","","","","","","","",9,"","","",5]

data = [0..80]

NUM_TILES = 81
ROW_LENGTH = 9
NUM_ROWS = NUM_SQUARES = 9
BOX_SIZE = 3
NUM_BOXES = 3

tiles = 1
board = ""
GCOUNT = 0

i = 1
while i <= NUM_ROWS
	board += "<div class='trow' id='r" + i.toString()  + "'>"
	r = 1
	while r <= ROW_LENGTH
		c = "tile"
		c += if r%3 == 0 and r%9 != 0 then " t-br" else ""
		c += if i==3 or i==6 then " t-bb" else ""
		board += "<div class='" + c + "'><input type='number' id='t" + tiles.toString() + "' min='1' max='9' value='" + game[tiles-1] + "' "
		board += if game[tiles-1] isnt "" then "disabled" else "enabled style='font-weight:bold;'"
		board += "/></div>"
		tiles++
		r++
	board += "</div>"
	i++

$("#board").html board

Array::remove = (e) -> @[t..t] = [] if (t = @indexOf(e)) > -1

count_solved = (d = data) ->
	count = 0
	for v in d
		count++ if v isnt ""
	count

possible_values = (index, da = data) ->
	### index is positional ###
	index--
	return da[index] if da[index] isnt ""
	
	values = [1..9]
	
	### Check rows ###
	start = index - (index%ROW_LENGTH)
	end = start + ROW_LENGTH - 1 
	while start <= end
		values.remove( parseInt(data[start]) )
		start++
	

	### Check columns ###
	start = index%ROW_LENGTH
	end = start + (ROW_LENGTH * (NUM_ROWS-1))
	while start <= end
		values.remove( parseInt(da[start]) )
		start += ROW_LENGTH
	
	### Check square ###
	col = if ((index+1)%ROW_LENGTH) is 0 then (ROW_LENGTH-1) else (index+1)%ROW_LENGTH
	col -= BOX_SIZE if col % BOX_SIZE is 0
	col = col - (col%BOX_SIZE)
	row = parseInt(index / (ROW_LENGTH * BOX_SIZE))
	row *= ROW_LENGTH * BOX_SIZE
	start = col + row
	k = 1
	while k <=3
		j = 0
		while j <= 2
			values.remove( parseInt(da[start+j]) )
			j++
		start += ROW_LENGTH
		k++ 
	
	values

fill_tile = (index, da = data) ->
	### index is positional ###
	value = possible_values(index, da)
	if value.length is 1 or typeof(value) is 'number'
		da[index-1] = value[0]
		$("#t" + index.toString() ).val(value)

process_fill_array = (pv, da = data) ->
	for i in [1..9] by 1
		index = []
		for vals in pv
			index.push(vals[0]) if vals[1].indexOf(i) isnt -1					
		if index.length is 1
			da[index[0]] = i
			$("#t" + (index[0]+1).toString() ).val(i)

process_hard = (da = data)->
	### Process row ###
	r = 0
	while r < NUM_ROWS
		pv = []
		for i in [(r*ROW_LENGTH)..((r*ROW_LENGTH)+ROW_LENGTH-1)] by 1
			pv.push( [i, possible_values(i+1, da)] ) if da[i] is ""
		process_fill_array(pv, da)
		r++

	### Process col ###
	c = 1
	while c < ROW_LENGTH
		pv = []
		i = c
		while i <= NUM_TILES
			pv.push( [i, possible_values(i+1, da)] ) if da[i] is ""
			i += ROW_LENGTH
		process_fill_array(pv, da)
		c = 9

	### Process square ###
	s = 1
	while s <= NUM_SQUARES
		pv = []
		i = if s % NUM_BOXES is 0 then 3 else s % NUM_BOXES
		i = (parseInt(((s*ROW_LENGTH)-1) / (ROW_LENGTH * NUM_BOXES)) * (NUM_BOXES * ROW_LENGTH)) + ((i*NUM_BOXES)-NUM_BOXES)
		### i is index, i+1 positional
		###
		k = 1
		while k <=3
			j = 0
			while j <= 2
				pv.push( [i+j, possible_values(i+j+1, da)] ) if da[i+j] is ""
				j++
			i += ROW_LENGTH
			k++
		process_fill_array(pv)
		s++

solve_logic = (d = data)->
	old_count = 0
	new_count = count_solved(d)
	while old_count isnt new_count
		process_easy(d)
		process_hard(d)
		old_count = new_count
		new_count = count_solved(d)
	return d

process_evil = (d) ->
	GCOUNT++
	tries = [[2, []],[3, []],[4, []],[5, []],[6, []],[7, []],[8, []],[9, []]]
	for i in [1..81] by 1
		if d[i-1] is ""
			t = possible_values(i, d) 
			tries[ t.length - 2 ][1].push([(i-1),t])
	cell = []
	while cell.length is 0
		for i in [0...tries.length] by 1
			if tries[i][1].length isnt 0
				cell = [tries[i][1][0][0], tries[i][1][0][1]]
				break
	for i in cell[1]
		d[ cell[0] ] = i
		solve_logic(d)
		return d if count_solved(d) is NUM_TILES
		d = process_evil(d)
		return d if count_solved(d) is NUM_TILES
	
	return d

evil_primer = (d = data)->
	temp_data = d
	d = process_evil(temp_data)
	fill_tile(i,d) for i in [1..NUM_TILES]
	d

process_easy = (da = data) ->
	fill_tile(i,da) for i in [1..NUM_TILES] when da[i-1] is ""

load_data = -> 
	i = 0
	while i < NUM_TILES
		data[i] = $( "#t" + (i+1).toString() ).val()
		i++

solve_sudoku = -> 
	load_data()
	data = solve_logic()
	if count_solved() isnt NUM_TILES
		data = evil_primer(data)
	

$("#solve-btn").click (e) ->
	solve_sudoku()
