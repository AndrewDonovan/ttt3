//setting up the board var, as well as linking controller to html//
var blankBoard = [0,0,0,0,0,0,0,0,0];
var gameApp = angular.module ('gameApp', ["firebase"]);
gameApp.controller('GameController', function ($scope, $firebase) { 

var playerNum = null;

var ticTacRef = new Firebase("https://tictactoe3.firebaseio.com/games"); //gives Firebase a needed URL //
// var turn = true;


var lastGame;
ticTacRef.once('value', function(gameSnapshot) {
	
	var games = gameSnapshot.val();
	if(games === null)
	{
		lastGame = ticTacRef.push( {waiting: true} );
		playerNum = true;
	}
	else
	{
		//this is getting the last key of the games folder//
		var keys = Object.keys(games);    
		var lastGameKey = keys[ keys.length - 1];
		var lastGame = games [ lastGameKey];
		console.log("This person's game: " + lastGameKey);
    if(lastGame.waiting) {
		lastGame = ticTacRef.child(lastGameKey);
	lastGame.set( {
		turnCount: 0, 
		waiting:false, 
		playAgain: false, 
		won: false, 
		gameOver: false, 
		turn: true, 
		result: "", 
		cells: blankBoard
	}
);
	playerNum = false;
	}
	else
	{
		lastGame = ticTacRef.push( {waiting:true} );
		playerNum = true;
	}

//below attaches what we are doing to the current game//
$scope.game = $firebase(lastGame);
};


$scope.game.player1 = 0; 
$scope.game.player2 = 0;

$scope.game.gameOver = false;

$scope.playAgain = function(){
	$scope.game.turn = true;
	$scope.game.turnCount = 0;
	$scope.game.gameOver = false;

	for (var i =0; i < 9; i++) {
		$scope.game.cells[i] = 0;
	}
};

$scope.playerTurn = function(c){
	if ($scope.game.cells[c] === 0 && playerNum === $scope.game.turn ) 
	{
		if($scope.game.turn === true)
		{
			$scope.game.cells[c] = 1;
			value = -1;
			$scope.game.turn = false;
		}
		else
		{
			$scope.game.cells[c] = -1;
			value = -1;
			$scope.game.turn = true;
		}
		
		$scope.game.turnCount++;
		$scope.game.$save();
		console.log($scope.game.turnCount);		

		if(Math.abs($scope.game.cells[0] + $scope.game.cells[1] + $scope.game.cells[2]) == 3)
			$scope.playerWon($scope.game.cells[0]);
		if(Math.abs($scope.game.cells[3] + $scope.game.cells[4] + $scope.game.cells[5]) == 3)
			$scope.playerWon($scope.game.cells[3]);
		if(Math.abs($scope.game.cells[6] + $scope.game.cells[7] + $scope.game.cells[8]) == 3)
			$scope.playerWon($scope.game.cells[6]);
		if(Math.abs($scope.game.cells[0] + $scope.game.cells[3] + $scope.game.cells[6]) == 3)
			$scope.playerWon($scope.game.cells[0]);
		if(Math.abs($scope.game.cells[1] + $scope.game.cells[4] + $scope.game.cells[7]) == 3)
			$scope.playerWon($scope.game.cells[1]);
		if(Math.abs($scope.game.cells[2] + $scope.game.cells[5] + $scope.game.cells[8]) == 3)
			$scope.playerWon($scope.game.cells[2]);
		if(Math.abs($scope.game.cells[0] + $scope.game.cells[4] + $scope.game.cells[8]) == 3)
			$scope.playerWon($scope.game.cells[0]);
		if(Math.abs($scope.game.cells[2] + $scope.game.cells[4] + $scope.game.cells[6]) == 3)
			$scope.playerWon($scope.game.cells[2]);
		if($scope.game.turnCount==9){
			$scope.draw();
		}
	}

};

$scope.draw = function(){
	$scope.game.result = "TIE GAME!";
	$scope.game.gameOver = true;
	$scope.game.$save();		

};


$scope.playerWon = function(player){

	if(player == 1) {
		$scope.game.result = "Red wins the game!";
		$scope.game.player1++;
	}
	else {
		$scope.game.result = "Green wins the game!";
		$scope.game.player2++;
	}
	$scope.game.gameOver = true;
	$scope.game.$save();		


};
});
});