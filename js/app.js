var liveCellsMap = {};
var gameStarted = false;
var gridRows = 75;
var gridColumns = 75;
var deadCellsToConsider = {};


var startGameButton = document.getElementById('startGameButton');
var resetGameButton = document.getElementById('resetGameButton');
var table = document.getElementById('game-table');


var rPentominoPattern = document.getElementById('rPentominoPattern');
var acornPattern = document.getElementById('acornPattern');
var beaconPattern = document.getElementById('beaconPattern');
var blinkedPattern = document.getElementById('blinkedPattern');
var pulsarPattern = document.getElementById('pulsarPattern');
var toadPattern = document.getElementById('toadPattern');
var spaceShipPattern = document.getElementById('spaceShipPattern');
var gliderPattern = document.getElementById('gliderPattern');
var dieHardPattern = document.getElementById('dieHardPattern');
var universePattern = document.getElementById('universe');



function hasElement(liveCellsMap) {	
	for (var key in liveCellsMap) {
		return true;
	}
	return false;
}


function init() {
	loadTable();
	registerListeners();
}

function registerListeners() {
    startGameButton.addEventListener("click",initGame);
    resetGameButton.addEventListener("click",resetGame);
	table.addEventListener('click',tableClick);
	gliderPattern.addEventListener('click',initiateGlider);
	dieHardPattern.addEventListener('click',initiateDieHardPattern);
	rPentominoPattern.addEventListener('click',initiateRPentominoPattern);
	acornPattern.addEventListener('click',initiateAcornPattern);	
	pulsarPattern.addEventListener('click',initiatePulsarPattern);	
	spaceShipPattern.addEventListener('click',initiateSpaceShipPattern);


	beaconPattern.addEventListener('click',initiateBeaconPattern);
	universePattern.addEventListener('click',initiateUniverse);
	blinkedPattern.addEventListener('click',initiateBlinkedPattern);
	toadPattern.addEventListener('click',initiateToadPattern);		
}

function loadTable () {
	var tableData = computeTableStructure(gridRows,gridColumns);
	table.innerHTML = tableData;
}

function tableClick(e) {
	makeCellAlive(e.srcElement.id);
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
			var id = computeId(i,j);
			row+='<td id=\"' + id +'\" ondragstart=\"dragStart(event)\" draggable=\"true\" ondrop=\"drop(event)\" ondragover=\"allowDrop(event)\"> </td>';
		}
		row+='</tr>';
		innerTableData+=row;
	}
	return innerTableData;
}

function computeId (i,j) {
			var id= '';
			if (i < 10)
				id+= '0' + i;
			else
				id+= i;			
			id+='#';
			if (j < 10)
				id+= '0' + j;
			else
				id+= j;
	return id;
}

function initGame(e) {
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
}

function startGame() {
	// start the game
	// build neighbour cells map of every live cell
	// buildNeighboursMap();
	// debug method just to print the neighbour cells of each array
	setInterval(function() {processLiveCells();},100);
	// processLiveCells();
}

function buildNeighbours(gridValue) {
	var gridIndex = gridValue.split('#');
	var row = parseInt(gridIndex[0]);
	var column = parseInt(gridIndex[1]);

	// Additional check to exclude the neighbour cells outside the boundary
	var previousRow = row-1>-1 && row-1< gridRows?row-1:gridRows-1;
	var nextRow = row+1>-1 && row+1< gridRows?row+1:0;
	var previousColumn = column-1>-1 && column-1< gridColumns?column-1:gridColumns-1;
	var nextColumn = column+1>-1 && column+1< gridColumns?column+1:0;

	/*Neighbours for a cell [i,j] aregridId
	Previous row [i-1,j-1] [i-1,j] [i-1,j+1] 
	Same row [i,j-1] [i,j+1] 
	Next row [i+1,j-1] [i+1,j] [i+1,j+1]*/
	var neighbours = [];
	// Previous row
	if (previousRow != null && previousColumn != null)
		neighbours.push(computeId(previousRow,previousColumn));
	if (previousRow != null && column != null)
		neighbours.push(computeId(previousRow,column));
	if (previousRow != null && nextColumn != null)
		neighbours.push(computeId(previousRow,nextColumn));

	// Same row
	if (row != null && previousColumn != null)
		neighbours.push(computeId(row,previousColumn));
	if (row != null && nextColumn != null)
		neighbours.push(computeId(row,nextColumn));

	// Next row
	if (nextRow != null && previousColumn != null)
		neighbours.push(computeId(nextRow,previousColumn));
	if (nextRow != null && column != null)
		neighbours.push(computeId(nextRow,column));
	if (nextRow != null && nextColumn != null)
		neighbours.push(computeId(nextRow,nextColumn));

	if (neighbours.length > 0)
		return neighbours;
	
	return null;
}

