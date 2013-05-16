<?php 
	Header ("Content-type: text/css");

	$tileBorder = "2px solid #000";
?>

#board{
	display:table;
}
.trow{
	display:table-row;
}
.tile{
	display:table-cell;
	padding:2px;
}
.t-br{
	border-right: <?php echo $tileBorder;?>;
}
.t-bb{
	border-bottom: <?php echo $tileBorder;?>;
}

#solve-btn{
	margin: 10px 0 0 0;
}
