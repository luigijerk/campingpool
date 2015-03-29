//creates a sortable table on clicks

//object constructor that holds all proprties of a statline
function player(name, record, percent, place, trans, points, adp, against, adpa)
{
	this.name=name;
	this.record=record;
	this.percent=percent;
	this.place=place;
	this.trans=trans;
	this.points=points;
	this.adp=adp;
	this.against=against;
	this.adpa=adpa;
}

//copies an array of nodes' innerHTML into another array
function nodelist(nodes, list)
{
	for(var i = 0; i < nodes.length; i++)
	{
		list[i] = nodes[i].innerHTML;
	}
}

//relists the table into innerHTML after being sorted, using an array of objects
function relist(name, record, percent, place, trans, points, adp, against, adpa, oblist)
{
	for(var i = 0; i < oblist.length; i++)
	{
		name[i].innerHTML = oblist[i].name;
		record[i].innerHTML = oblist[i].record;
		percent[i].innerHTML = oblist[i].percent;
		place[i].innerHTML = oblist[i].place;
		trans[i].innerHTML = oblist[i].trans;
		points[i].innerHTML = oblist[i].points;
		adp[i].innerHTML = oblist[i].adp;
		against[i].innerHTML = oblist[i].against;
		adpa[i].innerHTML = oblist[i].adpa;
	}
}

//sorts array of objects in ascending order based on this.prop
function ascend(prop)
{
	return function(a,b) {
		return a[prop] - b[prop];
	}
}

//sorts array of objects in descending order based on this.prop
function descend(prop)
{
	return function(a,b) {
		return b[prop] - a[prop];
	}
}

//creating node arrays, copy innerHTML to other arrays
var nname = document.getElementsByClassName("name");
var lname = new Array();
nodelist(nname, lname);

var nrecord = document.getElementsByClassName("record");
var lrecord = new Array();
nodelist(nrecord, lrecord);

var npercent = document.getElementsByClassName("percent");
var lpercent = new Array();
nodelist(npercent, lpercent);

var nplace = document.getElementsByClassName("place");
var lplace = new Array();
nodelist(nplace, lplace);

var ntrans = document.getElementsByClassName("trans");
var ltrans = new Array();
nodelist(ntrans, ltrans);

var npoints = document.getElementsByClassName("points");
var lpoints = new Array();
nodelist(npoints, lpoints);

var nadp = document.getElementsByClassName("adp");
var ladp = new Array();
nodelist(nadp, ladp);

var nagainst = document.getElementsByClassName("against");
var lagainst = new Array();
nodelist(nagainst, lagainst);

var nadpa = document.getElementsByClassName("adpa");
var ladpa = new Array();
nodelist(nadpa, ladpa);

//create array of player objects
var players = new Array();
for(var i = 0; i < lname.length; i++)
{
	var a = new player(lname[i], lrecord[i], lpercent[i], lplace[i], ltrans[i],
						lpoints[i], ladp[i], lagainst[i], ladpa[i]);
	players[i] = a;
}

//booleans to keep track of ascending/descending order, so each click can reverse order
var dname = false;
var dpercent = false;
var dplace = false;
var dtrans = false;
var dpoints = false;
var dadp = false;
var dagainst = false;
var dadpa = false;

//creating button nodes
var bpercent = document.getElementById("percent");
var bplace = document.getElementById("place");
var btrans = document.getElementById("trans");
var bpoints = document.getElementById("points");
var badp = document.getElementById("adp");
var bagainst = document.getElementById("against");
var badpa = document.getElementById("adpa");

//array of th nodes used for changing background-image sort arrows
var headers = document.getElementsByTagName("th");

//changes all sort arrows to neutral
function all_neutral(nodes)
{
	for(var i = 2; i < nodes.length; i++)
	{
		nodes[i].style.backgroundImage='url("images/bg.gif")';
	}
}

//adding event listeners
//sort by win percent
bpercent.addEventListener("click", function() { 
			all_neutral(headers);
			if(dpercent) {
				players.sort(ascend('percent'));
				dname = dpercent = dplace = dtrans = dpoints = dadp = dagainst = dadpa = false;
				headers[2].style.backgroundImage='url("images/desc.gif")';
			}
			else {
				players.sort(descend('percent'));
				dname = dplace = dtrans = dpoints = dadp = dagainst = dadpa = false;
				dpercent = true;
				headers[2].style.backgroundImage='url("images/asc.gif")';
			}
			relist(nname, nrecord, npercent, nplace, ntrans, npoints, nadp, nagainst, nadpa, players);
		}, false);

