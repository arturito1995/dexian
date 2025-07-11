
# Dexian Project

This repository contains a full-stack application with an **API** (backend) and a **Client** (frontend), both managed as separate packages. The project leverages AWS CDK for infrastructure as code, TypeScript for both backend and frontend, and Vite for fast frontend development.

## Project Structure

```
├── api/         # Backend (API, AWS CDK, Lambdas, Models, Schemas)
├── client/      # Frontend (React, Vite, Components, Pages)
└── README.md    # Project documentation
```

### /api
- **bin/**: Entry point for the CDK app.
- **lib/**: CDK stacks, Lambda constructs, and shared layers.
- **src/**: Lambda functions, helpers, models, and schemas.
- **schemas/**: JSON schemas for validation.
- **test/**: Unit tests for backend logic.
- **cdk.out/**: CDK deployment output (auto-generated).

### /client
- **src/**: React app source code (components, pages, router, styles).
- **public/**: Static assets.
- **cdk/**: CDK stack for frontend hosting (if applicable).
- **cdk.out/**: CDK deployment output (auto-generated).

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [AWS CLI](https://aws.amazon.com/cli/)
- [AWS CDK](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html)

### Install Dependencies

```bash
# Install backend dependencies
cd api
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Running the Application

#### Backend (API)
```bash
cd api
# Run tests
npm test
# Deploy to AWS (requires AWS credentials)
npx cdk deploy
```

#### Frontend (Client)
```bash
cd client
# Start development server
npm run dev
```

## Project Scripts

Each package (`api`, `client`) contains its own `package.json` with scripts for building, testing, and deploying.

## Testing

- **Backend:** Uses Jest for unit testing (`api/test/`).
- **Frontend:** Uses Jest and React Testing Library (`client/src/components/*/*.test.tsx`).

## Deployment

Deployment is managed via AWS CDK. Make sure you have configured your AWS credentials.

```bash
# Deploy backend
cd api
npx cdk deploy

# Deploy frontend (if using CDK for hosting)
cd ../client
npx cdk deploy
```

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.
