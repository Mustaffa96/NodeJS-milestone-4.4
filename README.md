# Optimized Node.js Application

A performance-optimized Node.js application demonstrating best practices for scalability and monitoring.

## Features

- **Clustering**: Utilizes all CPU cores for improved performance
- **Compression**: Reduces response size using compression middleware
- **Security**: Implements helmet and rate limiting
- **Caching**: Memory-based caching for faster response times
- **Performance Monitoring**: Built-in profiling tools
- **Load Testing**: Integrated load testing capabilities

## Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install
```

## Usage

### Development Mode
```bash
npm start
```

### Production Mode (with clustering)
```bash
npm run start:prod
```

### Performance Profiling

1. Start the server in profile mode:
```bash
npm run start:profile
```

2. In a separate terminal, run the load test:
```bash
npm run loadtest
```

3. Stop the server (Ctrl+C) to generate the profile report

### Available Endpoints

- `GET /`: Basic health check endpoint
- `GET /cpu-intensive`: CPU-intensive operation for testing
- `GET /api/data`: Cached endpoint (5-minute cache)

## Performance Testing

The application includes two main tools for performance testing:

1. **Clinic.js Doctor**: For profiling and diagnosing performance issues
```bash
npm run profile
```

2. **Autocannon**: For load testing
```bash
npm run loadtest
```

## Scripts

- `npm start`: Start the server
- `npm run start:prod`: Start in production mode with clustering
- `npm run start:profile`: Start in profile mode (single process)
- `npm run profile`: Run with Clinic.js Doctor profiling
- `npm run loadtest`: Run load tests with Autocannon

## Dependencies

- express: Web framework
- compression: Response compression
- helmet: Security headers
- express-rate-limit: Rate limiting
- memory-cache: In-memory caching
- clinic: Performance profiling
- autocannon: Load testing
- cross-env: Cross-platform environment variables
