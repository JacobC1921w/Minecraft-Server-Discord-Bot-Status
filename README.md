# Minecraft-Server-Discord-Bot-Status
Simple Discord bot to display to users when a Minecraft server is online or not

All this does it it checks if the minecraft server process is running, if the server has started by checking the `latest.log` file, and sets the status to either online (green) or do not disturb (red) depending on the value.

This will assume you:
1. are running your server in Linux, specifically Ubuntu Server if you want to copy/paste the commands below,
2. have named your minecraft server folder `<Description> <Version>/`, i.e. `Paper (Skyblock) 1.8.0/`, `All the Mod 10 TTS 1.21.0/`,

## Installation and execution

1. Setup a Discord bot in the Discord Developer Portal [link](https://discord.com/developers/applications?new_application=true)
2. Make sure you copy the token in the Bot heading, as you will need this
3. Run the following commands:

```bash
sudo apt update
sudo apt install git nodejs npm

git clone git@github.com:JacobC1921w/Minecraft-Server-Discord-Bot-Status.git
cd Minecraft-Server-Discord-Bot-Status/

npm install ps-list
npm install discord.js
```

4. Edit the config.json file with your editor of choice. You MUST change the values: `TOKEN` and `MCSERVERADDRESS` for this to function. Paste your token into `TOKEN` and set the `MCSERVERADDRESS` to your Minecraft servers address

5. Run the following:

```bash
node .
```

6. Click the invite link the bot generates for you, and add it to your Discord server of choice. Since it displays information based on versions, as well as the address, I recommend only adding it to close discord servers!
7. Enjoy :)

## Issues
Please just submit an issue request with information like OS, node version etc.

## Pull requests
Pull requests are very welcome :)