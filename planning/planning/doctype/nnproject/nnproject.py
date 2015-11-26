# -*- coding: utf-8 -*-
# Copyright (c) 2015, nishta and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from xmllib import doctype

class NNProject(Document):
	pass
	def validate(self):
		stime = self.expected_start_date
		etime = self.expected_end_date
		i = 1
		allocate_to_arr = []
		for d in self.assign_to:
			if d.members in allocate_to_arr:
				frappe.msgprint("Assign to " + str(d.members) + " Already Exists ( Row No : " + str(i) + ")", raise_exception=1)
			else:
				allocate_to_arr.append(d.members)			
		if stime > etime:
			frappe.msgprint("Start date greater than End date", raise_exception=1)

@frappe.whitelist()
def employee_values_load(naming_series=None):
    return_values = frappe.db.sql("""select employee_name,hourly_rate from tabEmployee where employee=%s""", naming_series)
    return return_values
 
@frappe.whitelist()
def save_msg(doctype, method):
	frappe.msgprint("Data Saved")
	
@frappe.whitelist()
def update_msg(doctype, method):
	frappe.msgprint("Data Saved")
	