//script makes search box more intuitive by enabling/disabling options
//also creates "select all" buttons

//creates select all button
function select_all(cb, sel)
{
	if(sel.checked)
	{
		for(var i = 0; i < cb.length; i++)
		{
			cb[i].checked = true;
		}
	}
}

//deactivates select all box when all boxes are not selected
var deselect = function(cb, sel)
{
	if(!cb.checked)
	{
		sel.checked = false;
	}
}

//adds the listener for a function (needed to facilitate scope in for loops that add listeners)
function listen(a, b, func)
{
	a.addEventListener("click", function() {func(a, b);}, false);
}

//event handler for players select all box
var all_players = document.getElementById("all_p");  //select all box for players
var players = document.getElementsByName("player[]");  //array of players checkboxes
all_players.addEventListener("click", function() {select_all(players, all_players);}, false);

//event handler for opponents select all box
var all_opponents = document.getElementById("all_o");  //select all box for opponents
var opponents = document.getElementsByName("opponent[]");  //array of opponents checkboxes
all_opponents.addEventListener("click", function() {select_all(opponents, all_opponents);}, false);

//creates event handlers for players checkboxes to deactivate the select all box when any sub boxes are deactivated
for(var i = 0; i < players.length; i++)
{
	listen(players[i], all_players, deselect);
}

//creates event handlers for opponents checkboxes to deactivate the select all box when any sub boxes are deactivated
for(var i = 0; i < opponents.length; i++)
{
	listen(opponents[i], all_opponents, deselect);
}

//enables all opponent checkboxes
function enable_opp(cb, all)
{
	all.disabled = false;
	for(var i = 0; i < cb.length; i++)
	{
		cb[i].disabled = false;
	}
}
//disables all opponent checkboxes
function disable_opp(cb, all)
{
	all.disabled = true;
	for(var i = 0; i < cb.length; i++)
	{
		cb[i].disabled = true;
	}
}

//creates event handlers for radio buttons to enable/disable opponent checkboxes
var opp_yes = document.getElementsByName("toggle_opponent")[0];
var opp_no = document.getElementsByName("toggle_opponent")[1];
opp_yes.addEventListener("click", function() {enable_opp(opponents, all_opponents);}, false);
opp_no.addEventListener("click", function() {disable_opp(opponents, all_opponents);}, false);

//enables/disables min_marg/max_marg text boxes
function tog_marg(toggle, min, max)
{
	if(toggle.checked)
	{
		min.disabled = false;
		max.disabled = false;
	}
	else
	{
		min.disabled = true;
		max.disabled = true;
	}
}
//adds event listener for enabling/disabling win margin text input fields
var toggle_margin = document.getElementById("margin");
var min_marg = document.getElementById("min_marg");
var max_marg = document.getElementById("max_marg");
toggle_margin.addEventListener("click", function() {tog_marg(toggle_margin, min_marg, max_marg);}, false);

//enables or disables the win margin toggle checkbox based on search type radio buttons
var disable_marg_toggle = function(radio, cb)
{
	if(radio.value === "record")
	{
		cb.disabled = false;
	}
	else
	{
		cb.disabled = true;
	}
}
//enables and disables text input fields max_marg and min_marg based on search type radio buttons
var disable_marg = function(radio, arr)
{
	if(radio.value === "record" && arr[2].checked) //arr[2] = toggle checkbox for max/min margin
	{
		arr[0].disabled = false; //min_marg text input
		arr[1].disabled = false; //max_marg text input
	}
	else
	{
		arr[0].disabled = true;
		arr[1].disabled = true;
	}
}

var margin_arr = new Array(min_marg, max_marg, toggle_margin); //passed to listen() function

//adds event listeners to radio buttons for search type that will enable/disable win margin input fields
var search = document.getElementsByName("search_type");
for(var i = 0; i < search.length; i++)
{
	listen(search[i], toggle_margin, disable_marg_toggle);
	listen(search[i], margin_arr, disable_marg);
}