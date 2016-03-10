var EPJS_Stats_GoogleGraph_Personalizzato = Class.create(EPJS_Stats, {

	initialize: function($super,params) {

        	$super( params );
		this.view = 'Google::Graph';
		this.draw();
	},
	
	ajax: function($super,response) {

		$super();

		var json = response.responseText.evalJSON();
		
		var container = $( this.container_id );

		// potential error message (eg. no data points)
		var msg = json.msg
	
		if( msg != null )
		{
			// for summary page
			var elparent = container.up( "div[class=ep_summary_box_body]" );

			if( elparent != null )
			{
				elparent.update( "<p>" + msg + "</p>" );
				return;
			}
		}

		var jsdata = json.data;

		var data = new google.visualization.DataTable();
		data.addColumn('string', 'Year');
		data.addColumn('number', ' ');

		if( json.show_average )
			data.addColumn('number', ' ');

		data.addRows( jsdata );

		var w = container.getWidth()-2;
		var h = container.getHeight()-2;

		var type = json.type;
		var chart;

		if( json.show_average )
			chart = new google.visualization.ComboChart( container );
		else
		{
			if( type == null || type == 'area' )
				chart = new google.visualization.AreaChart(container);
			else
				chart = new google.visualization.ColumnChart(container);
		}

		var options = {
			width: w, 
			height: h,
			lineWidth: 3, 
			colors: ['#A73743','#FF8000'],
			titleTextStyle: { color: '#A73743', fontName: 'Open Sans'},
			backgroundColor: {},
			hAxis: {
				titleTextStyle: { color: '#A73743', fontName: 'Open Sans'},
				slantedText: false,
				maxAlternation: 1 },
			legend: 'none', 
			vAxis: {
				titleTextStyle: { color: '#A73743', fontName: 'Open Sans'},
				viewWindowMode: 'maximized', 
				viewWindow: { min: 0 } }
		}
		options.backgroundColor.stroke='#A73743';
		options.backgroundColor.strokeWidth=0;
		if (this.options.get('title')) {
			options.title=this.options.get('title');
		}
		if (this.options.get('hAxis_title')) {
			options.hAxis.title=this.options.get('hAxis_title');
		}
		if (this.options.get('vAxis_title')) {
			options.vAxis.title=this.options.get('vAxis_title');
		}

		if( json.show_average )
		{
			options.seriesType = 'bars';	
			options.series = { 1: { type: 'line', lineWidth: 1 } };
		}

		chart.draw( data, options );
	}
});

