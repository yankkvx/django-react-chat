from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiParameter, extend_schema
from .serializers import UserSerializer, RegisterSerializer

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

register_docs = extend_schema(
    summary="Register a new user",
    description="""
    Handles POST requests to register a new user by providing the following data:
    - username: The username of the user.
    - email: The email address of the user.
    - password: The password for the new user (it will be hashed). **Make sure to include this field in the request body.**
    - profile_image: (Optional) The profile image of the user.

    The view performs checks to ensure that the email and username are unique. 
    If validation passes, the user will be created and returned with their data.

    Example Request Body:
    json
    {
        "username": "newuser",
        "email": "newuser@email.com",
        "password": "password123",
        "profile_image": "image.jpg"
    }
    

    Returns:
    - 201: A successful registration response with user data (without password).
    - 409: Conflict, if the username or email is already taken.
    - 500: Internal server error, in case of any server-related issue.
    """,
    responses={
        201: RegisterSerializer,  # Note: this serializer doesn't include password in the response
        409: OpenApiTypes.OBJECT,
        500: OpenApiTypes.OBJECT,
    },
    request=RegisterSerializer,
    tags=["Authentication"]
)