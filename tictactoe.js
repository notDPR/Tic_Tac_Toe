$(document).on('click','body',function(event){
	event.preventDefault();
});


$(document).ready(function(){
	AOS.init();
	FastClick.attach(document.body);
	gameCode();
});

// GAME CODE
function gameCode(){

	$('td').addClass("hoverable");
	$('td i').addClass("large");
	$(".card-title .p1,.p2").addClass("pulse");
	Materialize.toast("'नया खेल' बटन दबाएं") ;
	$(".material-icons").filter(".pehla,.dusra").hide();
	 // $('.material-icons').addClass("waves-effect");

	var turn = "pehla" ; 
	var matrix = [[-3,-3,-3],[-3,-3,-3],[-3,-3,-3]];

	// CLICK FUNCTION
	$("table tr").on("click",".check",function(event){
	$(this).removeClass("check");
	var pehla = $(this).find(".pehla");
	var dusra = $(this).find(".dusra");
	var start = $(this).find(".start");

	// UPDATING MATRIX
	var td_id = $(this).attr("id");
	
	if(start.css("display") != "none"){
		if(turn=="pehla"){
			start.fadeOut("fast");	
			pehla.delay(200).fadeIn("fast");
			pehla.addClass("dark");
			matrix[td_id.charAt(0)][td_id.charAt(1)] = 0 ;
			turn="dusra";
		}
		else{
			start.fadeOut("fast");
			dusra.delay(200).fadeIn("fast");
			dusra.addClass("dark");
			matrix[td_id.charAt(0)][td_id.charAt(1)] = 1 ;
			turn = "pehla";	
		}
	}
	else{
		console.log("ERROR : '.start' is not disaplyed");
	}
	$(".card-title .p1,.p2").toggleClass("pulse");
	$(this).addClass("z-depth-4");

	// WINNER CHECK
	var gameWin = checkWin(matrix);  // returns an object
	// console.log(gameWin);

	if(gameWin.winner==0 || gameWin.winner==1){ // Someone won the game
		playerWon(gameWin);
	}
	else{  
		if(noWinnerGameCompleteCheck(matrix)){	// No Winner (Game complete)
			Materialize.Toast.removeAll();
			Materialize.toast("कोई नहीं जीता");
			$(".card-title .p1,.p2").addClass("pulse");
		}
		else{	// No Winner (Game running)
			Materialize.Toast.removeAll();
			if(turn=="pehla") Materialize.toast("'O' : की बारी",1000);
			else if(turn=="dusra") Materialize.toast("'X' : की बारी",1000);
		}
	}
});
	// NEW GAME button
	$(".card-action").on("click","#newgame",function(event){
		var tds = $("table tr td");
		tds.addClass("check");
		$(".card-title i").removeClass("dark");
		$(".card-title #naam").removeClass("dark");
		tds.find(".pehla:visible,.dusra:visible").fadeOut("fast");
		tds.find(".start:hidden").delay("200").fadeIn("fast");
		tds.removeClass("winShow" ,600) ;
		tds.removeClass("z-depth-4");
		Materialize.Toast.removeAll();

		$(".card-title .p1,.p2").removeClass("pulse");
		$(".card-title .p1").addClass("pulse");
		Materialize.toast("'O' : की बारी",2000);
		turn = "pehla" ;

		// RESETTING THE MATRIX
		matrix = matrixReset(matrix);
	});
}

// No Winner (Game Complete)
function noWinnerGameCompleteCheck(matrx){
	var mat = matrx ;
	for(var i=0;i<3;i++){
		for(var j=0;j<3;j++){
			if(mat[i][j] == -3) return false ;
		}
	}
	return true ;
}

// MATRIX RESET
function matrixReset(matrx){
	var mat = matrx ;
	for(var i=0;i<3;i++){
		for(var j=0;j<3;j++){
			mat[i][j] = -3 ;
		}
	}
	return mat ;
}


//Someone won the game
function playerWon(player){
	$("table tr td").removeClass("check") ;
	$(".card-title .p1,.p2").removeClass("pulse");
	Materialize.Toast.removeAll();
	$(".card-title #naam").addClass("dark",500);
	if(player.winner==0){
		$(".card-title .p1").addClass("pulse") ;
		Materialize.toast("'O' खेल जीत गया");
		$(".card .card-content .card-title i").first().addClass("dark",500);
		
	}
	else{
		$(".card-title .p2").addClass("pulse");
		Materialize.toast("'X' खेल जीत गया");
		$(".card .card-content .card-title i").last().addClass("dark",500);
	}

	// illuminating the winner 'tds'
	if(player.row != undefined){
		var tds = $("tr:eq(" + player.row + ")").find("td") ;
		tds.first().delay(200).addClass("winShow",500);
		tds.first().next().delay(300).addClass("winShow",500);
		tds.last().delay(400).addClass("winShow",500);
	}
	else {
		if(player.col != undefined){
			var trs = $("table tr");
			trs.first().find("td:eq("+player.col+")").delay(200).addClass("winShow",500);
			trs.first().next().find("td:eq("+player.col+")").delay(300).addClass("winShow",500);
			trs.last().find("td:eq("+player.col+")").delay(400).addClass("winShow",500);
		}
		else{
			if(player.diag != undefined){
				var trs = $("table tr");
				if(player.diag == "top"){
					trs.first().find("td:eq(0)").delay(200).addClass("winShow",500);
					trs.first().next().find("td:eq(1)").delay(300).addClass("winShow",500);
					trs.last().find("td:eq(2)").delay(400).addClass("winShow",500);
				}
				else{
					if(player.diag == "bottom"){
					trs.last().find("td:eq(0)").delay(200).addClass("winShow",500);
					trs.first().next().find("td:eq(1)").delay(300).addClass("winShow",500);
					trs.first().find("td:eq(2)").delay(400).addClass("winShow",500);
					}
				}
			}
		}
	}
}


// Winner check
function checkWin(mat){
	var hor = horizontal(mat);
	if(hor.winner != -3)	return hor ;
	else{
		var ver = vertical(mat) ;
		if(ver.winner != -3) return ver ;
		else{
			var dia = diagonal(mat) ;
			if(dia.winner != 3) return dia ;
			else return -3 ; 
		}
	}
}

// Search for winner
function horizontal(mat){
	for(var i=0;i<3;i++){
		if( ( (mat[i][0]+mat[i][1]+mat[i][2]) == 3 ) || ( (mat[i][0]+mat[i][1]+mat[i][2]) == 0) )
			return {winner : mat[i][1] , row : i} ;
	}
	return {winner : -3} ; 
}

function vertical(mat){
	for(var j=0;j<3;j++){
		if( ( (mat[0][j]+mat[1][j]+mat[2][j]) == 3 ) || ( (mat[0][j]+mat[1][j]+mat[2][j]) == 0) )
			return {winner : mat[1][j] , col : j };
	}
	return {winner : -3} ;
}

function diagonal(mat){
	if( ((mat[0][0] + mat[1][1] + mat[2][2]) == 3) || ( (mat[0][0] + mat[1][1] + mat[2][2]) == 0) ) 
		return {winner : mat[1][1] , diag : "top" };
	else {
		if( ((mat[2][0] + mat[1][1] + mat[0][2]) == 3) || ( (mat[2][0] + mat[1][1] + mat[0][2]) == 0) )
			return {winner : mat[1][1] , diag : "bottom" };
		else return {winner : -3} ;
	}
}