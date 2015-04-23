var liveCellsMap = {};
var gameStarted = false;
var gridRows = 75;
var gridColumns = 75;
var neighbourCellsMap = {};

function hasElement(liveCellsMap) {	
	for (var key in liveCellsMap) {
		return true;
	}
	return false;
}

function loadTable () {

	// startGameButton - Button click event listener
    var startGameButton = document.getElementById('startGameButton');
    startGameButton.addEventListener("click", function(e) {
      if (!hasElement(liveCellsMap)) {
      	startGameButton.value = 'Start Game';
      	alert("Turn cells alive by clicking at them & Start the game !!");
      	return;
      }

      startGameButton.value = 'Next Step';

      // if game is already started, then process just the live cells
      if (gameStarted)
      	processLiveCells();
      else {
      	// if the game is not started, initialize the live cells & its neighbours
      	startGame();
      	gameStarted = true;
      }	  
    });

    // resetGameButton - Button click event listener
    var resetGameButton = document.getElementById('resetGameButton');
    resetGameButton.addEventListener("click",function(e) {
    	resetGame();
    }); 

    // game-table - Table click event listener
	var table = document.getElementById('game-table');	
	table.addEventListener('click',function tableClick(e) {
		if (!gameStarted && e.srcElement.id) {
			document.getElementById(e.srcElement.id).setAttribute("class", "my-live-cell");
			// Add each live cells into the liveCellsMap
			//liveCellsMap.push(e.srcElement.id);
			liveCellsMap[e.srcElement.id] = e.srcElement.id;
		}
	});

	// call the function to build the grid
	var tableData = computeTableStructure(gridRows,gridColumns);
	setInnerHTML(table,tableData);

}

function computeTableStructure (rows,cols)
{
	var innerTableData='';
	for(var i=0;i<rows;i++)
	{
		var row = "<tr>";
		for(var j=0;j<cols;j++)
		{
			/*Set the table data id in matrix style.
			i.e, id = "row#column"*/
			row+='<td id=\"';
			if (i < 10) {
				row+= '0' + i;

			} else {
				row+= i;
			}			
			row+='#';
			if (j < 10) {
				row+= '0' + j;

			} else {
				row+= j;
			}
			row+='\"> </td>';
		}
		row+='</tr>';
		innerTableData+=row;
	}
	return innerTableData;
}

function setInnerHTML (element,htmlbody)
{
	element.innerHTML = htmlbody;
}

function startGame() {
	// start the game
	// build neighbour cells map of every live cell
	buildNeighboursMap();

	//console.log('Game Started');
	// debug method just to print the neighbour cells of each array
	setInterval(function() {processLiveCells();},100);
	//processLiveCells();
}

function buildNeighbours(gridValue) {
	var gridIndex = gridValue.split('#');
	var row = parseInt(gridIndex[0]);
	var column = parseInt(gridIndex[1]);

	// Additional check to exclude the neighbour cells outside the boundary
	var previousRow = row-1>-1 && row-1< gridRows?row-1:null;
	var nextRow = row+1>-1 && row+1< gridRows?row+1:null;
	var previousColumn = column-1>-1 && column-1< gridColumns?column-1:null;
	var nextColumn = column+1>-1 && column+1< gridColumns?column+1:null;

	// Formatting the row & column index as per the actual grid index
	row = row<10?'0'+row:row;
	column = column<10?'0'+column:column;

	previousRow = previousRow != null && previousRow<10?'0'+previousRow:previousRow;
	nextRow = nextRow != null && nextRow<10?'0'+nextRow:nextRow;	
	previousColumn = previousColumn != null && previousColumn<10?'0'+previousColumn:previousColumn;
	nextColumn = nextColumn != null && nextColumn<10?'0'+nextColumn:nextColumn;	
	


	/*Neighbours for a cell [i,j] aregridId
	Previous row [i-1,j-1] [i-1,j] [i-1,j+1] 
	Same row [i,j-1] [i,j+1] 
	Next row [i+1,j-1] [i+1,j] [i+1,j+1]*/
	var neighbours = [];
	// Previous row
	if (previousRow != null && previousColumn != null)
		neighbours.push(previousRow + '#' + previousColumn);
	if (previousRow != null && column != null)
		neighbours.push(previousRow + '#' + column);
	if (previousRow != null && nextColumn != null)
		neighbours.push(previousRow + '#' + nextColumn);

	// Same row
	if (row != null && previousColumn != null)
		neighbours.push(row + '#' + previousColumn);
	if (row != null && nextColumn != null)
		neighbours.push(row + '#' + nextColumn);

	// Next row
	if (nextRow != null && previousColumn != null)
		neighbours.push(nextRow + '#' + previousColumn);
	if (nextRow != null && column != null)
		neighbours.push(nextRow + '#' + column);
	if (nextRow != null && nextColumn != null)
		neighbours.push(nextRow + '#' + nextColumn);

	if (neighbours.length > 0)
		return neighbours;
	
	return null;
}

