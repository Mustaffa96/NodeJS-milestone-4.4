const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mcache = require('memory-cache');

// Check if we're in profiling mode
const isProfiling = process.env.NODE_ENV === 'profile';

function setupServer() {
    const app = express();

    // Security middleware
    app.use(helmet());

    // Compression middleware
    app.use(compression());

    // Rate limiting
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100 // limit each IP to 100 requests per windowMs
    });
    app.use(limiter);

    // Body parsing middleware
    app.use(express.json({ limit: '10kb' }));

    // Basic route for testing
    app.get('/', (req, res) => {
        res.json({ message: 'Hello World!' });
    });

    // CPU intensive operation for testing
    app.get('/cpu-intensive', (req, res) => {
        let result = 0;
        for(let i = 0; i < 1e7; i++) {
            result += Math.random() * Math.random();
        }
        res.json({ result });
    });

    // Example route with caching
    app.get('/api/data', (req, res) => {
        const key = '__express__' + req.originalUrl;
        const cachedResponse = mcache.get(key);
        
        if (cachedResponse) {
            return res.send(cachedResponse);
        }

        const data = { 
            timestamp: Date.now(),
            message: 'This response will be cached for 5 minutes'
        };
        
        mcache.put(key, data, 5 * 60 * 1000); // Cache for 5 minutes
        res.json(data);
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({ error: 'Something broke!' });
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT} (PID: ${process.pid})`);
    });
}

if (isProfiling) {
    // Run in single process mode for profiling
    console.log('Running in profiling mode (single process)');
    setupServer();
} else {
    // Run in cluster mode for production
    if (cluster.isMaster || cluster.isPrimary) {
        console.log(`Master ${process.pid} is running`);
        
        // Fork workers
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
        }

        cluster.on('exit', (worker, code, signal) => {
            console.log(`Worker ${worker.process.pid} died`);
            cluster.fork(); // Replace the dead worker
        });
    } else {
        setupServer();
    }
}
