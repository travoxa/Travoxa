# Travoxa - Travel Community Platform

Travoxa is a modern travel community platform built with Next.js that connects backpackers and travelers through curated groups and shared experiences. The platform enables users to discover, create, and join travel groups based on interests, destinations, and travel preferences.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure login with Google OAuth and email/password
- **User Onboarding**: Comprehensive profile setup with travel preferences
- **Backpackers Community**: Browse and join travel groups
- **Group Management**: Create and manage travel groups with detailed itineraries
- **Real-time Chat**: Live messaging within groups
- **Join Requests**: Host-managed approval system for group membership
- **Comment System**: Community discussions on group pages
- **Host Profiles**: Verified host information and trip history
- **Responsive Design**: Mobile-first responsive interface

### Key Pages
- **Home Page** (`/`) - Landing page with hero section, destinations showcase, and community highlights
- **Login/Register** (`/login`) - User authentication with multiple sign-in options
- **Onboarding** (`/onboarding`) - Profile completion and preference setup
- **Backpackers Hub** (`/backpackers`) - Community groups and travel opportunities
- **Group Creation** (`/backpackers/create`) - Hosts can create new travel groups
- **Group Details** (`/backpackers/group/[id]`) - Individual group pages with chat, comments, and member lists

## 🛠 Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org) with App Router
- **Styling**: [Tailwind CSS](https://tailwindcss.com) for utility-first CSS
- **State Management**: React Context and client-side state
- **Icons**: [React Icons](https://react-icons.github.io/react-icons)

### Backend & Authentication
- **Authentication**: [NextAuth.js](https://next-auth.js.org) with Google OAuth
- **Database**: MongoDB with Mongoose ODM for structured data
- **Storage**: Firebase Storage for media files
- **API Routes**: Next.js API routes with middleware for authentication

### Development Tools
- **TypeScript**: Type-safe JavaScript development
- **ESLint**: Code linting and formatting
- **PostCSS**: CSS processing and optimization

### Key Features Implemented
- **Real-time Chat**: WebSocket-based messaging within groups
- **Join Request System**: Host-managed approval workflow
- **Comment System**: Community discussions with likes
- **Host Profiles**: Verified host information and trip history
- **Group Creation**: Comprehensive form with itinerary planning
- **Member Management**: Dynamic member lists with roles


## 📁 Project Structure

```
Travoxa/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                 # Home page
│   ├── login/                   # Authentication page
│   ├── onboarding/              # User onboarding
│   └── backpackers/             # Community features
│       ├── page.tsx            # Backpackers hub
│       ├── create/             # Group creation form
│       └── group/[id]/         # Group detail pages
├── components/                  # Reusable React components
│   ├── Pages/                  # Page-specific components
│   ├── ui/                     # UI components (buttons, cards, etc.)
│   └── backpackers/            # Backpackers-specific components
│       ├── GroupCreateForm.tsx # Group creation interface
│       ├── ChatRoom.tsx        # Real-time chat component
│       ├── JoinRequestButton.tsx # Join request functionality
│       ├── MemberList.tsx      # Group member display
│       └── detail/             # Group detail components
├── lib/                        # Utility functions and configurations
│   ├── models/                 # MongoDB models
│   │   ├── BackpackerGroup.ts  # Group data model
│   │   └── User.ts            # User data model
│   ├── hooks/                  # Custom React hooks
│   │   ├── useGroups.ts       # Group data fetching
│   │   └── useUserDetails.ts  # User data fetching
│   ├── authUtils.ts           # Authentication utilities
│   ├── mongodb.ts             # Database connection
│   └── mongodbUtils.ts        # Database operations
├── app/api/                   # Next.js API routes
│   ├── groups/                # Group management endpoints
│   ├── users/                 # User management endpoints
│   └── backpackers/           # Backpacker-specific endpoints
├── public/                    # Static assets
│   ├── Destinations/          # Destination images
│   └── showcase/              # Showcase images
└── types/                     # TypeScript type definitions
```

## 🎯 Key Components

### Backpackers Community
- **GroupCreateForm**: Comprehensive form for hosts to create travel groups with itineraries, budgets, and approval criteria
- **ChatRoom**: Real-time messaging system for group communication
- **JoinRequestButton**: Host-managed approval system for new members
- **MemberList**: Dynamic display of group members with roles and expertise
- **CommentSection**: Community discussion system with likes and moderation

### Authentication & User Management
- **NextAuth.js Integration**: Secure authentication with Google OAuth
- **User Profiles**: Complete user management with MongoDB backend
- **Host Verification**: Verified host profiles with trip history and testimonials

### Group Management
- **Itinerary Planning**: Structured trip planning with day-by-day itineraries
- **Budget Tracking**: Cost breakdown and budget range management
- **Approval System**: Host-controlled membership with join requests
- **Document Requirements**: Trip-specific document verification

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file with the following variables:
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
MONGODB_URI=your-mongodb-connection-string
FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
FIREBASE_APP_ID=your-firebase-app-id
```

### Database Setup
The application uses MongoDB for structured data storage with the following collections:
- **BackpackerGroup**: Travel group information, itineraries, and members
- **User**: User profiles and authentication data
- **Comments**: Group discussion threads
- **JoinRequests**: Pending membership requests

### API Endpoints
- `GET /api/groups` - List all travel groups
- `POST /api/groups` - Create new travel group
- `GET /api/groups/[id]/comments` - Get group comments
- `POST /api/groups/[id]/comments` - Add comment to group
- `POST /api/backpackers/group/[id]/join` - Request to join group
- `GET /api/backpackers/group/[id]/join` - Get join requests (hosts only)

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team

---

**Travoxa** - Where will you go next?
