export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    database: process.env.DATABASE_NAME,
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    synchronize: process.env.DATABASE_SYNCHRONIZE,
  },
});
