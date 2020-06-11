This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify

# Using VS Code to program the Raspberry Pi

A guide to setting up and using Microsoft VS Code, running on a PC, to remotely program and debug code on a Raspberry Pi. The PC uses Windows 10 1903 and the Raspberry Pi uses Raspian Buster.

This guide is specifically for this application, i.e. bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Windows

For Windows 10 version 1809 and later.

### Visual Studio Code

To install VS Code use the guide found [here](https://code.visualstudio.com/docs/setup/windows)

#### Install `Remote-SSH extension`

From the extensions tab search for `Remote - SSH`. Click on the green `Install` button.

When installed follow this [guide](https://code.visualstudio.com/docs/remote/remote-overview) for setup details.

#### Install the debugger - (for Firefox)

To debug the code we need to install the `Debugger for Firefox` extension.
Follow the instructions in the ReadMe, especially about enabling the debug tools in the browser. The `.vscode/launch.json` snippet should look similar to this (the url should):

```
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "firefox",
            "request": "attach",
            "name": "Attach to Firefox",
            "url": "http://ip-address-of-rpi:3000",
            "webRoot": "${workspaceFolder}/src",
            "pathMappings": [
                {
                    "url": "http://ip-address-of-rpi/path/to/src",
                    "path": "${workspaceFolder}/src"
                }
            ]
        },
        ...
        other configutations
        ...
    ]
}
```

and when debugging launch Firefox from a Command Prompt using:

`"C:\Program Files\Mozilla Firefox\firefox.exe" -start-debugger-server`

[*see below on how to get the IP address of the Raspberry Pi*](#raspberry-pi-setup)

### OpenSSH

Install OpenSSH on Windows using these [instructions](https://docs.microsoft.com/en-gb/windows-server/administration/openssh/openssh_install_firstuse)

## Raspberry Pi setup

Make a note of the IP address of the Raspberry Pi. Run the command:

`hostname -I`

### Configure the Raspberry Pi

Run the command:

`sudo raspi-config`

from the options select `2 Network Options`, and then `N1 Hostname` to 
set the rasberry pi's hostname. Then from the first page select `5 Interfacing Options`, and enable SSH. Use the tab key to navigate to the `<Finish>` button and reboot.

### Remote Development using SSH

Follow this [guide](https://code.visualstudio.com/docs/remote/ssh#_connect-to-a-remote-host) for connecting to the Raspberry Pi.

Make a different public-private key pair to the ones Putty has made, otherwise the user password will have to be given as well as any passphrase. Ensure that the `.ssh\config` file (on the PC) is similar to this:

```
#Read more about SSH config files: https://linux.die.net/man/5/ssh_config
Host slider
    User username
    Hostname hostname-of-rpi
    IdentityFile location-of-your-private-key
```
where `IdentityFile` is the one generated for the remote extension.

## Development

See the comments in `src/state/initial.js` for how to set up the application to run on the development server.
Ensure `cncjs` is being served, then the use the url `http://ip-address-of-rpi:3000`.

## Deployment

Enter the command

`npm run build`

this will make a production build of the application in the `build` directory of the project.

Make, or add, an entry to the `mountPoints` section of the cncjs configuration file (`~/.cncrc`):

```
...,
"mountPoints": [
        {
            "route": "/pendant",
            "target": "/path/to/build"
        }
    ],
...
```

The program will be served from http://ip-address-of-rpi:8000/pendant/. To stop `cncjs` use the command:

`pkill -f cncjs`