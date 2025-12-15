# Travoxa - Travel Community Platform

Travoxa is a modern travel community platform built with Next.js that connects backpackers and travelers through curated groups and shared experiences. The platform enables users to discover, create, and join travel groups based on interests, destinations, and travel preferences.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure login with Google OAuth and email/password
- **User Onboarding**: Comprehensive profile setup with travel preferences
- **Backpackers Community**: Browse and join travel groups
- **Group Management**: Create and manage travel groups with detailed itineraries
- **Chat Integration**: Real-time messaging within groups
- **Responsive Design**: Mobile-first responsive interface

### Key Pages
- **Home Page** (`/`) - Landing page with hero section, destinations showcase, and community highlights
- **Login/Register** (`/login`) - User authentication with multiple sign-in options
- **Onboarding** (`/onboarding`) - Profile completion and preference setup
- **Backpackers Hub** (`/backpackers`) - Community groups and travel opportunities
- **Group Details** (`/backpackers/group/[id]`) - Individual group pages with chat and details

## 🛠 Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org) with App Router
- **Styling**: [Tailwind CSS](https://tailwindcss.com) for utility-first CSS
- **State Management**: React Context and client-side state
- **Icons**: [React Icons](https://react-icons.github.io/react-icons)

### Backend & Authentication
- **Authentication**: [NextAuth.js](https://next-auth.js.org) with Google OAuth
- **Database**: Firebase Firestore for user data and groups
- **Storage**: Firebase Storage for media files

### Development Tools
- **TypeScript**: Type-safe JavaScript development
- **ESLint**: Code linting and formatting
- **PostCSS**: CSS processing and optimization


## 📁 Project Structure

```
Travoxa/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── login/             # Authentication page
│   ├── onboarding/        # User onboarding
│   └── backpackers/       # Community features
├── components/            # Reusable React components
│   ├── Pages/            # Page-specific components
│   ├── ui/               # UI components (buttons, cards, etc.)
│   └── backpackers/      # Backpackers-specific components
├── lib/                  # Utility functions and configurations
│   ├── firebaseConfig.ts # Firebase setup
│   ├── userUtils.ts      # User management utilities
│   └── route.ts          # Route helper functions
├── public/               # Static assets
│   ├── Destinations/     # Destination images
│   └── showcase/         # Showcase images
└── types/               # TypeScript type definitions
```

## 🔧 Configuration

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team

---

**Travoxa** - Where will you go next?
