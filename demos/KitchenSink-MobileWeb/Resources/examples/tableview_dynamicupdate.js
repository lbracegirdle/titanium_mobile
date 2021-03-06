
var win = Ti.UI.currentWindow;

var data = [];
var lastRow = 10;
for (var c=0;c<lastRow;c++)
{
	data[c] = {title:"Row "+(c+1)};
}

var tableView = Ti.UI.createTableView({
	data: data,
	width: 300,
	height: 200
});

win.add(tableView);


var updating = false;
var loadingRow = Ti.UI.createTableViewRow({title:"Loading..."});

function beginUpdate()
{
	updating = true;
	tableView.appendRow(loadingRow);

	// just mock out the reload
	setTimeout(endUpdate,2000);
}

function endUpdate()
{
	updating = false;

	tableView.deleteRow(lastRow,{animationStyle:Titanium.UI.iPhone.RowAnimationStyle.NONE});

	// simulate loading
	for (var c=lastRow;c<lastRow+10;c++)
	{
		tableView.appendRow({title:"Row "+(c+1)},{animationStyle:Titanium.UI.iPhone.RowAnimationStyle.NONE});
	}
	lastRow += 10;

	// just scroll down a bit to the new rows to bring them into view
	tableView.scrollToIndex(lastRow-9,{animated:true,position:Ti.UI.iPhone.TableViewScrollPosition.BOTTOM});

}

var lastDistance = 0; // calculate location to determine direction

tableView.addEventListener('scroll',function(e)
{	var offset = e.contentOffset.y;
	var height = e.size.height;
	var total = offset + height;
	var theEnd = e.contentSize.height;
	var distance = theEnd - total;
//	console.log('offset:',offset, 'height:', height, 'total:', total, 'theEnd:', theEnd, 'distance:', distance);
	// going down is the only time we dynamically load,
	// going up we can safely ignore -- note here that
	// the values will be negative so we do the opposite
	if (distance < lastDistance)
	{
		
		// adjust the % of rows scrolled before we decide to start fetching
		var nearEnd = theEnd * .75;
		if (!updating && (total >= nearEnd))
		{	
			beginUpdate();
		}
	}
	lastDistance = distance;
});

var closeButton = Ti.UI.createButton({
	title:'Close Window',
	height:40,
	width:300,
	top:260,
	left:10,
	font:{fontSize:20}
});

closeButton.addEventListener('click', function(){
	Titanium.UI.currentWindow.close();
});

win.add(closeButton);
