const chalk = require('chalk');
const { Command } = require('commander');
const execa = require('execa');
const fse = require('fs-extra');
const ora = require('ora');
const path = require('path');
const prompts = require('prompts');
const { replaceInFileSync } = require('replace-in-file');
const simpleGit = require('simple-git');

const packageJson = require('../package.json');

let projectPath;

const cli = async () => {
  const program = new Command(packageJson.name)
    .version(packageJson.version, '-v, --version', 'output the current version')
    .arguments('[project-path]')
    .action((projectName) => {
      projectPath = projectName;
    })
    .usage(chalk.magenta('<project-path>'))
    .on('--help', () => {
      console.log('');
      console.log('If you want to report issues, you can do it here:');
      console.log(
        chalk.blue('https://github.com/sellectuwa/create-eleact-app/issues'),
      );

      console.log('');
      console.log(
        'If you are interested in fixing issues and contributing directly to the code base:',
      );
      console.log(
        chalk.blue('https://github.com/sellectuwa/create-eleact-app'),
      );
      console.log();
    })
    .parse(process.argv);

  if (typeof projectPath === 'undefined') {
    console.error('Please specify the project directory:');
    console.log(
      `  ${chalk.blue(program.name())} ${chalk.magenta('<project-path>')}`,
    );
    console.log();
    console.log('For example:');
    console.log(
      `  ${chalk.blue(program.name())} ${chalk.magenta('my-react-app')}`,
    );
    console.log();
    console.log(
      `Run ${chalk.blue.underline(
        `${program.name()} --help`,
      )} to see all options.`,
    );
    console.log();
    process.exit(1);
  }

  projectPath = path.resolve(process.cwd(), projectPath);

  if (/[A-Z]/.test(path.basename(projectPath))) {
    console.error(
      "The name of the project directory can't contain uppercase letters",
    );
    console.log();
    console.log(
      `Run ${chalk.blue.underline(
        `${program.name()} --help`,
      )} to see all options.`,
    );
    console.log();
    process.exit(1);
  }

  if (/\s/.test(path.basename(projectPath))) {
    console.error("The name of the project directory can't contain whitespace");
    console.log();
    console.log(
      `Run ${chalk.blue.underline(
        `${program.name()} --help`,
      )} to see all options.`,
    );
    console.log();
    process.exit(1);
  }

  if (fse.existsSync(projectPath)) {
    if (fse.readdirSync(projectPath).length !== 0) {
      console.error(
        "Please specify an empty directory or one that doesn't exist",
      );
      console.log();
      console.log(
        `Run ${chalk.blue.underline(
          `${program.name()} --help`,
        )} to see all options.`,
      );
      console.log();
      process.exit(1);
    }
  } else {
    fse.mkdirSync(projectPath);
  }

  let useYarn = true;

  try {
    execa.sync('yarn', '-v');
  } catch (error) {
    useYarn = false;
  }

  if (useYarn) {
    await prompts({
      type: 'select',
      name: 'value',
      message: 'What package manager do you want to use',
      choices: [
        { title: 'yarn', value: 'yarn' },
        { title: 'npm', value: 'npm' },
      ],
    }).then((response) => {
      useYarn = response.value === 'yarn';
    });
  }

  console.log();

  let spinner = ora('Copying template...').start();

  fse.copySync(path.resolve(__dirname, '../templates/javascript'), projectPath);

  spinner.succeed('Copying template... DONE');

  spinner = ora('Configuring project...').start();

  const projectJson = JSON.parse(
    fse.readFileSync(path.resolve(projectPath, 'template.json')),
  );

  fse.writeFileSync(
    path.resolve(projectPath, 'package.json'),
    JSON.stringify(
      { name: path.basename(projectPath), ...projectJson },
      null,
      2,
    ),
  );

  fse.unlinkSync(path.resolve(projectPath, 'template.json'));

  try {
    replaceInFileSync({
      files: path.resolve(projectPath, 'README.md'),
      from: '`PROJECT_NAME`',
      to: path.basename(projectPath),
    });
  } catch (error) {
    console.error('Error occurred:', error);
  }

  spinner.succeed('Configuring project... DONE');

  spinner = ora('Installing dependencies...').start();

  try {
    await execa(useYarn ? 'yarn' : 'npm', ['install'], {
      cwd: projectPath,
    });
  } catch (error) {
    spinner.fail('Installing dependencies... FAILED');
    console.error(error);
    process.exit(1);
  }

  spinner.succeed('Installing dependencies... DONE');

  spinner = ora('Initializing git...').start();

  const git = simpleGit({ baseDir: projectPath });
  await git.init();
  await git.add('.');
  await git.commit('Initialize project using Create Eleact App');

  spinner.succeed('Initializing git... DONE');

  // Summary
  console.log();
  console.log(`Success! You created new project at ${projectPath}`);
  console.log('You can start with:');
  console.log();
  console.log(chalk.blue(`  cd ${path.basename(projectPath)}`));
  console.log(chalk.blue(`  ${useYarn ? 'yarn' : 'npm'} start`));
  console.log();
  console.log('Happy coding!');
  console.log('');
};

module.exports = cli;
