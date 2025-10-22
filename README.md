# create-bongos

> CLI tool to scaffold a new Bongos Base project

## What is Bongos Base?

[Bongos Base](https://github.com/sammrosen/bongos-base) is a production-ready Express + TypeScript + PostgreSQL + Prisma + Redis API starter template. It includes:

- **Express.js** - Fast, minimalist web framework
- **TypeScript** - Type-safe development
- **PostgreSQL** - Robust relational database
- **Prisma** - Next-generation ORM
- **Redis** - In-memory data store for caching and sessions
- **Passport.js** - Authentication middleware
- **Docker Compose** - Easy local development setup

## Usage

Create a new project with npm:

```bash
npm create bongos@latest my-app
```

Or use npx:

```bash
npx create-bongos my-app
```

You can also run it without arguments to be prompted for a project name:

```bash
npm create bongos@latest
```

## What it does

The CLI will:

1. Clone the bongos-base template (without git history)
2. Set up the project in a new directory
3. Update the `package.json` with your project name
4. Display next steps to get you started

## Next Steps After Scaffolding

Once your project is created, follow these steps:

```bash
cd my-app
npm install
cp .env.example .env
# Edit .env with your database and Redis settings
npm run docker:up
npm run db:migrate
npm run dev
```

Your API will be running at `http://localhost:3000`!

## Development

To work on this CLI tool locally:

```bash
# Clone the repository
git clone https://github.com/sammrosen/create-bongos.git
cd create-bongos

# Install dependencies
npm install

# Build the TypeScript
npm run build

# Link for local testing
npm link

# Test it out
npx create-bongos test-app
```

## Publishing

To publish a new version:

```bash
npm run build
npm version patch # or minor, or major
npm publish --access public
```

## License

MIT

## Author

Sam Rosen

## Links

- [Bongos Base Template](https://github.com/sammrosen/bongos-base)
- [Report Issues](https://github.com/sammrosen/create-bongos/issues)

