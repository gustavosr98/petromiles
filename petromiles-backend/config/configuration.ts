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
  lang: {
    poeditor: {
      apiSecretKey: process.env.POEDITOR_API_KEY,
      projectId: process.env.POEDITOR_PROJECT_ID,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    name: process.env.JWT_NAME,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  mails: {
    sendgrid: {
      apiKey: process.env.SENDGRID_API_KEY,
      emailFrom: process.env.SENDGRID_FROM,
      templates: {
        welcome: process.env.SENDGRID_WELCOME_TEMPLATE,
      },
    },
  },
});
