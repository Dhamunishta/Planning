from __future__ import unicode_literals
import frappe
from frappe.utils import getdate, validate_email_add, today
import datetime
from planning.planning.myfunction import mail_format_pms, actual_date_update, close_task_update, time_calculation_employee, total_worked_time_seconds, task_project_name, hms_to_seconds

@frappe.whitelist()
def report_in_out(date1=None, date2=None, project=None, employee=None):
    filter = ""
    
    if employee:
        employee_name = frappe.db.get_value("Employee", {"name":employee}, "employee_name")
        user_name = employee_name
    else:
        user_name = frappe.session.user
    if user_name != "Administrator":
        filter = " and t2.employee_name='" + user_name + "'"    
    date_arr = []
    if date1 and not date2:
        date2 = date1
    if date2 and not date1:
        date1 = date2;
    if not date1 and not date2:
        date1 = frappe.utils.data.nowdate ()
        date2 = frappe.utils.data.nowdate ()
    date1 = frappe.utils.data.formatdate(date1)
    date2 = frappe.utils.data.formatdate(date2)
    if date1 == date2:
        no_days = 1
    else:
        no_days = frappe.utils.data.date_diff(date2, date1) + 1
    if (no_days > 31):
        frappe.msgprint("More Then 31 Not Allowed", raise_exception=True)
    for num in range(0, no_days):
        date_loop = frappe.utils.data.add_days(date1, num)
        task_lists = frappe.db.sql("select t2.employee_name,t1.name as name,t1.duration as duration,t1.tasklist as tasklist,t1.expected_start_date as date from `tabNNTask` t1,`tabNNAssign` t2 where  t1.name=t2.parent and date(t1.expected_start_date)=%s " + filter + " order by t2.employee_name" , (date_loop), as_dict=True)
        total_duration_seconds = 0
        total_worked_seconds = 0
        sch_time_seconds = 0;
        worked_time_seconds = 0;
        temp_arr = []
        i = 0
        append_val = 0
        for task_list in task_lists:
            assign_to = ""
            if frappe.session.user == "Administrator":
                assign_to = task_list['employee_name']
                user_name = assign_to     
            task = task_list['name']
            duration = task_list['duration']
            task_list = task_list['tasklist']
            project_name = task_project_name(task_list);
            worked_time = time_calculation_employee(task_name=task, employee_name=user_name)
            close_status = frappe.db.sql("""select *from `tabNNAssign` where parent=%s""", task, as_dict=True)
            close_status_val = close_status[0 ]['close_status']
            if close_status_val == 0:
                close_status_val = "Open";
            else:
                close_status_val = "Close"
            sch_time_seconds = hms_to_seconds(duration);
            worked_time_seconds = total_worked_time_seconds(task_name=task, employee_name=user_name);
            total_worked_seconds += worked_time_seconds;
            total_duration_seconds += sch_time_seconds;
            if (sch_time_seconds < worked_time_seconds):
                ontime_status = "red"
            else:
                ontime_status = "green"
            if project:
                if project == project_name:
                    append_val = 1
                else:
                    append_val = 0
            else:
                append_val = 1
            if append_val == 1:
                taskp = task + "(" + project_name + ") <b>" + assign_to + "</b>";
                temp_arr.append({"task":taskp, "sh":duration, "wh":worked_time, "status":close_status_val, "ont":ontime_status, "taskname":task})
        total_worked_time = str(datetime.timedelta(seconds=total_worked_seconds))
        total_sch_time = str(datetime.timedelta(seconds=total_duration_seconds))
        if (sch_time_seconds < worked_time_seconds):
            ontime_status = "1"
        else:
            ontime_status = "0"
        if append_val == 1:
            temp_arr.append({"task":"Total Time", "sh":total_sch_time, "wh":total_worked_time, "status":"", "ont":ontime_status})
        date_arr.append({"date":date_loop, "value":temp_arr})
    return date_arr