function processLiveCells() {

	var cellsToBeMadeDead = {};


	for (var currentCell in liveCellsMap) {
		var neighbourCells = buildNeighbours(currentCell);
		if (!isEligibleToLive(neighbourCells)) {
			//makeCellDead(currentCell);
			cellsToBeMadeDead[currentCell] = currentCell;
		}
	}

	var cellsToBeMadeAlive = {};


	for (var currentCell in deadCellsToConsider) {
		if (!isCellAlive(currentCell)) {
			var deadCellsNeighbours = buildNeighbours(currentCell);
			if (getNeighbourLiveCount(deadCellsNeighbours) == 3) {
				//makeCellAlive(currentCell);
				cellsToBeMadeAlive[currentCell] = currentCell;
			}
		}
	}


	for (var key in cellsToBeMadeDead) {
		makeCellDead(key);
	}

	for (var key in cellsToBeMadeAlive) {
		makeCellAlive(key);
	}
}

function getNeighbourLiveCount(neighbourCells) {
	var liveCellsCount = 0;
	for (var i in neighbourCells) {
		if (isCellAlive(neighbourCells[i])) {
			liveCellsCount++;
		} else {
			deadCellsToConsider[neighbourCells[i]] = neighbourCells[i];
		}
	}
	return liveCellsCount;
}

function isEligibleToLive(neighbourCells) {
	var liveCellsCount = getNeighbourLiveCount(neighbourCells);
	if (liveCellsCount <= 3 && liveCellsCount >= 2)
		return true;
	return false;
}

function isCellAlive(currentCell) {
	if(liveCellsMap[currentCell]) {
		return true;
	}
	return false;
}

function resetGame() {
	// Reset the game
	location.reload();
}

function makeCellAlive(currentCell) {
	try {
		document.getElementById(currentCell).setAttribute("class", "my-live-cell");
		liveCellsMap[currentCell] = currentCell;
	} catch(e) {
		console.log(e);
		console.log(currentCell);
	}
}

function makeCellDead(currentCell) {
	delete liveCellsMap[currentCell];
	document.getElementById(currentCell).removeAttribute("class", "my-live-cell");
}


function dragStart(event) {
    event.dataTransfer.setData("Text", event.target.id);
}

function allowDrop(event) {
    event.preventDefault();
    tableClick(event);
}

function drop(event) {
    event.preventDefault();
}



function initiateUniverse () {	
	clearExistingPattern();
	makeCellAlive('02#08');
	makeCellAlive('03#06');
	makeCellAlive('03#08');
	makeCellAlive('03#09');
	makeCellAlive('04#06');
	makeCellAlive('04#08');
	makeCellAlive('05#06');
	makeCellAlive('06#04');
	makeCellAlive('07#02');
	makeCellAlive('07#04');
}


function initiateDieHardPattern() {	
	clearExistingPattern();
	makeCellAlive('17#35');
	makeCellAlive('18#29');
	makeCellAlive('18#30');
	makeCellAlive('19#30');
	makeCellAlive('19#34');
	makeCellAlive('19#35');
	makeCellAlive('19#36');

}

function initiateRPentominoPattern() {	
	clearExistingPattern();
	makeCellAlive('55#44');
	makeCellAlive('55#45');
	makeCellAlive('56#43');
	makeCellAlive('56#44');
	makeCellAlive('57#44');
}

function initiateAcornPattern() {	
	clearExistingPattern();
	makeCellAlive('14#32');
	makeCellAlive('15#34');
	makeCellAlive('16#31');
	makeCellAlive('16#32');
	makeCellAlive('16#35');
	makeCellAlive('16#36');
	makeCellAlive('16#37');
}

function initiateBeaconPattern() {	
	clearExistingPattern();
	makeCellAlive('32#40');
	makeCellAlive('32#41');
	makeCellAlive('33#40');
	makeCellAlive('33#41');
	makeCellAlive('34#42');
	makeCellAlive('34#43');
	makeCellAlive('35#42');
	makeCellAlive('35#43');
}

