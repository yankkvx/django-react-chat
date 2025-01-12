from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiParameter, extend_schema

from .serializers import ServerSerializer, CategorySerializer

server_docs = extend_schema(
    summary="List servers with optional filtering",
    description="""
    Handles GET requests to list servers with optional filtering.

    Filters:
    - category: Filter servers by category name.
    - by_user: Filter servers by membership of the requesting user.
    - quantity: Limit the number of results returned.
    - server_id: Retrieve a specific server by its ID.
    - num_members: Count the number of server members.

    Examples:
    1. List all servers:
       GET /servers/select/
    2. Filter by category:
       GET /servers/select/?category=programming
    3. Filter by user membership:
       GET /servers/select/?by_user=true
    4. Limit number of results:
       GET /servers/select/?quantity=2
    5. Retrieve server by ID:
       GET /servers/select/?server_id=3
    6. Count the number of members:
       GET /servers/select/?num_members=true

    Returns:
    - A JSON response containing the list of servers matching the filters.
    - An error message with the appropriate HTTP status code if something goes wrong.

    Possible Status Codes:
    - 200: Success.
    - 404: Server with the provided ID does not exist.
    - 500: An unexpected server error occurred.
    """,
    responses={
        200: ServerSerializer(many=True),
        404: OpenApiTypes.OBJECT,
        500: OpenApiTypes.OBJECT,
    },
    parameters=[
        OpenApiParameter(
            name="category",
            type=OpenApiTypes.STR,
            location=OpenApiParameter.QUERY,
            required=False,
            description="Filter servers by category name. Example: 'Gaming'.",
        ),
        OpenApiParameter(
            name="quantity",
            type=OpenApiTypes.INT,
            location=OpenApiParameter.QUERY,
            required=False,
            description="Limit the number of servers returned. Example: 10.",
        ),
        OpenApiParameter(
            name="by_user",
            type=OpenApiTypes.BOOL,
            location=OpenApiParameter.QUERY,
            required=False,
            description="Filter servers where the authenticated user is a member. Set to 'true' or 'false'.",
        ),
        OpenApiParameter(
            name="num_members",
            type=OpenApiTypes.STR,
            location=OpenApiParameter.QUERY,
            required=False,
            description="Annotate servers with the number of members. Set to 'true' or 'false'.",
        ),
        OpenApiParameter(
            name="server_id",
            type=OpenApiTypes.INT,
            location=OpenApiParameter.QUERY,
            required=False,
            description="Retrieve a specific server by its ID. Example: 42.",
        ),
    ],
    tags=["Servers"],
)


category_docs = extend_schema(
    summary="List categories with optional filtering",
    description="""
    Handles GET requests to list categories with optional filtering.

    Filters:
    - category_name: Filter categories by name.

    Examples:
    1. List all categories:
       GET /categories/
    2. Filter by category name:
       GET /categories/?category_name=Music

    Returns:
    - A JSON response containing the list of categories matching the filters.
    - An error message with the appropriate HTTP status code if something goes wrong.

    Possible Status Codes:
    - 200: Success.
    - 500: An unexpected server error occurred.
    """,
    responses={
        200: CategorySerializer(many=True),
        500: OpenApiTypes.OBJECT,
    },
    parameters=[
        OpenApiParameter(
            name="category_name",
            type=OpenApiTypes.STR,
            location=OpenApiParameter.QUERY,
            required=False,
            description="Filter categories by name. Example: 'Music'.",
        ),
    ],
    tags=["Categories"],
)
