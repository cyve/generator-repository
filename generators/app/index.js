/**
 * Initialize a new project
 */
var Generator = require('yeoman-generator');

module.exports = class extends Generator {
    /**
     * Set default values from current directory name
     */
    constructor(args, opts) {
        super(args, opts);

        this.name = this.env.cwd.split(/[\\/]/).pop();
        this.description = '';
        this.namespace = ('-' + this.name).replace(/-([a-z])/g, function (matches) { return matches[1].toUpperCase(); });
        this.gitUrl = 'git@github.com:cyve/' + this.name + '.git'
    }

    /**
     * Ask user for preferences
     */
    async prompting() {
        this.answers = await this.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Name',
                default: this.name,
            },
            {
                type: 'input',
                name: 'description',
                message: 'Description',
                default: this.description,
            },
            {
                type: 'input',
                name: 'namespace',
                message: 'Namespace',
                default: this.namespace,
            },
            {
                type: 'input',
                name: 'gitUrl',
                message: 'Git remote URL',
                default: this.gitUrl,
            },
        ]);
    }

    /**
     * Create arborescence
     */
    writing() {
        this.fs.copy(
            this.templatePath('src/.gitkeep'),
            this.destinationPath('src/.gitkeep')
        );

        this.fs.copy(
            this.templatePath('tests/.gitkeep'),
            this.destinationPath('tests/.gitkeep')
        );

        this.fs.copy(
            this.templatePath('.gitignore'),
            this.destinationPath('.gitignore')
        );

        this.fs.copyTpl(
            this.templatePath('composer.json'),
            this.destinationPath('composer.json'),
            {
                name: this.answers.name,
                description: this.answers.description,
                namespace: this.answers.namespace,
            }
        );

        this.fs.copyTpl(
            this.templatePath('LICENSE'),
            this.destinationPath('LICENSE'),
            {
                year: (new Date()).getFullYear(),
            }
        );

        this.fs.copy(
            this.templatePath('phpunit.xml'),
            this.destinationPath('phpunit.xml')
        );

        this.fs.copyTpl(
            this.templatePath('README.md'),
            this.destinationPath('README.md'),
            {
                name: this.answers.name,
                description: this.answers.description,
            }
        );
    }

    /**
     * Initialize Git
     */
    end() {
        this.spawnCommandSync('git', ['init', '--quiet']);
        this.spawnCommandSync('git', ['config', 'user.name', 'Cyril Vmd']);
        this.spawnCommandSync('git', ['config', 'user.email', 'cyril@cyrilwebdesign.com']);
        this.spawnCommandSync('git', ['remote', 'add', 'origin', this.answers.gitUrl]);
    }
};
