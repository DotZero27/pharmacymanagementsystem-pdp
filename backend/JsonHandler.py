import json
import os


class JsonHandler:
    _instance = None

    def __init__(self):
        if JsonHandler._instance is not None:
            print("[WARNING] Cannot create more than 1 instance of a file handler")
            return JsonHandler._instance
        else:
            JsonHandler._instance = self

    def read_content(self, json_filename):
        if json_filename in os.listdir():
            return json.load(open(json_filename, "r"))
        else:
            return {}

    def write_content(self, json_filename, new_data):
        old_content = self.read_content(json_filename)
        old_content.update(new_data)

        json.dump(old_content, open(json_filename, "w"), indent=4)

    def rewrite_content(self, json_filename, data):
        json.dump(data, open(json_filename, "w"), indent=4)
