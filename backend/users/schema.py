from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiParameter, extend_schema
from .serializers import UserSerializer

user_docs = extend_schema(
    summary="Retrieve a list of users with optional filtering",
    description="""
    Handles GET requests to list users with optional filtering.

    Filters:
    - username: Filter users by their username.
    - user_id: Retrieve a specific user by their ID.

    Examples:
    1. List all users:
       GET /users/
    2. Retrieve a specific user by ID:
       GET /users/?user_id=3
    3. Filter users by username:
       GET /users/?username=johndoe

    Returns:
    - A JSON response containing the user(s) matching the filter.
    - An error message with the appropriate HTTP status code if something goes wrong.

    Possible Status Codes:
    - 200: Success.
    - 404: User with the provided ID does not exist.
    - 500: An unexpected server error occurred.
    """,
    responses={
        200: UserSerializer(),
        404: OpenApiTypes.OBJECT,
        500: OpenApiTypes.OBJECT,
    },
    parameters=[
        OpenApiParameter(
            name="user_id",
            type=OpenApiTypes.INT,
            location=OpenApiParameter.QUERY,
            required=False,
            description="Retrieve a specific user by their ID. Example: 2.",
        ),
    ],
    tags=["Users"],
)


logout_docs = extend_schema(
    summary="Logout user by deleting JWT cookies",
    description="Handles POST requests to log out a user. This deletes the JWT cookies for authentication.",
    responses={
        204: OpenApiTypes.OBJECT,
        400: OpenApiTypes.OBJECT
    },
    tags=["Authentication"]
)
