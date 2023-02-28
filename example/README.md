# Python App on Space

This minimal template is an example of a Space app built with Python and [FastAPI](https://fastapi.tiangolo.com).

## Setup

1. If you don't already have a Space account, create one for free [here](https://deta.space/signup).
2. Install the Space CLI and link your Space account to the CLI. Instructions to do that can be found [here](https://deta.space/docs/en/basics/cli).
3. Run the `space new` command inside the root of your project to create a new builder project on Space.

> Important: running `space new` will create a `.space` directory inside your project. This directory contains sensitive information about your app and is used by the Space CLI to push your app to Space. Do not change the name of the directory, include it in any version control software, or add it to repositories.

## Project Structure

```tree
.
├── main.py
├── requirements.txt
├── Spacefile
└── Discovery.md
```

- `main.py`: This is the entry point of your app, and it contains the code to run your app. Do not change the name of this file. It must contain an identifier `app` which is an instance of an **ASGI** (e.g. FastAPI) or **WSGI** (e.g. Flask) application.

- `requirements.txt`: This optional file contains your app's dependencies. It is recommended to pin versions of packages (e.g. `deta~=1.1.0`) in order to avoid issues without outdated packages or version conflicts. Read more about version pinning [here](https://medium.com/knerd/best-practices-for-python-dependency-management-cc8d1913db82).

- `Spacefile`: This is the configuration file used by Space to build and deploy your app. To learn more please refer to the [Spacefile](https://deta.space/docs/en/reference/spacefile#whats-the-spacefile) guide.

- `Discovery.md`: This optional file contains information about your app to display on the [Space App Marketplace](https://deta.space/discovery). To learn more please refer to the [Discovery.md](https://deta.space/docs/en/reference/discovery) guide.

## Deploying your Space App

Run the `space push` command to upload your code to Space, and the build pipeline will start packaging your app. Once packaging is complete, you will see your app's builder instance in the [Builder](https://deta.space/builder). You can use this instance to debug and test to make sure your app is ready for use.

## Releasing your Space App

When you are ready to release your app , run the `space release` command. This will create a new release of your app and make it available for other users to install. If you want to make the app visible on the [Space App Marketplace](https://deta.space/discovery), add the `--listed` flag to the command. Your app will get its own page that will display the contents of the `Discovery.md` file mentioned earlier.
