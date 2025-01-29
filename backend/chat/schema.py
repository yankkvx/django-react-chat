from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiParameter, extend_schema

from .serializers import MessageSerializer

message_docs = extend_schema(
    summary="List messages for a specific communication channel",
    description="""
    Handles GET requests to list messages in a communication channel.

    Filters:
    - channel_id: The ID of the communication channel to retrieve messages for.

    Example:
    1. List messages for a channel:
       GET /messages/?channel_id=123

    Returns:
    - A JSON response containing the list of messages for the given channel.
    - An error message with the appropriate HTTP status code if something goes wrong.

    Possible Status Codes:
    - 200: Success, with a list of messages.
    - 404: Communication channel not found with the provided channel_id.
    - 500: An unexpected server error occurred.
    """,
    responses={
        200: MessageSerializer(many=True),
        404: OpenApiTypes.OBJECT,
        500: OpenApiTypes.OBJECT,
    },
    parameters=[
        OpenApiParameter(
            name="channel_id",
            type=OpenApiTypes.INT,
            location=OpenApiParameter.QUERY,
            required=True,
            description="The ID of the communication channel to retrieve messages for. Example: 123.",
        ),
    ],
    tags=["Messages"],
)