function buildNeighboursMap() {
	for (var gridId in liveCellsMap) {
		var gridValue = liveCellsMap[gridId];
		var neighbours = buildNeighbours(gridValue);
		if (neighbours != null)
			neighbourCellsMap[gridValue] = neighbours;
	}
}

function processLiveCells() {
	// debugger;
	for (var currentCell in neighbourCellsMap) {
		//console.log('processing ' + currentCell);
		var neighbourCells = neighbourCellsMap[currentCell];
		//console.log(neighbourCells);
		if (isOverPopulated(neighbourCells)) {
			//console.log('killing overpopulated ' + currentCell);
			makeCellDead(currentCell);
		}
		if (isUnderPopulated(neighbourCells)) {
			//console.log('killing underpopulated ' + currentCell);
			makeCellDead(currentCell);
		}
		makeCellsAlive(neighbourCells);
	}

	if (!hasElement(liveCellsMap)) {
		location.reload();
	}
}

function getNeighbourLiveCount(neighbourCells) {
	var liveCellsCount = 0;
	for (var i in neighbourCells) {
		if (checkLiveCellById(neighbourCells[i])) {
			liveCellsCount++;
		}
	}
	return liveCellsCount;
}

function isOverPopulated(neighbourCells) {
	var liveCellsCount = getNeighbourLiveCount(neighbourCells);
	if (liveCellsCount > 3) {
		return true;
	}
	return false;
}

function isUnderPopulated(neighbourCells) {
	var liveCellsCount = getNeighbourLiveCount(neighbourCells);
	if (liveCellsCount < 2) {
		return true;
	}
	return false;

}

function makeCellsAlive(neighbourCells) {
	
	for (var i in neighbourCells) {
		if (!checkLiveCellById(neighbourCells[i])) {
			//console.log('dead cell ' + neighbourCells[i]);
			var deadCellsNeighbours = buildNeighbours(neighbourCells[i]);
			if (deadCellsNeighbours != null) {
				var liveCellsAroundDeadCells = 0;
				for (var j in deadCellsNeighbours) {
					if (checkLiveCellById(deadCellsNeighbours[j])) {
						liveCellsAroundDeadCells ++;
					}
				}
				if (liveCellsAroundDeadCells ==3) {
					makeCellAlive(neighbourCells[i],deadCellsNeighbours);
				}
			}
		}
	}
}

function checkLiveCellById(currentCell) {
	if(liveCellsMap[currentCell]) {
		// console.log('live cell found !!' + formattedCellStyle);
		return true;
	}
	return false;
}

function resetGame() {
	// Reset the game
	//console.log('game reset');
	location.reload();
}

function makeCellAlive(currentCell,deadCellsNeighbours) {
	//console.log('trying to make live cell ' + currentCell);
	try {
		document.getElementById(currentCell).setAttribute("class", "my-live-cell");
		liveCellsMap[currentCell] = currentCell;
		neighbourCellsMap[currentCell] = deadCellsNeighbours;
	} catch(e) {
		console.log(e);
		console.log(currentCell);
	}
	
	//console.log('cell made alive');
}

function makeCellDead(currentCell) {	
	//console.log('killing ' + currentCell);
	//removeDeadCell(currentCell);
	delete liveCellsMap[currentCell];
	delete neighbourCellsMap[currentCell];
	document.getElementById(currentCell).removeAttribute("class", "my-live-cell");
}