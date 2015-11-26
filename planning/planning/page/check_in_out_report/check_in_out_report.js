var page = "";
var $project="";
frappe.pages['Check In Out Report'].on_page_load = function(wrapper) {
	page = frappe.ui.make_app_page({
		parent : wrapper,
		title : 'Check In Out Report',
		single_column : true
	});
	page.main.append(frappe.render_template('check_in_out_report', {
		data : {}
	}));

	page.$project = wrapper.page.add_field({
		fieldname : "Project",
		fieldtype : "Link",
		options : "NNProject",
		label : __("Project Name")
	}).$input.change(function() {
		
	});;
	page.$employee = wrapper.page.add_field({
		fieldname : "Employee",
		fieldtype : "Link",
		options : "Employee",
		label : __("Employee Name"),
	}).$input.change(function() {
		
	});
	page.$from_date = wrapper.page.add_field({
		fieldname : "From Date",
		fieldtype : "Date",
		label : __("From Date "),
		default: get_today()
	}).$input.ready(function() {
		
	});
	page.$to_date = wrapper.page.add_field({
		fieldname : "To Date",
		fieldtype : "Date",
		label : __("To Date "),
		default: get_today()
	}).$input.ready(function() {
		
	});
	page.$search = wrapper.page.add_field({
		fieldname : "Search",
		fieldtype : "Button",
		label : __("Search")
	}).$input.click(function() {
		load_report_in_out();
	});

var load_report_in_out = function() {	
	to_date=page.$to_date.val();
	from_date=page.$from_date.val();
	project=page.$project.val();
	employee=page.$employee.val();
frappe.call({
	method : "planning.planning.page.check_in_out_report.check_in_out_report.report_in_out",
	args : {
		"date1" : from_date,
		"date2" : to_date,
		"project" : project,
		"employee" : employee,
		},
		callback : function(data) {			
			var dm=data.message;
			var table="<h4 style='text-align:right;'><a href='desk#check-in-out' target='_blank'>Check In/Out</a></h4>";
			//table="";
			table=table+"<table><tr><td>S.No</td><td>List of Task (Project)</td><td>Scheduled Hours</td><td>Worked Hours</td><td>Status</td></tr>";
			for(var d=0;d<dm.length;d++){		
				table=table+"<tr class='dateRow'><td colspan='5' >"+dm[d]['date']+"</td></tr>";
				var val=dm[d]['value']
				if(val.length>0){
					for(var v=0;v<val.length;v++){
						if(v==parseInt(val.length-1))
							{
							final_tr=1;
							sno="";
							}
							else
							{
							inal_tr=0;
							sno=v+1;
							}
						
						   
							table=table+"<tr><td>"+(sno)+"</td><td><a href='desk#Form/NNTask/"+val[v]['taskname']+"' target='_blank' style='color:"+val[v]['ont']+"'>"+val[v]['task']+"</a></td><td style='text-align:right;'>"+val[v]['sh']+"</td><td style='text-align:right;'>"+val[v]['wh']+"</td><td>"+val[v]['status']+"</td></tr>";
					}
				}else{
					table=table+"<tr><td colspan='5' style='text-align:center;background-color:#ffffff;height:20px;'>No Records Found</td></tr>";
				}
				
				
			}
			table=table+"</table>";
			$(".CSSTableGenerator").html(table)
		}
});

}
load_report_in_out();
}