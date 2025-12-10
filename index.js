const { Client, Events, GatewayIntentBits } = require("discord.js");
const psList = require("ps-list").default;

require("dotenv").config({ path: "./config.env" });
const config = require("./config.json");

const token = process.env.TOKEN !== undefined ? process.env.TOKEN : config.TOKEN;

const discordClient = new Client({ intents: [GatewayIntentBits.Guilds] });

discordClient.once(Events.ClientReady, (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    console.log(`Invite me with: https://discord.com/api/oauth2/authorize?client_id=${readyClient.user.id}&permissions=0&scope=bot%20applications.commands`)
    console.log(`Currently running on ${readyClient.guilds.cache.size} ${readyClient.guilds.cache.size == 1 ? "server" : "servers"}`);

    readyClient.user.displayName = config.DISPLAYNAME;
    console.log(`Display name set to: ${config.DISPLAYNAME}`);

    getServerStatus()
});

async function getServerStatus() {
    const processes = await psList();

    // 1. Define the search string for the Minecraft server process
    const searchString = 'screen /usr/lib/jvm/';

    // 2. Use the Array.prototype.find() method to locate the first matching process
    const minecraftProcess = processes.find(process => {
        // Check if the process's command line string exists and starts with the search string
        return process.cmd && process.cmd.startsWith(searchString);
    });

    // 3. Log the result
    if (minecraftProcess) {
        console.log("Minecraft Server Process Found:");
        console.log({
            pid: minecraftProcess.pid,
            name: minecraftProcess.name,
            cmd: minecraftProcess.cmd
        });
        // Now you can update your Discord status based on the process being found!
        // readyClient.user.setActivity('Online', { type: ActivityType.Playing }); 
    } else {
        console.log("Minecraft Server Process NOT Found.");
        // readyClient.user.setActivity('Offline', { type: ActivityType.Watching });
    }
}

discordClient.login(token);