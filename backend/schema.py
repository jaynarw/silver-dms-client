acceptFile = {
    "type": "object",
    "properties": {
        "id": {"type": "string"},
        "row_id": {"type": "string"},
        "course_code": {"type": "string"},
        "updated_title": {"type": "string"},
    },
    "required": ["id", "row_id", "course_code"],
}
acceptMultipleFiles = {
    "type": "object",
    "properties": {
        "ids": {
            "type": "array",
            "items": {
                "type": "string",
            },
        },
        "row_id": {"type": "string"},
        "course_code": {"type": "string"},
        "updated_title_obj": {"type": "object"},
    },
    "required": ["ids", "row_id", "course_code"],
}