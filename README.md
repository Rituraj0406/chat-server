# Pulse Chat Server

A real-time chat application backend built with Node.js, Express, and Socket.io. This server provides RESTful APIs for user authentication, messaging, and conversation management, along with WebSocket support for real-time communication.

## Features

- **User Authentication**: Register, login, logout, and token refresh functionality
- **Real-time Messaging**: WebSocket-based instant messaging with Socket.io
- **Conversation Management**: Create and manage private conversations between users
- **User Presence**: Track online users and emit presence updates
- **Message History**: Retrieve paginated message history for conversations
- **Secure**: JWT-based authentication with refresh tokens and bcrypt password hashing
- **Database**: MongoDB integration with Mongoose ODM

## Tech Stack

- **Runtime**: Node.js with ES modules
- **Framework**: Express.js
- **Real-time**: Socket.io
- **Database**: MongoDB with Mongoose
- **Authentication**: JSON Web Tokens (JWT) with bcryptjs
- **Logging**: Morgan
- **CORS**: Configured for client-side requests
- **Development**: Nodemon for hot reloading

## Installation

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (see Environment Variables section below).

4. Ensure MongoDB is running on your system.

## Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
PORT=5000
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/pulse-chat
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

- `PORT`: The port on which the server will run
- `CLIENT_URL`: The URL of the client application (for CORS)
- `MONGODB_URI`: MongoDB connection string
- `JWT_ACCESS_SECRET`: Secret key for access tokens
- `JWT_REFRESH_SECRET`: Secret key for refresh tokens
- `JWT_ACCESS_EXPIRES_IN`: Access token expiration time
- `JWT_REFRESH_EXPIRES_IN`: Refresh token expiration time

## Running the Server

### Development Mode
```bash
npm run dev
```
This starts the server with Nodemon for automatic restarts on file changes.

### Production Mode
```bash
npm start
```
This starts the server in production mode.

The server will be available at `http://localhost:5000` (or the port specified in your `.env` file).

## API Endpoints

### Health Check
- `GET /api/health` - Check server status

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info (requires authentication)

### Users
- `GET /api/users` - List all users (requires authentication)

### Messages
- `GET /api/messages/conversations` - List user conversations (requires authentication)
- `POST /api/messages/conversations/:userId` - Get or create a conversation with a user (requires authentication)
- `GET /api/messages/:conversationId` - Get messages in a conversation (requires authentication)
- `PATCH /api/messages/:conversationId/read` - Mark conversation as read (requires authentication)

All endpoints except health check and auth endpoints require authentication via a JWT token in the Authorization header.

## Socket Events

The server uses Socket.io for real-time communication. Clients must authenticate with a valid JWT token.

### Client to Server Events
- `message:send` - Send a message to a conversation
- `conversation:join` - Join a conversation room
- `conversation:leave` - Leave a conversation room

### Server to Client Events
- `message:receive` - Receive a new message
- `presence:update` - Update online user presence
- `conversation:updated` - Notify of conversation changes

## Database Models

- **User**: Stores user information (username, email, password hash)
- **Conversation**: Represents a chat between two users
- **Message**: Individual messages within conversations
- **RefreshToken**: Stores refresh tokens for authentication

## Project Structure

```
chat-server/
├── src/
│   ├── app.js                 # Express app configuration
│   ├── index.js               # Server entry point
│   ├── config/
│   │   ├── db.js              # Database connection
│   │   └── env.js             # Environment variables
│   ├── controllers/           # Route handlers
│   │   ├── authController.js
│   │   ├── messageController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js            # Authentication middleware
│   │   └── errorHandler.js    # Error handling
│   ├── models/                # Mongoose models
│   │   ├── User.js
│   │   ├── Conversation.js
│   │   ├── Message.js
│   │   └── RefreshToken.js
│   ├── routes/                # API routes
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   └── messageRoutes.js
│   ├── socket/                # Socket.io handlers
│   │   └── index.js
│   └── utils/                 # Utility functions
│       ├── asyncHandler.js
│       ├── conversation.js
│       ├── httpError.js
│       └── token.js
├── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests (if any)
5. Submit a pull request

## License

This project is private and not licensed for public use.
