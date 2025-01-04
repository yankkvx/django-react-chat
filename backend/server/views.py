from django.shortcuts import render
from rest_framework import viewsets
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.db.models import Count
from .models import Server
from .serializers import ServerSerializer


class ServerViewSet(viewsets.ViewSet):
    """
    Custom ViewSet for managing Server objects.
    """

    queryset = Server.objects.all()

    def list(self, request):
        """
        Handles GET requests to list servers with optional filtering.

        Filters:
        - category: Filter servers by category name.
        - by_user: Filter servers by membership of the requesting user.
        - quantity: Limit the number of results returned.
        - server_id: Retrieve a specific server by its ID.
        - num_members: Count a number of server members.

        Examples:

        1. **List all servers**:
            GET /servers/
        2. **Filter by category**:
            GET /servers/?category=programming
        3. **Filter by user membership**:
            GET /servers/?by_user=true
        4. **Limit number of results**:
            GET /servers/?quantity=2
        5. **Retrieve server by id**:
            GET /servers/?server_id=3
        6. **Count the number of members**:
            GET /servers/?num_members=true

        Returns:
        - JSON response containing the list of servers or an error message.

        """

        try:
            queryset = self.queryset

            # Filter by category name if 'category' parameter is provided.
            category = request.query_params.get('category')
            if category:
                queryset = queryset.filter(category__name=category)

            # Filter servers where the requesting user is a member if 'by_user' is true.
            by_user = request.query_params.get('by_user') == 'true'
            if by_user:
                user_id = request.user.id
                queryset = queryset.filter(member=user_id)

            # Limit the number of results if 'quantity' parameter is provided.
            quantity = request.query_params.get('quantity')
            if quantity:
                queryset = queryset[:int(quantity)]

            # Annotate the queryset with the number of members if 'num_members' is 'true'.
            num_members = request.query_params.get('num_members') == 'true'
            if num_members:
                queryset = queryset.annotate(num_members=Count("member"))

            # Retrieve a specific server by its ID if 'server_id' parameter is provided.
            server_id = request.query_params.get('server_id')
            if server_id:
                try:
                    server_id = int(server_id)
                    queryset = queryset.filter(id=server_id)
                    if not queryset.exists():
                        return Response({'error': f'Server with id {server_id} does not exist.'}, status=status.HTTP_404_NOT_FOUND)
                except ValueError:
                    raise ValueError('Server ID must be an integer.')

            serializer = ServerSerializer(queryset, many=True, context={
                                          'num_members': num_members})
            return Response(serializer.data)

        # Handle unexpected errors and return a 500 error response.
        except Exception as e:
            return Response({'error: ': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
