
Game Of Life
--------------
1. Game Description - http://wiki.imaginea.com/Back2Front/ProjectIdeas#Conway.27s_.22Game_of_Life.22_simulator
	This project is the implementation of Conway's game of life simulator
	
2. Design Approach - http://gitlab.pramati.com/back2front/game-of-life/blob/master/Game%20Of%20Life.doc
	a. We decided to use HTML, Javascript and Bootstrap CSS. The game works as below
	b. Dynamically build the grid(html table) on document load.
	c. User has to set the live cells before starting the game. A cell click on the grid causes the cell to be alive
	d. User can start the game once he initialized the live cells in the grid.
	e. The game starts by applying rules on the live cells and its neighbours
	f. Each generation completes after applying the conway's rule on each live cell and its neighbour
	g. Each generation is a 2 seconds time

3. Mapping design concept to DOM + JS & Justification
	a. html - We have static images(which illustrates game rules) and buttons for user interactions
	b. DOM - We build the grid dynamically and identify live cells(made alive by user or by the game itself).
		Live and Dead cells can be varied by altering the CSS
	c. Objects - Maintain a Map Object to track the live cells and apply the rules easier across the generations. 
		Identifying the live cells using the CSS scan would be sufficient enough but identifying the live cell is a frequent operation 
		and Map object may avoid this.
	
4. Upcoming Things
	a. Drag and drop the existing patterns into the grid rather than user click the cells to make it live
	b. User interaction in step by step play instead of running the generation at every 2 seconds
