# Hermod

Hermod is a modern blog web application built with React + TypeScript. It features a rich text editor, authentication, and state management, making it easy to create, manage, and read blog posts. This project can also serve as a starter template for your own blog applications.

## Live Demo

[@Hermod on Netlify](https://hermod.netlify.app)

## Features

- React + TypeScript: Strongly typed components and hooks for scalable front-end development.

- Redux: Centralized state management for consistent application state.

- Context + Supabase: User authentication and session management.

- Tiptap: A rich text editor for writing and editing blog content.

- Netlify Hosting: Deploy your blog with ease.

- Environment-based Configuration: Easily set up your project by following the .env.example file.

## Getting Started
### Prerequisites

Make sure you have the following installed on your system:

- Node.js
 (v18+ recommended)

npm
 or yarn

## Installation

1. Clone the repository

```bash
git clone https://github.com/your-username/hermod.git
cd hermod
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Set up environment variables
Copy .env.example to .env and fill in your Supabase keys and other configuration:
```bash
cp .env.example .env
```

## Deploy

The app is ready to deploy to Netlify or any other static hosting platform. Ensure your environment variables are set up in the hosting service.

## Technologies Used

- React + TypeScript – Frontend library and typing

- Redux – State management

- Context API + Supabase – Authentication and session handling

- Tiptap – Rich text editor

- Vite – Fast development and build tooling

- Netlify – Hosting