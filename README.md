# Cal: Your Personal AI Assistant

Cal is trash can fire of an attempt at making a personal assistant. It is a work in progress and is not intended for production use.

## Scripts Summary

Here is a summary of the available npm scripts in the project:

- **build**: `dotenv -e .env -- turbo build` - Builds the project using the Turbo build system.
- **dev**: `dotenv -e .env -- turbo dev` - Starts the development server.
- **test**: `dotenv -e .env -- turbo test` - Runs the test suite.
- **lint:no-fix**: `biome check .` - Checks the code for linting issues without fixing them.
- **lint**: `biome check . --write` - Checks and fixes linting issues.
- **db:generate**: `dotenv -e .env -- turbo db:generate` - Generates Prisma client.
- **db:push**: `dotenv -e .env -- turbo db:push` - Pushes database schema changes.
- **db:seed**: `dotenv -e .env -- turbo db:seed` - Seeds the database with initial data.
- **db:studio**: `dotenv -e .env -- turbo db:studio` - Opens Prisma Studio for database management.
- **db:migrate:dev**: `dotenv -e .env -- turbo db:migrate:dev` - Runs database migrations in development mode.

## Installation

To get started with Cal, clone the repository and install the dependencies:

```sh
npm install
```

## Usage

After installation, you can start the development server using:

```sh
npm run dev
```

Explore the capabilities of your personal AI assistant and customize it to fit your needs.

## Contributing

Honestly, only really sharing this so my friends can look at it. Please don't contribute directly.

## License

This project is licensed under the MIT License.
