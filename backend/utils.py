import urllib.parse as urlparse
from urllib.parse import parse_qs


def get_attr_from_url(url, attribute):
    parsed = urlparse.urlparse(url)
    return parse_qs(parsed.query)[attribute][0]


def remove_name(filename):
    [name, ext] = filename.split(".")
    new_name = name.rsplit(" - ", 1)[0]
    return ".".join([new_name, ext])
