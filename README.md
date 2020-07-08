# PetroMiles

<p align="center">
  <img 
  alt="PetroMiles Round Logo"
  width="192" src="petromiles-frontend/public/img/icons/android-chrome-192x192.png">
</p>

![node version](https://img.shields.io/badge/node-12.16.3-blue)
![postgresql version](https://img.shields.io/badge/postgresql-12.2-blue)

![vue version](https://img.shields.io/badge/vue-2.6.11-blue)
![vuex version](https://img.shields.io/badge/vuex-3.1.3-blue)
![vue-router version](https://img.shields.io/badge/vue--router-3.1.6-blue)
![vuetify version](https://img.shields.io/badge/vue-2.2.11-blue)

![nest version](https://img.shields.io/badge/nest-7.0.0-blue)
![stripe version](https://img.shields.io/badge/stripe-8.49.0-blue)
![class-validator version](https://img.shields.io/badge/class--validator-0.12.2-blue)
![typeorm version](https://img.shields.io/badge/typeorm-0.2.24-blue)

## Intro

PetroMiles is a web-based customer loyalty platform built to earn, exchage and manage petro points. It provides customers american bank accounts as its main payment method.

Its written with [Vue](https://vuejs.org/) at the client side and [Nest](https://nestjs.com/) on the server side. It also integrates with [Stripe](https://stripe.com/) as its main payment provider.

Our web app can be found at https://petromiles-frontend.herokuapp.com/ while our production API base url can be found at https://petromiles-frontend.herokuapp.com/api/v1

## Index

- [Manual installation guide](#manual-installation-guide)
  - [Requirements](#requirements)
    - [Node and NPM](#node-and-npm)
    - [PostgreSQL](#postgresql)
  - [Backend project installation](#backend-project-installation)
    - [Backend configuration file](#backend-configuration-file)
    - [Populate the database](#populate-the-database)
  - [Frontend project installation](#frontend-project-installation)
    - [Frontend configuration file](#frontend-configuration-file)
- [Usage](#usage)
  - [Development usage](#development-usage)
  - [Development on Docker containers](#development-on-docker-containers)
  - [Production build](#production-build)
- [Authors and acknowledgment](#authors-and-acknowledgment)
  - [Team #2](#team-#2)
  - [Colaborators from Consortium #2](#colaborators-from-consortium-#2)

## Manual installation guide

### Requirements

#### Node and NPM

- Simply download and excecute lastest stable verison or LTS **installer** for your operative system from [Node downloads page](https://nodejs.org/en/)
- You could also install Node using a **package manager** as it is explaned on [official documentation](https://nodejs.org/en/download/package-manager/)

> **Info**: The installation process of Node should also install **NPM**

> **Recomendation**: Install the same Node version this project uses. This could also be done by installing Node through [NVM](https://github.com/nvm-sh/nvm)

> **WARNING**: If you are using **Windows** do not forget check you have Node instaltion path inside PATH enviroment variable

#### PostgreSQL

1.  Download and excecute the **installer** for your operative system from [official PostgreSQL download page](https://www.postgresql.org/download/)

> **Recomendation**: Install [pgAdmin4](https://www.pgadmin.org/) to administrate PostgreSQL

2. **Create a database** for this project. We recommend you to named it **dbpetromiles** but you could give it the name you wish

---

### Backend project installation

1. Open a terminal inside the project root directory

2. Excecute the following commands if you are on Linux or Windows

```bash
cd petromiles-backend/ # Move to backend project directory
npm install # Install dependencies
```

#### Backend configuration file

Create a file inside **petromiles-backend/** folder named `.env` or `.env.development`

These files will have the following structure

```bash
# ENVIRONMENT
PETROMILES_ENV=

# API
PORT=

# DATABASE
DATABASE_SSL_ON=
DATABASE_NAME=
DATABASE_PORT=
DATABASE_HOST=
DATABASE_TYPE=
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_SYNCHRONIZE=

# STRIPE - TEST MODE
STRIPE_SECRET_KEY=
STRIPE_PUBLIC_KEY=
STRIPE_API_VERSION=

# SENDGRID - TEST MODE
SENDGRID_ON=
SENDGRID_API_KEY=
SENDGRID_FROM=
SENDGRID_WELCOME_TEMPLATE=
SENDGRID_WELCOME_INVOICE_EN_TEMPLATE=
SENDGRID_WELCOME_INVOICE_ES_TEMPLATE=
SENDGRID_UPGRADE_TO_GOLD_EN_TEMPLATE
SENDGRID_UPGRADE_TO_GOLD_ES_TEMPLATE
SENDGRID_BANK_REGISTRATION_EN_TEMPLATE
SENDGRID_BANK_REGISTRATION_ES_TEMPLATE
SENDGRID_BANK_VERIFIED_EN_TEMPLATE
SENDGRID_BANK_VERIFIED_ES_TEMPLATE
SENDGRID_BANK_UNVERIFIED_EN_TEMPLATE
SENDGRID_BANK_UNVERIFIED_ES_TEMPLATE
SENDGRID_BANK_DELETION_EN_TEMPLATE
SENDGRID_BANK_DELETION_ES_TEMPLATE
SENDGRID_SUCCESSFUL_POINTS_PAYMENT_EN_TEMPLATE
SENDGRID_SUCCESSFUL_POINTS_PAYMENT_ES_TEMPLATE
SENDGRID_FAILED_POINTS_PAYMENT_EN_TEMPLATE
SENDGRID_FAILED_POINTS_PAYMENT_ES_TEMPLATE
SENDGRID_WITHDRAWAL_EN_TEMPLATE=
SENDGRID_WITHDRAWAL_ES_TEMPLATE=
SENDGRID_RECOVER_EN_TEMPLATE=
SENDGRID_RECOVER_ES_TEMPLATE=

# JWT
JWT_SECRET=
JWT_NAME=
JWT_EXPIRES_IN=

# POEditor
POEDITOR_API_KEY=
POEDITOR_PROJECT_ID=

# CRON
CRON_INCLUDE=true
```

Please contact [developers of team #2](#team-#2) to provide you with the enviroment variable corresponding files

> **IMPORTANT**: Do not forget to adjust the enviroment **variables related to the database**

#### Populate the database

Follow the next commands

```bash
cd petromiles-backend/ # Move to backend project directory
npm run seed:clean # This cleans the database, creates the tables and inserts initial rows
```

> **WARNING**: Be carefull with the database you specify. **This command cleans the whole database** before creating tables and inserting rows.

For futher information on PostgreSQL management please check the [official PostgreSQL documentation](https://www.postgresql.org/download/)

---

### Frontend project installation

Just as in the [backend project installation](#backend-project-installation), open a terminal inside the project root directory and excecute the following commands if you are on Linux or Windows

```bash
cd petromiles-backend/ # Move to backend project directory
npm install # Install dependencies
```

Check this link for futher information on [Vue](https://vuejs.org/v2/guide/) and this one for aditional information on [Vue CLI](https://cli.vuejs.org/)

#### Frontend configuration file

Create a file inside **petromiles-frontend/** folder named `.env` or `.env.development`

These files will have the following structure

```bash
# API
VUE_APP_PETROMILES_API_URL=
VUE_APP_PETROMILES_API_TIMEOUT=

# FIREBASE
VUE_APP_FIREBASE_APIKEY=
VUE_APP_FIREBASE_DATABASE_URL=
VUE_APP_FIREBASE_PROYECT_ID=
VUE_APP_FIREBASE_STORAGE_BUCKET=
VUE_APP_FIREBASE_MESSAGING_SENDER_ID=
VUE_APP_FIREBASE_APP_ID=
VUE_APP_FIREBASE_AUTH=

# I18N - Default lang
VUE_APP_I18N_LOCALE=en
VUE_APP_I18N_FALLBACK_LOCALE=en

```

As well as with backend configuration files please contact [developers of team #2](#team-#2) to provide you with the enviroment variable corresponding files

> **Warning**: Please note that these enviroment files are not the same as the ones used in the backend project

## Usage

> **Info**: Please follow the [installation guide](#manual-installation-guide) before getting to the usage section

### Development usage

1. Run backend Nest server  
   1.1. Open a terminal from the project root directory and excecute the following commands
   ```bash
    cd petromiles-backend/ # Move to backend project directory
    npm run start:dev # Start Nest development server
   ```
   1.2 If you have not populated the database please follow [instructions here](#populate-the-database)

> **Info**: The first time you run the Nest server will take longer. It will also create database empty tables

Something went wrong if you see something like this:

<p align="center">
  <img 
  alt="Backend_error"
  width="800" src="https://media.giphy.com/media/L3R09jOoa9mRsLDd3U/giphy.gif">
</p>

You can be sure the backend is up and running if you see something like this:

<p align="center">
  <img 
  alt="Backend_ok"
  width="800" src="https://media.giphy.com/media/l57Dnrgb4xhuUEGQLU/giphy.gif">
</p>

2. Run frontend Vue server  
   2.1. Open a terminal from the project root directory and excecute the following commands
   ```bash
    cd petromiles-frontend/ # Move to frontend project directory
    npm run serve # Start Vue development server
   ```

> **IMPORTANT**: Do not start the frontend Vue service before the backend service is up and running. Locale international texts are preimported from the backend to avoid fetching language on the client during excecution time. Also notice that most frontend functionalities depend on the backend Nest service.

---

## Development on Docker containers

Create your enviroment files explained on [Backend configuration file](#backend-configuration-file) and [Frontend configuration file](#frontend-configuration-file) (Both under the names of `.env`)

1. Pay important attention to set the values of your Backend variables to

- `DATABASE_PORT=5432`
- `DATABASE_HOST=db`

2. Build and serve backend service

```bash
cd petromiles-backend
docker-compose up
```

(Optional) If you want to clean your database run the following commands

```bash
cd petromiles-backend
docker-compose up --build --remove-orphans -V
```

3. Build and serve frontend service (Only after backend is up and running)

```bash
cd petromiles-frontend
docker build -t petromiles-frontend .
docker run --publish 8080:8080 --network host --env-file=.env petromiles-frontend
```

---

## Production build

### Backend production mode

Name your enviroment variable file under the name of `env`. Then follow the next commands

```
cd petromiles-backend
npm run build
npm run start:prod
```

> WARNING: Don't forget to clear your browser cache

### Frontend production mode

Name your enviroment variable file under the name of `env.production`. Then follow the next commands

```
cd petromiles-frontend
npm run build
npx serve -s dist/
```

---

## Authors and acknowledgment

<p>
    <img
      alt="Gustavo Sánchez Github Avatar" 
      width="80" 
      src="https://github.com/gustavosr98.png?size=80"
    >
    <img
      alt="michellealleyne Github Avatar" 
      width="80" 
      src="https://github.com/michellealleyne.png?size=80"
    >
    <img
      alt="alejjb Github Avatar" 
      width="80" 
      src="https://github.com/alejjb.png?size=80"
    >
    <img
      alt="RafaelMendezUCAB Github Avatar" 
      width="80" 
      src="https://github.com/RafaelMendezUCAB.png?size=80"
    >
    <img
      alt="christianneiraUCAB Github Avatar" 
      width="80" 
      src="https://github.com/christianneiraUCAB.png?size=80"
    >
    <img
      alt="GabTovarUCAB Github Avatar" 
      width="80" 
      src="https://github.com/GabTovarUCAB.png?size=80"
    >
    <img
      alt="JAA1998 Github Avatar" 
      width="80" 
      src="https://github.com/JAA1998.png?size=80"
    >
    <img
      alt="mecoccaro Github Avatar" 
      width="80" 
      src="https://github.com/mecoccaro.png?size=80"
    >
    <img
      alt="DiorfelisMedina Github Avatar" 
      width="80" 
      src="https://github.com/DiorfelisMedina.png?size=80"
    >
</p>

### Product Owner

- Gustavo Sánchez [@gustavosr98](https://github.com/gustavosr98)

### Team Leader

- Michelle Alleyne [@michellealleyne](https://github.com/michellealleyne)

### Frontend Team

- Rafael Mendez [@RafaelMendezUCAB](https://github.com/RafaelMendezUCAB)
- Javier Andrade [@JAA1998](https://github.com/JAA1998)
- Gabriel Tovar [@GabTovarUCAB](https://github.com/GabTovarUCAB)
- Alejandro Jauregui [@alejjb](https://github.com/alejjb)
- Diorfelis Medina [@DiorfelisMedina](https://github.com/DiorfelisMedina)
- Gustavo Sánchez [@gustavosr98](https://github.com/gustavosr98)

### Backend Team

- Michelle Alleyne [@michellealleyne](https://github.com/michellealleyne)
- Javier Andrade [@JAA1998](https://github.com/JAA1998)
- Miguel Coccaro [@mecoccaro](https://github.com/mecoccaro)
- Christian Neira [@christianneiraUCAB](https://github.com/christianneiraUCAB)
- Gustavo Sánchez [@gustavosr98](https://github.com/gustavosr98)

### DevOps

- Gustavo Sánchez [@gustavosr98](https://github.com/gustavosr98)

### QA

- Rafael Mendez [@RafaelMendezUCAB](https://github.com/RafaelMendezUCAB)
- Gabriel Tovar [@GabTovarUCAB](https://github.com/GabTovarUCAB)
