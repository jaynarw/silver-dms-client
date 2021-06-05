import urllib.parse as urlparse
from urllib.parse import parse_qs


def get_attr_from_url(url, attribute):
    parsed = urlparse.urlparse(url)
    return parse_qs(parsed.query)[attribute][0]
