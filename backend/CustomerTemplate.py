from abc import ABC
from abc import abstractmethod


class AbstractCustomer(ABC):
    @abstractmethod
    def notify(self, customer_data) -> None:
        pass

    @abstractmethod
    def generate_email_content(self, customer_data) -> str:
        pass
