#!/usr/bin/env node

import { program } from 'commander';
import prompts from 'prompts';
import chalk from 'chalk';
import ora from 'ora';
import degit from 'degit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read package.json to get version
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

interface PromptResponse {
  projectName: string;
}

function validateProjectName(name: string): boolean {
  // Check for valid directory name
  const validNameRegex = /^[a-zA-Z0-9-_]+$/;
  return validNameRegex.test(name);
}

function displayWelcome(): void {
  console.log();
  console.log(chalk.bold.cyan('🥁  Welcome to Bongos!'));
  console.log(chalk.gray('━'.repeat(50)));
  console.log();
}

function displayNextSteps(projectName: string): void {
  console.log();
  console.log(chalk.bold.green('✓ Success!') + chalk.gray(' Your project is ready.'));
  console.log();
  console.log(chalk.bold('Next steps:'));
  console.log();
  console.log(chalk.cyan(`  cd ${projectName}`));
  console.log(chalk.cyan('  npm install'));
  console.log(chalk.cyan('  cp .env.example .env'));
  console.log(chalk.gray('  # Edit .env with your database and Redis settings'));
  console.log(chalk.cyan('  npm run docker:up'));
  console.log(chalk.cyan('  npm run db:migrate'));
  console.log(chalk.cyan('  npm run dev'));
  console.log();
  console.log(chalk.gray('Your Express + TypeScript + PostgreSQL + Prisma + Redis API'));
  console.log(chalk.gray('is ready to go! Happy coding! 🚀'));
  console.log();
}

async function createProject(projectName: string): Promise<void> {
  try {
    // Validate project name
    if (!validateProjectName(projectName)) {
      console.error(
        chalk.red('Error:') +
          ' Project name can only contain letters, numbers, hyphens, and underscores.'
      );
      process.exit(1);
    }

    // Get target directory
    const targetDir = path.resolve(process.cwd(), projectName);

    // Check if directory already exists
    if (fs.existsSync(targetDir)) {
      console.error(
        chalk.red('Error:') +
          ` Directory "${projectName}" already exists. Please choose a different name.`
      );
      process.exit(1);
    }

    // Clone the template using degit
    const spinner = ora({
      text: 'Downloading bongos-base template...',
      color: 'cyan',
    }).start();

    try {
      const emitter = degit('sammrosen/bongos-base', {
        cache: false,
        force: true,
      });

      await emitter.clone(targetDir);
      spinner.succeed('Template downloaded successfully');
    } catch (error) {
      spinner.fail('Failed to download template');
      console.error(
        chalk.red('Error:'),
        error instanceof Error ? error.message : 'Unknown error'
      );
      console.log();
      console.log(
        chalk.yellow('Tip:') +
          ' Make sure you have an internet connection and can access GitHub.'
      );
      process.exit(1);
    }

    // Update package.json with project name
    const updateSpinner = ora({
      text: 'Configuring project...',
      color: 'cyan',
    }).start();

    try {
      const pkgPath = path.join(targetDir, 'package.json');

      if (!fs.existsSync(pkgPath)) {
        updateSpinner.fail('package.json not found in template');
        console.error(
          chalk.red('Error:') +
            ' The template does not contain a package.json file.'
        );
        process.exit(1);
      }

      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      pkg.name = projectName;
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

      updateSpinner.succeed('Project configured');
    } catch (error) {
      updateSpinner.fail('Failed to configure project');
      console.error(
        chalk.red('Error:'),
        error instanceof Error ? error.message : 'Unknown error'
      );
      process.exit(1);
    }

    // Display success message and next steps
    displayNextSteps(projectName);
  } catch (error) {
    console.error(
      chalk.red('Error:'),
      error instanceof Error ? error.message : 'Unknown error'
    );
    process.exit(1);
  }
}

async function main(): Promise<void> {
  displayWelcome();

  program
    .name('create-bongos')
    .description('Create a new Bongos Base project')
    .version(packageJson.version)
    .argument('[project-name]', 'Name of your project')
    .action(async (projectName?: string) => {
      let finalProjectName = projectName;

      // If no project name provided, prompt for it
      if (!finalProjectName) {
        const response = (await prompts({
          type: 'text',
          name: 'projectName',
          message: 'What is your project named?',
          initial: 'my-bongos-app',
          validate: (value: string) =>
            validateProjectName(value)
              ? true
              : 'Project name can only contain letters, numbers, hyphens, and underscores',
        })) as PromptResponse;

        // Handle Ctrl+C
        if (!response.projectName) {
          console.log();
          console.log(chalk.yellow('Operation cancelled.'));
          process.exit(0);
        }

        finalProjectName = response.projectName;
      }

      await createProject(finalProjectName);
    });

  await program.parseAsync(process.argv);
}

main().catch((error) => {
  console.error(chalk.red('Unexpected error:'), error);
  process.exit(1);
});

