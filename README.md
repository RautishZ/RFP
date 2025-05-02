# VelocityHr RFP Management System

A comprehensive Request for Proposal (RFP) management system that enables administrators to create RFPs and vendors to submit quotes in response.

![VelocityHr Logo](./src/assets/images/velocity_logo.png)

## Overview

VelocityHr is a full-featured web application built with React that streamlines the RFP process between organizations and vendors. The platform offers role-based access for administrators and vendors, allowing efficient management of the entire RFP lifecycle.

## Features

### For Administrators

- **Vendor Management**: Review, approve, or reject vendor registrations
- **RFP Creation**: Create RFPs with detailed specifications and price ranges
- **Vendor Selection**: Choose specific vendors to receive RFP invitations
- **Quote Review**: Review and compare quotes submitted by vendors
- **RFP Status Control**: Open or close RFPs as needed

### For Vendors

- **Self Registration**: Create vendor accounts with business details
- **Category Selection**: Specify business categories for relevant RFP matching
- **RFP Discovery**: View open RFPs that match vendor categories
- **Quote Submission**: Submit competitive quotes for open RFPs
- **Quote Tracking**: Monitor submitted quotes and RFP status

## Technology Stack

- **Frontend**: React 19, React Router, Bootstrap 5
- **UI Components**: Custom UI components with Bootstrap styling
- **State Management**: React Hooks for local state
- **API Integration**: Axios for API requests
- **Notifications**: React-Toastify for user notifications
- **Icons**: Material Design Icons
- **Build Tool**: Vite

## Installation

1. Clone the repository:

```bash
git clone https://github.com/RautishZ/EFP.git
cd EFP
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

## Project Structure

- `src/` - Source code
  - `assets/` - CSS, fonts, images, and third-party libraries
  - `components/` - Reusable React components
    - `auth/` - Authentication-related components
    - `layout/` - Layout components (Header, Sidebar, Footer)
    - `ui/` - UI components (buttons, tables, modals)
  - `constants/` - Application constants
  - `pages/` - Page components
  - `services/` - API services and utilities
  - `App.jsx` - Main application component
  - `main.jsx` - Application entry point

## User Roles

The application supports two types of users:

1. **Administrators**: Can manage vendors, create RFPs, view quotes
2. **Vendors**: Can view and submit quotes for open RFPs

## Workflow

### Administrator Workflow

1. Log in as an administrator
2. Review and approve vendor registrations
3. Create new RFPs with detailed requirements
4. Select vendors to receive the RFP
5. Review submitted quotes
6. Close RFPs when appropriate

### Vendor Workflow

1. Register for a vendor account
2. Wait for administrator approval
3. Browse available RFPs
4. Submit quotes for RFPs of interest
5. Track quote status

## Environment Setup

The application requires a backend API to function properly. The API base URL is configured in `src/services/api.js`.

## Authentication

Authentication is handled using JWT tokens, which are stored in localStorage. User session management is handled by the `userState` service.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is proprietary software.

## Support

For support, please contact support@velsof.com.
