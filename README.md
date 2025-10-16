# Techwiz - Interior Design Platform

A comprehensive interior design platform connecting clients with professional designers, featuring consultation management, product showcasing, and portfolio management.

## Project Structure

```
├── admin/          # Admin dashboard interface
├── designer/       # Interior designer portal
├── user/          # Client/user interface
└── server/        # Backend API server
```

## Features

### Client Portal
- User authentication and profile management
- Browse and book design consultations
- View designer portfolios and products
- Real-time chat with designers
- Order tracking and management
- Blog access and interaction

### Designer Portal
- Professional profile management
- Availability management
- Consultation scheduling
- Portfolio showcase
- Product listings
- Order management
- Client communication

### Admin Dashboard
- User management
- Designer verification
- Analytics and reporting
- Content management
- Order oversight
- Category management
- Blog management

## Tech Stack

### Frontend
- React.js with Vite
- CSS for styling
- React Router for navigation
- Protected routes implementation

### Backend
- Node.js
- Express.js
- MongoDB (assumed based on model structure)
- JWT authentication
- Email service integration

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm or yarn package manager
- MongoDB instance

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd techwiz
```

2. Install dependencies for all components:
```bash
# Install server dependencies
cd server
npm install

# Install admin dashboard dependencies
cd ../admin
npm install

# Install designer portal dependencies
cd ../designer
npm install

# Install user portal dependencies
cd ../user
npm install
```

3. Set up environment variables:
Create `.env` files in each directory (server, admin, designer, user) with appropriate configurations.

4. Start the development servers:

```bash
# Start backend server
cd server
npm run dev

# Start admin dashboard
cd ../admin
npm run dev

# Start designer portal
cd ../designer
npm run dev

# Start user portal
cd ../user
npm run dev
```

## API Structure

The backend API is organized into multiple routes:
- Authentication (`/auth`)
- Users (`/users`)
- Designers (`/designers`)
- Products (`/products`)
- Orders (`/orders`)
- Consultations (`/consultations`)
- Categories (`/categories`)
- Blogs (`/blogs`)
- Reviews (`/reviews`)
- Notifications (`/notifications`)

## Contributing

Please read [CONTRIBUTING.md] for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the [LICENSE] - see the LICENSE file for details.

## Acknowledgments

- All contributors and team members
- Open source community
- Interior design professionals who provided insights

## Contact

For any queries or support, please contact [contact information]
