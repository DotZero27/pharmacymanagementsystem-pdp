from send_email import send_email
from datetime import date, datetime
from CustomerTemplate import AbstractCustomer
from Iterator import DrugIterator


class Customer(AbstractCustomer):
    def __init__(self, name, email, phone, meds):
        self.name = name
        self.email = email
        self.phone = phone
        self.meds = meds
        self.purchase_datetime = None
        self.message_content = None

    def notify(self, customer_data):
        self.generate_email_content(customer_data)
        send_email(
            self.email, "Update of your recent medicine purchase", self.message_content
        )

    def generate_email_content(self, customer_data):
        today = date.today()
        now = datetime.now()
        self.purchase_datetime = (
            today.strftime("%d/%m/%Y") + " " + now.strftime("%I:%M %p")
        )

        self.message_content = f"""
Dear {self.name},
    Thank you for purchasing at ABC Pharma. The following are the details of your recent purchase:

    Name: {self.name}
    Email: {self.email}
    Phone: {self.phone}
    Purchase Date and Time: {self.purchase_datetime}
    Total Quantity: {customer_data["totalquantity"]} nos.
    Total Amount Payable: ₹{customer_data["totalamountpayable"]}

    The following are the details of your medicines you have purchased:"""

        drugs = DrugIterator(customer_data["meds"])
        drug_iter = iter(drugs)

        while True:
            try:
                self.message_content += next(drugs)
            except StopIteration:
                break

        self.message_content += "\n\nWishing you a speedy recovery!\nThank you."
