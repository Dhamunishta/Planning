//alert(frappe.get_user());
frappe.pages['check-in-out'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent : wrapper,
		title : 'Task check-in-out',
		single_column : true
	});
	page.main.append(frappe.render_template('check_in_out', {}));
	taskload();
}
function check_in_out_status(rowid) {
	var data = $("#v" + rowid).val().split(",");
	var task_name = data[0];
	var check_status = data[1];
	var name = data[2];
	var lab = "";
	if (check_status == 1) {
		lab = "Check Out";
	}
	if (check_status == 0) {
		lab = "Check In";
	}
	frappe
			.confirm(
					'Are you sure to ' + lab + '?',
					function() {
						frappe
								.call({
									method : "planning.planning.page.check_in_out.check_in_out.checking_checkout",
									args : {
										"task" : task_name,
										"check_status" : check_status,
										"name" : name
									},
									callback : function(data) {
										if (data == "") {
											taskload();
										} else {
											taskload();
										}

									}
								})
					}, function() {
						taskload();
					})

}
function close_task(rowid) {
	var data = $("#v" + rowid).val().split(",");
	var task_name = data[0];
	var check_status = data[1];
	var name = data[2];
	var assign_name = data[3];

	if (check_status == 1) {
		// check_in_out_status(rowid)
	}
	lab = "Close";
	frappe
			.confirm(
					'Are you sure to ' + lab + '?',
					function() {
						frappe
								.call({
									method : "planning.planning.page.check_in_out.check_in_out.close_task",
									args : {
										"assign_name" : assign_name
									},
									callback : function(data) {
										taskload();
									}
								})
					})
}
function taskload() {
	frappe
			.call({
				method : "planning.planning.page.check_in_out.check_in_out.getTask",
				args : {
					"doctype" : "NNTask"
				},
				callback : function(data) {
					if (typeof data.message == "undefined") {
						results = "No Records";
					} else {
						len_data = data.message.length;
						values = data.message;
						emp = values[0][4];
						var results = "";
						results = "<table border='1' width='100%'><tr><th colspan='10' style='text-align:center;'>"
								+ emp + "</th>";
						results = results
								+ "<Tr><th>S.No</th><th>Date & Time</th><th>Project</th><th>Milestone</th><th>TaskList</th><th>Task</th><th>Scheduled Time</th><th>Worked Time</th><th>Status</th><th>Close</th><tr>";
						for (i = 0; i < len_data; i++) {
							sno = i + 1;
							
							project = values[i][0]
							milestone = values[i][1]
							tasklist = values[i][2]
							task = values[i][3]
							emp = values[i][4]
							chekin_status = values[i][5]
							chekin_name = values[i][6]
							duration = values[i][7]
							worked_time = values[i][8];
							assign_name = values[i][9];
							create = values[i][10]

							var close = "<a href='javascript:void(0)' class='btn btn-sm btn-default pull-right' onclick='close_task("
									+ i + ")'>Close</a>";
							var check = "";
							var bc = "";
							var che_lab = "Check Out";
							var check_state = chekin_status;
							if (chekin_status == 1) {
								bc = "background:#E4FF80;";
								che_lab = "Check In";
								check_state = chekin_status;
								check = "checked='checked'";
								var close = "<a href='javascript:void(0)' class='btn btn-sm btn-default pull-right'>Working</a>";
							}

							// task_click=task.replace(" ", "~~");
							task_click = task.replace(/\s/g, '~~');
							// alert(task_click);
							status = ""
							results = results + "<tr style='" + che_lab + "'>";
							results = results + "<td>" + sno + "</td>";
							results = results + "<td>" + create + "</td>";
							results = results + "<td>" + project + "</td>";
							results = results + "<td>" + milestone + "</td>";
							results = results + "<td>" + tasklist + "</td>";
							results = results + "<td>" + task + "</td>";
							results = results + "<td>" + duration + "</td>";
							results = results + "<td>" + worked_time + "</td>";

							results = results
									+ "<td><div class='onoffswitch'><input type='hidden' value='"
									+ task + "," + chekin_status + ","
									+ chekin_name + "," + assign_name
									+ "' id='v" + i + "' />";

							results = results
									+ "<input type='checkbox' name='checkinout"
									+ i
									+ "' class='onoffswitch-checkbox' id='checkinout"
									+ i
									+ "' onchange='check_in_out_status("
									+ i
									+ ")' "
									+ check
									+ "><label class='onoffswitch-label' for='checkinout"
									+ i
									+ "'><span class='onoffswitch-inner'></span><span class='onoffswitch-switch'></span></label></div></td>";

							results = results + "<td>" + close + "</td>";
							results = results + "</tr>";
						}
						results = results + "</table>";
					}
					$("#taskdiv").html(results);
				}
			})
}
