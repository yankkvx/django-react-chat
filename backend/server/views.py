from rest_framework import viewsets
from rest_framework import status
from rest_framework.response import Response
from django.db.models import Count
from .models import Server, Category, Channel
from .serializers import ServerSerializer, CategorySerializer, ChannelSerializer
from .schema import server_docs, category_docs
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView


class CategoryViewSet(viewsets.ViewSet):
    queryset = Category.objects.all()

    @category_docs
    def list(self, request):
        try:
            queryset = self.queryset
            category_name = request.query_params.get('category_name')
            if category_name:
                queryset = queryset.filter(name=category_name)

        except Exception as e:
            return Response({'error: ': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        serializer = CategorySerializer(queryset, many=True)
        return Response(serializer.data)


class ServerViewSet(viewsets.ViewSet):
    """
    Custom ViewSet for managing Server objects.
    """

    queryset = Server.objects.all()

    @server_docs
    def list(self, request):
        try:
            queryset = self.queryset

            queryset = queryset.distinct()

            # Filter by category name if 'category' parameter is provided.
            category = request.query_params.get('category')
            if category:
                queryset = queryset.filter(category__name__icontains=category)

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


class MembershipViewSet(viewsets.ViewSet):
    """
    This viewset provides actions related to managing user membership in servers.
    It includes functionality to check if a user is already a member of a server,
    add a user to a server, and remove a user from a server
    """

    permission_classes = [IsAuthenticated]

    # Method to check if a user is already a member of a specific server
    def _check_user_membership(self, server, user):
        return server.member.filter(id=user.id).exists()

    # Action to check if a user is a member of a server
    @action(detail=False, methods=['GET'])
    def is_member(self, request, server_id=None):
        server = get_object_or_404(Server, pk=server_id)
        user = request.user

        is_member = server.member.filter(id=user.id).exists()
        return Response({'is_member': is_member})

    # Method for adding a user to a server
    def create(self, request, server_id):
        server = get_object_or_404(Server, id=server_id)
        user = request.user

        if self._check_user_membership(server, user):
            return Response({'detail': 'User is already a member.'}, status=status.HTTP_409_CONFLICT)

        server.member.add(user)
        return Response({'detail': f'{user.username} joined to the server.'}, status=status.HTTP_200_OK)

    # Action for removing a member from the server
    @action(detail=False, methods=['DELETE'])
    def remove_member(self, request, server_id):
        server = get_object_or_404(Server, id=server_id)
        user = request.user

        if not self._check_user_membership(server, user):
            return Response({'detail': 'User is not a member.'}, status=status.HTTP_404_NOT_FOUND)

        if server.owner == user:
            return Response({'detail': "Owners can't be removed"}, status=status.HTTP_409_CONFLICT)

        server.member.remove(user)
        return Response({'detail': f'{user.username} removed from the server.'}, status=status.HTTP_200_OK)


class UserServers(APIView):
    def get(self, request):
        user = request.user
        servers = Server.objects.filter(member=user)
        serializer = ServerSerializer(servers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CategoryCreation(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data
        name = data.get('name')
        description = data.get('description')
        icon = data.get('icon', None)

        try:
            category = Category.objects.create(
                name=name,
                description=description,
                icon=icon,
            )
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        serializer = CategorySerializer(category)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ServerManagement(APIView):
    """
    This view handles server management operations.
    It ensures that only the owner of the server can perform actions on it.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        server = get_object_or_404(Server, id=pk)
        serializer = ServerSerializer(server, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        user = request.user
        data = request.data
        name = data.get('name')
        category_id = data.get('category')
        description = data.get('description')
        image = data.get('image')

        category = get_object_or_404(Category, id=category_id)

        try:
            server = Server.objects.create(
                name=name,
                owner=user,
                category=category,
                description=description,
                image=image
            )
            server.member.add(user)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        serializer = ServerSerializer(server)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def put(self, request, pk):
        user = request.user
        data = request.data
        server = get_object_or_404(Server, id=pk, owner=user)
        try:
            server.name = data['name']
            server.category = get_object_or_404(Category, id=data['category'])
            server.description = data['description']
            server.image = data['image']
            server.save()

            serializer = ServerSerializer(server, many=False)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            user = request.user
            server = Server.objects.get(id=pk, owner=user)
            server.delete()
            return Response({'detail': 'Server was successfully deleted.'}, status=status.HTTP_200_OK)
        except Server.DoesNotExist:
            return Response({'detail': "Can't find server with that id"}, status=status.HTTP_404_NOT_FOUND)


class ChannelManagement(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        data = request.data

        name = data.get('name')
        topic = data.get('topic')
        server_id = data.get('server')
        server = Server.objects.get(id=server_id)
        try:
            channel = Channel.objects.create(
                name=name, topic=topic, server=server)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        serializer = ChannelSerializer(channel)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
