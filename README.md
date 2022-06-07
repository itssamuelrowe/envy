# Envy

Envy allows you to synchronize environment variables across different machines.

> NOTE: As of this writing, Envy is a proof-of-concept and is not meant for production.
> Mainly because it lacks authentication, authorization, and encryption. See below for
> a list of features that are yet to be implemented.

Let's say you are working with five other developers on an API. If the API needs environment variables, they will vary across different environments. To keep your secrets safe, you cannot store `.env` in GitHub. Therefore, each developer will have a local copy of the `.env` file.

Sometimes a developer may update the `.env` file while working on a feature. Sometimes they may forget to update the `.sample.env` file or update the team with the new environment variable. This leads to some frustrating and useless bug when the other developer is testing the feature. Sometimes you end up spending an hour on a bug and then discover that it was due to outdated environment variables.

So how do you keep the `.env` file secret but synchronized within the team so that each time we update the environment variable it's updated for every member of the team? Say hello to Envy!

Envy keeps a copy of all the secrets in a central server. Each branch receives its own copy of set environment variables called variants. You can set or unset without disrupting other developers in the team. Once the feature branch is merged, you can merge the corresponding variants, and other developers can pull the changes.

## Installation

You will need Node.js, Yarn and MongoDB to run Envy. You can use MongoDB Atlas to procure a MongoDB instance quickly.

1. Clone the repository from GitHub.

```
git clone https://github.com/itssamuelrowe/envy.git envy
```

2. Create `.env` for the API. Make sure you replace "<MONGODB_DATABASE_URL>" with your URL. (The irony... :P)

```
cd envy/packages/api
cat > .env <<EOF
NODE_ENV=development
DATABASE_URL=<MONGODB_DATABASE_URL>
PORT=3001
EOF
```

3. Install the dependencies for the API and start the development server.

```
yarn install
yarn start:dev
```

4. Install the dependencies for the CLI and build it.

```
cd ../cli
yarn install
yarn build
```

5. Add Envy to your `PATH`. To keep it permanently in your path, you will have to edit your `~/.bashrc` or the equivalent for your shell.

```
PATH=$PATH:$(pwd)/bin
```

6. Run Envy!

```
envy
```

## Sample Usage

### Initializing Project

To use Envy for your project, you need to register your project first.

```
envy create hypertool-api
```

In this example, `hypertool-api` is the project name.

### Setting environment variables

Next, you can add any number of environment variables using the `set` command.

```
envy set hypertool-api:development \
    NODE_ENV=development \
    API_URL=http://localhost:3001
```

The set command requires two arguments:

- A handle that points to the variant, which is of the form `<project_name>:<variant_name>`. If a variant does not exist within your project, Envy creates it for you.
- A list of key-value pairs specifying the variables you want to create.

### Getting environment variables

You can read environment variables from a variant using the `get` command.

```
envy get hypertool-api:development --format=pairs
```

The get command requires a handle that points to the variant. In this example, the handle is `hypertool-api:development`. You can optionally specify the output format using `--format`, which accepts `pairs|json|yaml`.

## Upcoming Features

- Git hooks - Install Git hooks that automatically detect changes to variants.
- Asymmetric encryption - As of this writing, secrets are kept in plaintext. An aymmetric encryption algorithm such as AES will be used to store the secrets.
- Authentication
- Authorization
- Web app
- Teams
- Generator - Generate `.env` based on a template
- Integration to Kubernetes, GitHub, and so on.

You can contact me at `samuelrowe1999@gmail.com` for more information.

## License

The open-source components of Envy are available under the [MIT license](https://opensource.org/licenses/MIT).
