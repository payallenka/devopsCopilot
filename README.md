# DevOps Copilot

A Next.js application for code review and analysis using AI. This tool helps developers analyze pull requests, identify code smells, and generate comprehensive summaries using Google's Gemini AI.

## Features

- 🤖 AI-powered code review using Gemini AI
- 🔍 Code smells analysis and detection
- 📝 Pull request summary generation
- 🔐 Firebase integration for data persistence
- 🎨 Modern UI with Tailwind CSS and shadcn/ui
- 🔒 Secure HTML sanitization with DOMPurify

## Docker Setup

### Prerequisites
- Docker (version 20.10.0 or higher)
- Docker Compose (version 2.0.0 or higher)
- Node.js 20.x (for local development)

### Environment Variables
Create a `.env` file in the root directory with your Firebase and Gemini configuration:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Gemini AI Configuration
NEXT_PUBLIC_GOOGLE_AI_API_KEY=your_gemini_api_key
```

#### Getting Your Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click on "Get API key" or "Create API key"
4. Copy your API key and add it to the `.env` file as `NEXT_PUBLIC_GOOGLE_AI_API_KEY`

### Running with Docker

1. Build and start the containers:
```bash
docker compose up --build
```

2. The application will be available at http://localhost:9002

3. To stop the application:
```bash
docker compose down
```

### Development

To run the application in development mode:

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Start the Genkit development server:
```bash
npm run genkit:dev
```

The development server will be available at http://localhost:3000

### Building for Production

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Project Structure

```
devopsCopilot/
├── src/
│   ├── ai/              # AI flows and prompts
│   ├── components/      # React components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions
│   └── app/            # Next.js app directory
├── public/             # Static assets
├── docker-compose.yml  # Docker Compose configuration
├── Dockerfile         # Docker build configuration
└── package.json       # Project dependencies
```

## AI Capabilities

The application uses Google's Gemini AI model for:

- Code review analysis
  - Syntax and style checking
  - Best practices validation
  - Security vulnerability detection
- Identifying code smells
  - Code duplication
  - Complex methods
  - Long parameter lists
  - Inconsistent naming
- Generating pull request summaries
  - Change overview
  - Impact analysis
  - Risk assessment
  - Recommendations

## Troubleshooting

### Common Issues

1. **Docker Build Fails**
   - Ensure Docker and Docker Compose are up to date
   - Check if all environment variables are set correctly
   - Clear Docker cache: `docker system prune -a`

2. **AI Analysis Not Working**
   - Verify your Gemini API key is valid
   - Check browser console for any errors
   - Ensure the input PR diff is properly formatted

3. **HTML Rendering Issues**
   - Clear browser cache
   - Check if DOMPurify is properly initialized
   - Verify the HTML content is properly sanitized

### Getting Help

If you encounter any issues:
1. Check the browser console for error messages
2. Review the Docker logs: `docker compose logs -f`
3. Open an issue on the project repository

## Security

- All HTML content is sanitized using DOMPurify
- Environment variables are properly handled
- Firebase security rules are enforced
- API keys are never exposed to the client

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

Make sure to keep your Gemini API key secure and never commit it to version control.