function initiateBlinkedPattern() {	
	clearExistingPattern();
	makeCellAlive('09#29');
	makeCellAlive('10#29');
	makeCellAlive('11#29');
}

function initiatePulsarPattern() {	
	clearExistingPattern();
	makeCellAlive('13#32');
	makeCellAlive('13#33');
	makeCellAlive('13#34');
	makeCellAlive('13#38');
	makeCellAlive('13#39');
	makeCellAlive('13#40');
	makeCellAlive('15#30');
	makeCellAlive('15#35');
	makeCellAlive('15#37');
	makeCellAlive('15#42');
	makeCellAlive('16#30');
	makeCellAlive('16#35');
	makeCellAlive('16#37');
	makeCellAlive('16#42');
	makeCellAlive('17#30');
	makeCellAlive('17#35');
	makeCellAlive('17#37');
	makeCellAlive('17#42');
	makeCellAlive('18#32');
	makeCellAlive('18#33');
	makeCellAlive('18#34');
	makeCellAlive('18#38');
	makeCellAlive('18#39');
	makeCellAlive('18#40');
	makeCellAlive('20#32');
	makeCellAlive('20#33');
	makeCellAlive('20#34');
	makeCellAlive('20#38');
	makeCellAlive('20#39');
	makeCellAlive('20#40');
	makeCellAlive('21#30');
	makeCellAlive('21#35');
	makeCellAlive('21#37');
	makeCellAlive('21#42');
	makeCellAlive('22#30');
	makeCellAlive('22#35');
	makeCellAlive('22#37');
	makeCellAlive('22#42');
	makeCellAlive('23#30');
	makeCellAlive('23#35');
	makeCellAlive('23#37');
	makeCellAlive('23#42');
	makeCellAlive('25#32');
	makeCellAlive('25#33');
	makeCellAlive('25#34');
	makeCellAlive('25#38');
	makeCellAlive('25#39');
	makeCellAlive('25#40');
}

function initiateToadPattern() {	
	clearExistingPattern();
	makeCellAlive('29#33');
	makeCellAlive('29#34');
	makeCellAlive('29#35');
	makeCellAlive('30#32');
	makeCellAlive('30#33');
	makeCellAlive('30#34');
}

function initiateGliderPattern() {	
	clearExistingPattern();
	makeCellAlive('22#33');
	makeCellAlive('22#35');
	makeCellAlive('23#34');
	makeCellAlive('23#35');
	makeCellAlive('24#34');
}

function initiateSpaceShipPattern() {	
	clearExistingPattern();
	makeCellAlive('50#34');
	makeCellAlive('50#35');
	makeCellAlive('51#32');
	makeCellAlive('51#33');
	makeCellAlive('51#35');
	makeCellAlive('51#36');
	makeCellAlive('52#32');
	makeCellAlive('52#33');
	makeCellAlive('52#34');
	makeCellAlive('52#35');
	makeCellAlive('53#33');
	makeCellAlive('53#34');	
}

function initiateGlider () {
	clearExistingPattern();
	makeCellAlive('12#36');
	makeCellAlive('13#34');
	makeCellAlive('13#36');
	makeCellAlive('14#32');
	makeCellAlive('14#33');
	makeCellAlive('14#46');
	makeCellAlive('14#47');
	makeCellAlive('14#24');
	makeCellAlive('14#25');
	makeCellAlive('15#32');
	makeCellAlive('15#33');
	makeCellAlive('15#27');
	makeCellAlive('15#46');
	makeCellAlive('15#47');
	makeCellAlive('15#23');
	makeCellAlive('16#33');
	makeCellAlive('16#32');
	makeCellAlive('16#28');
	makeCellAlive('16#12');
	makeCellAlive('16#13');
	makeCellAlive('16#22');
	makeCellAlive('17#34');
	makeCellAlive('17#36');
	makeCellAlive('17#26');
	makeCellAlive('17#28');
	makeCellAlive('17#29');
	makeCellAlive('17#12');
	makeCellAlive('17#22');
	makeCellAlive('17#13');
	makeCellAlive('18#22');
	makeCellAlive('18#28');
	makeCellAlive('18#36');
	makeCellAlive('19#27');
	makeCellAlive('19#23');
	makeCellAlive('20#24');
	makeCellAlive('20#25');

}


function clearExistingPattern() {
	liveCellsMap = {};

	var table = document.getElementById('game-table');
	table.innerHTML = '';	

	loadTable();	
}