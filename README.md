# Spotify Listen Together

>[!WARNING]
>This project is in development phase. I'm still learning, **it doesn't work yet**!

Spotify Listen Together is an extension for [Spicetify](https://spicetify.app/) and an alternative solution to Spotify's Group Session.

## Installation

1. Download and install [Spicetify](https://spicetify.app/docs/getting-started/installation).
2. Download [listenTogether.js](https://github.com/riivx/listen-together/releases/latest/download/listenTogether.js).
3. Paste `listenTogether.js` in `%userprofile%\.spicetify\Extensions` or `%appdata%\spicetify\Extensions`.
4. Run `spicetify config extensions listenTogether.js` and `spicetify apply`.

## Usage

Press the "Listen Together" button in the top left to open the extension's menu.

### Creating a Server

To listen together with others, you must first create a server for everyone to join to.
To get started, go to [Spotify Listen Together Server](https://github.com/riivx/listen-together-server) or host with Render.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/riivx/listen-together-server)

### Joining a Server

Press "Join a server" in the menu and enter the server's address and your name.

### Playing, Seeking, and Pausing Songs

Only the hosts are able to change, seek, and pause songs. To become a host, press "Request host" in the menu and enter the password set by the server.

### Disconnecting From a Server

Press "Leave the server" in the menu.

## Examples

Example of the website:
![Website](examples/web.png)

## Todo: (client + server)

- Change "server" to "room". Have multiple rooms per server.
- Fix unexpected behavior when selecting the song that is currently playing.
