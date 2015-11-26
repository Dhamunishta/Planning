# -*- coding: utf-8 -*-
# Copyright (c) 2015, nishta and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class NNMilestone(Document):
	pass

	def autoname(self):
		no_rows = frappe.db.count("NNMilestone")
		milestone = self.milestone +"-"+str(no_rows)
		self.milestone = milestone
		self.name = milestone
		
			