//sort by average place
bplace.addEventListener("click", function() { 
			all_neutral(headers);
			if(dplace) {
				players.sort(descend('place'));
				dname = dpercent = dplace = dtrans = dpoints = dadp = dagainst = dadpa = false;
				headers[3].style.backgroundImage='url("images/asc.gif")';
			}
			else {
				players.sort(ascend('place'));
				dname = dpercent = dtrans = dpoints = dadp = dagainst = dadpa = false;
				dplace = true;
				headers[3].style.backgroundImage='url("images/desc.gif")';
			}
			relist(nname, nrecord, npercent, nplace, ntrans, npoints, nadp, nagainst, nadpa, players);
		}, false);

//sort by transactions/year
btrans.addEventListener("click", function() { 
			all_neutral(headers);
			if(dtrans) {
				players.sort(ascend('trans'));
				dname = dpercent = dplace = dtrans = dpoints = dadp = dagainst = dadpa = false;
				headers[4].style.backgroundImage='url("images/desc.gif")';
			}
			else {
				players.sort(descend('trans'));
				dname = dpercent = dplace = dpoints = dadp = dagainst = dadpa = false;
				dtrans = true;
				headers[4].style.backgroundImage='url("images/asc.gif")';
			}
			relist(nname, nrecord, npercent, nplace, ntrans, npoints, nadp, nagainst, nadpa, players);
		}, false);

//sort by points/wk
bpoints.addEventListener("click", function() { 
			all_neutral(headers);
			if(dpoints) {
				players.sort(ascend('points'));
				dname = dpercent = dplace = dtrans = dpoints = dadp = dagainst = dadpa = false;
				headers[5].style.backgroundImage='url("images/desc.gif")';
			}
			else {
				players.sort(descend('points'));
				dname = dpercent = dplace = dtrans = dadp = dagainst = dadpa = false;
				dpoints = true;
				headers[5].style.backgroundImage='url("images/asc.gif")';
			}
			relist(nname, nrecord, npercent, nplace, ntrans, npoints, nadp, nagainst, nadpa, players);
		}, false);

//sort by adjusted points/wk
badp.addEventListener("click", function() { 
			all_neutral(headers);
			if(dadp) {
				players.sort(ascend('adp'));
				dname = dpercent = dplace = dtrans = dpoints = dadp = dagainst = dadpa = false;
				headers[6].style.backgroundImage='url("images/desc.gif")';
			}
			else {
				players.sort(descend('adp'));
				dname = dpercent = dplace = dtrans = dpoints = dagainst = dadpa = false;
				dadp = true;
				headers[6].style.backgroundImage='url("images/asc.gif")';
			}
			relist(nname, nrecord, npercent, nplace, ntrans, npoints, nadp, nagainst, nadpa, players);
		}, false);

//sort by points allowed/wk
bagainst.addEventListener("click", function() { 
			all_neutral(headers);
			if(dagainst) {
				players.sort(descend('against'));
				dname = dpercent = dplace = dtrans = dpoints = dadp = dagainst = dadpa = false;
				headers[7].style.backgroundImage='url("images/asc.gif")';
			}
			else {
				players.sort(ascend('against'));
				dname = dpercent = dplace = dtrans = dpoints = dadp = dadpa = false;
				dagainst = true;
				headers[7].style.backgroundImage='url("images/desc.gif")';
			}
			relist(nname, nrecord, npercent, nplace, ntrans, npoints, nadp, nagainst, nadpa, players);
		}, false);

//sort by adjusted points allowed/wk
badpa.addEventListener("click", function() { 
			all_neutral(headers);
			if(dadpa) {
				players.sort(descend('adpa'));
				dname = dpercent = dplace = dtrans = dpoints = dadp = dagainst = dadpa = false;
				headers[8].style.backgroundImage='url("images/asc.gif")';
			}
			else {
				players.sort(ascend('adpa'));
				dname = dpercent = dplace = dtrans = dpoints = dadp = dagainst = false;
				dadpa = true;
				headers[8].style.backgroundImage='url("images/desc.gif")';
			}
			relist(nname, nrecord, npercent, nplace, ntrans, npoints, nadp, nagainst, nadpa, players);
		}, false);

//default sort is by average place
players.sort(descend('percent'));
dname = dplace = dtrans = dpoints = dadp = dagainst = dadpa = false;
dpercent = true;
headers[2].style.backgroundImage='url("images/asc.gif")';
relist(nname, nrecord, npercent, nplace, ntrans, npoints, nadp, nagainst, nadpa, players);