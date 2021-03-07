from enum import Enum, unique


@unique
class HttpMethod(Enum):
    GET = "GET"
    POST = "POST"