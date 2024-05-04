import os
import json


class FileHandler:
    instances = []
    handlers = {}

    def __init__(self, filename, mode, name):
        if (filename, mode, name) in FileHandler.instances:
            return FileHandler.handlers[name]
        else:
            if mode.lower().strip() not in ("r", "w", "a"):
                raise ValueError("Please specify proper mode!")

            if mode == "r" and not self.check_file_exists(filename):
                raise FileNotFoundError("File is not found!")

            FileHandler.instances.append((filename, mode, name))
            FileHandler.handlers[name] = open(filename, mode)

            if mode == "w":
                json.dump({}, FileHandler.handlers[name])
                FileHandler.handlers[name].close()
                temp_mode = "r" if mode == "r" else "a"
                FileHandler.handlers[name] = open(self.get_filename(name), temp_mode)

    def check_file_exists(self, filename):
        return filename in os.listdir()

    def read_data(self, name):
        if name not in FileHandler.handlers:
            raise ValueError("Name not found!")
        return json.load(open(self.get_filename(FileHandler.handlers[name]), "r"))

    def force_read(self, name):
        return json.load(open(name, "r"))

    def force_write(self, name):
        write_object = open(name, "w")
        json.dump({}, write_object)
        write_object.close()
        write_object = open(name, "a")
        return write_object

    def get_filename(self, name):
        for row in FileHandler.instances:
            if row[2] == name:
                return row[0]

    def write_data(self, name, new_data):
        if name not in FileHandler.handlers:
            raise ValueError("Name not found!")
        old_data = self.force_read(self.get_filename(name))
        old_data.update(new_data)
        write_object = self.force_write(self.get_filename(name))
        json.dump(old_data, write_object)
        write_object.close()

    def close(self, name):
        if name not in FileHandler.handlers:
            raise ValueError("Name not found!")
        FileHandler.handlers[name].close()
        del FileHandler.handlers[name]


def main():
    # Example usage
    filename = "example.json"
    mode = "w"  # You can change the mode as needed
    name = "example_handler"

    # Creating an instance of FileHandler
    file_handler = FileHandler(filename, mode, name)

    # Writing data
    data_to_write = {"key1": "value1"}
    file_handler.write_data(name, data_to_write)

    # Reading data
    read_data = file_handler.read_data(name)
    print("Read Data:", read_data)

    # Appending more data
    additional_data = {"key2": "value2"}
    file_handler.write_data(name, additional_data)

    # Reading data after appending
    read_data_after_append = file_handler.read_data(name)
    print("Read Data After Append:", read_data_after_append)

    # Closing the file handler
    file_handler.close(name)


if __name__ == "__main__":
    main()
