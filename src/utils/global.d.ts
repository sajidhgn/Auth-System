declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: 'development' | 'production';
        JWT_SECRET_KEY: string;
        JWT_EXPIRES_IN: string;
        PORT: string;
        // Add other variables as needed
    }
}

