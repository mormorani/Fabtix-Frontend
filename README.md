## 🎶 Fabtix Frontend 🎶

This is the frontend of Fabtix, a platform for exploring, buying tickets, and reviewing music performances. This project is built with Angular and deployed to Firebase Hosting.

## Table of Contents
- [Features](#key-features)
- [Tech Stack](#-tech-stack)
- [Installation and Setup](#installation-and-setup)
- [Deployment](#deployment)

## Key Features
- **Performance Listings**: Browse music performances.
- **Ticket Purchasing**: Allows buying tickets without an account.
- **Review System**: Users can review performances they’ve attended.
- **Responsive UI**: Optimized for all screen sizes.
  
## 💻 Tech Stack 
- **Frontend Framework**: Angular
- **Styling**: CSS and Bootstrap
- **Hosting**: Firebase Hosting

## Installation and Setup

### Prerequisites
- **Node.js** (v14 or higher)
- **Angular CLI**: Install via `npm install -g @angular/cli`
- **Firebase CLI**: Install via `npm install -g firebase-tools`

### Steps

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/yourusername/Fabtix-Frontend.git
    cd Fabtix-Frontend
    ```

2. **Install Dependencies**:
    ```bash
    npm install
    ```

3. **Create Environment Files**:
    The project requires two environment configuration files to run locally and in production. Follow these steps to create them:

    - Navigate to the `src/` directory in the project folder.
    - Create a folder named `environments` if it doesn't already exist.
    - Inside the `src/environments/` folder, create the following two files:

      1. **`environment.ts` (Development)**
      ```typescript
      export const environment = {
        production: false,
        backendUrl: 'http://localhost:5000'  // Your local backend URL
      };
      ```

      2. **`environment.prod.ts` (Production)**
      ```typescript
      export const environment = {
        production: true,
        backendUrl: 'https://your-production-backend-url.com'  // Your live backend URL
      };
      ```

4. **Run the Project Locally**:
    ```bash
    ng serve
    ```

    Your application will be available at `http://localhost:4200`.


### Deployment
The project is deployed to Firebase Hosting. You can view the live application here: [https://fabtixapp.web.app/](https://fabtixapp.web.app/).