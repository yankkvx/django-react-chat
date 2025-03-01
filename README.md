# FlowTalk

FlowTalk is a web-based chat application that allows users to communicate in real-time across different servers, categories, and rooms. It is built using Django Channels, Django REST Framework, Uvicorn (ASGI server for Django apps), React and TypeScript.

## Features

- **Multi-server Support:** Users can join and interact with different chat servers.
- **Categories & Rooms:** Each server contains categories, and categories contain multiple chat rooms.
- **Real-time Messaging:** Instant message exchange using WebSockets.
- **User Authentication:** Secure sign-up and login with JWT authentication.
- **Profile Editing:** Users can edit their profile information (such as username, email, and profile picture).
- **Public Profiles:** Users have public profiles where they can showcase their avatar, username, email, registration date, and the servers they are a part of.
- **Server Management:** Users can edit server details, delete servers they own, or leave servers they have joined.
- **Moderation Tools:** Server owners can remove users from their servers, ensuring better control over community interactions.
- **Create Server & Categories:** Users can create new servers and if no existing category matches their needs, they can create a new one.
- **Channel Creation:** Users can create new channels within servers for more focused discussions.
- **Message History:** Persistent chat history for each room.
- **Light & Dark Mode:** Users can switch between light and dark themes.
- **Responsive Design:** Fully optimized for mobile and desktop devices.

### Current Development Status

Currently implemented features:
- User registration and login
- User profile editing and public profiles
- Server management (Join/Leave/Delete)
- Server customization (Name, description, category, image)
- Server & Categories creation
- Server moderation
- Channel management
- Real-time chat functionality
- Light and dark theme support
- Responsive design

Upcoming features:
- Additional service code improvements and refinements

## Tech Stack

### Backend:
- Django
- Django REST Framework
- Django Channels
- WebSockets

### Frontend:
- React
- TypeScript
- Vite

## Installation

### Backend Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/yankkvx/django-react-chat.git
   ```
2. Navigate to the project directory:
   ```sh
   cd django-react-chat
   ```
3. Create an .env file in the root folder of the Django backend (where manage.py is located). :
   ```sh
   SECRET_KEY=your_secret_key_here
   DEBUG=True
   ```
4. Create a virtual environment and activate it:
   ```sh
   python -m venv venv
   venv/Scripts/activate # On Linux use `source venv/bin/activate`
   ```
5. Install dependencies:
   ```sh
   cd backend
   pip install -r requirements.txt
   ```
6. Apply migrations:
   ```sh
   python manage.py migrate
   ```
7. Start the uvicorn server:
   ```sh
   uvicorn backend.asgi:application --port 8000
   ```
8. Create a superuser for admin access(additional):
   ```sh
   python manage.py createsuperuser 
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the React development server:
   ```sh
   npm run dev
   ```

## Usage

- Sign up or log in to access servers and chat rooms.
- Join a server and navigate through categories and rooms.
- Start chatting in real-time with other users.

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## Contact

For questions or support, contact me via [yankkvx@gmail.com](mailto:yankkvx@gmail.com)