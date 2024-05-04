class DrugIterator:
    def __init__(self, customer_drug_data):
        self.customer_drug_data = customer_drug_data
        self.counter = -1
        self.string = []
        self.build_string()

    def build_string(self):
        for drugID, drug_details in self.customer_drug_data.items():
            self.string.append(
                f"{drug_details['drug_name']} : {drug_details['provider']} - {drug_details['quantity']} nos. - ₹{drug_details['amountpayable']}"
            )

    def __iter__(self):
        return self

    def __next__(self):
        self.counter += 1
        if self.counter >= len(self.string):
            raise StopIteration
        else:
            return f"\n        {self.counter+1}. " + self.string[self.counter]
