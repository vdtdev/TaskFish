

function init_theme(){
	$("#main-tabs").tabs();
	fishlist("tasklist-incomplete");
}




$("window").load($(function(){init_theme();}));

var fishlist=function(e){
	$("#"+e).each(function(i,el){
		$(this).addClass("ui-widget-header");
	});
};

//$(".status").change($(taskData.update_data()));
