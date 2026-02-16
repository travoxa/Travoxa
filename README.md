# Travoxa - Modern Travel & Community Platform

Travoxa is a comprehensive travel platform built with **Next.js 16** that combines community features with curated tour packages and essential travel services. It connects backpackers, offers detailed tour itineraries, and provides a suite of discovery tools for sightseeing, rentals, and local assistance.

## 🚀 Features

### 🌍 Tour Packages (`/tour`)
- **Curated Tours**: Browse professionally curated tour packages with rich media.
- **Dynamic Filtering**: Advanced search by price range, duration, and keywords.
- **Detailed Itineraries**: Day-by-day breakdown including stay, meals, and activities.
- **Availability Batches**: Support for multiple date ranges per tour package.
- **Booking System**: Slot management, pricing, and booking inquiries.
- **Custom Requests**: Form for users to request personalized tour packages.

### 🧭 Travoxa Discovery (`/travoxa-discovery`)
A one-stop hub for travel essentials, featuring a Bento Grid layout:
- **Sightseeing**: Top places, routes, and must-see spots.
- **Rentals**: Bikes, cars, and scooties for rent.
- **Local Connect**: Connect with local guides and helpers.
- **Activities**: Treks, rafting, and adventure activities.
- **Attractions**: Famous spots and hidden gems.
- **Food & Cafes**: Local culinary recommendations.
- **Emergency Help**: Access to hospitals, police, and helplines.
-   **Volunteer Yatra**: Opportunities for skill-exchange travel.
-   **Creator Collab**: Platform for brand and creator collaborations.

### 🎒 Backpackers Community (`/backpackers`)
- **Groups**: Create and join interest-based travel groups.
- **Real-time Chat**: WebSocket-based messaging for group coordination.
- **Member Management**: Host-approved joining system.

### 🔐 Authentication & Security
- **NextAuth.js**: Secure login via Google OAuth and email credentials.
- **Role-based Access**: Distinction between regular users and admins/hosts.

## 🛠 Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com)
- **Animations**: Framer Motion, GSAP, AOS (Animate On Scroll)
- **Icons**: React Icons (Fa, Md, etc.)

### Backend
- **API**: Next.js API Routes
- **Database**: MongoDB with [Mongoose](https://mongoosejs.com) ODM
- **Storage**: Firebase Storage (for images and media)
- **Authentication**: NextAuth.js

## 📂 Page Flow / Site Map

- **Home (`/`)**: Landing page with Hero, Destinations, Showcase, and CTAs.
- **Authentication**:
  - `/login`: User sign-in.
  - `/onboarding`: Profile setup for new users.
- **Tours**:
  - `/tour`: Listing of all available tour packages.
  - `/tour/[id]`: Detailed view of a specific tour.
- **Discovery Hub (`/travoxa-discovery`)**: Dashboard for services.
  - Sub-pages for `sightseeing`, `rentals`, `food`, `activities`, etc.
- **Backpackers**:
  - `/backpackers`: Community groups hub.
  - `/backpackers/create`: Group creation form.
  - `/backpackers/group/[id]`: Group chat and details.
- **Admin**:
  - `/admin`: Dashboard for managing content (Tours, Users, etc.).

## 🗄 Database Schema (Mongoose)

### Tour Model (`models/Tour.ts`)
The `Tour` model is the core of the package system:
- **Basic Info**: `title`, `location`, `price`, `duration`, `overview`, `minPeople`, `maxPeople`.
- **Availability**: `availabilityBatches` array (containing `startDate`, `endDate`, `active` status).
- **Media**: `image` (array of URLs), `brochureUrl`.
- **Itinerary**: Array of objects with:
  - `day` (Number)
  - `title`, `description`
  - `stay`, `meal`, `activity`, `transfer`
- **Logistics**: `pickupLocation`, `dropLocation`, and Google Map links.
- **Inclusions/Exclusions**: Arrays of strings.
- **Meals**: Array of strings.
- **Partners**: Array of partner objects (`name`, `isVerified`).

### Other Key Models
- **BackpackerGroup**: Stores group info, members, and chat references.
- **User**: User profile, preferences, and auth provider data.
- **TourRequest**: Stores user inquiries for custom tours.
- **Sightseeing / Activity / Food / Rental**: Models for the specific discovery sections.

