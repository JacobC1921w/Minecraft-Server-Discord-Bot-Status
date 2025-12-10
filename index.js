const { Client, Events, GatewayIntentBits } = require("discord.js");
const fs = require("fs").promises;

require("dotenv").config({ path: "./config.env" });
const config = require("./config.json");

const token = process.env.TOKEN !== undefined ? process.env.TOKEN : config.TOKEN;
const serverAddress = process.env.MCSERVERADDRESS !== undefined ? process.env.MCSERVERADDRESS : config.MCSERVERADDRESS;

const discordClient = new Client({ intents: [GatewayIntentBits.Guilds] });

discordClient.once(Events.ClientReady, async (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    console.log(`Invite me with: https://discord.com/api/oauth2/authorize?client_id=${readyClient.user.id}&permissions=0&scope=bot%20applications.commands`)
    console.log(`Currently running on ${readyClient.guilds.cache.size} ${readyClient.guilds.cache.size == 1 ? "server" : "servers"}`);

    readyClient.user.displayName = config.DISPLAYNAME;
    console.log(`Display name set to: ${config.DISPLAYNAME}`);

    let oldServerStatus = await getServerStatus();
    
    await updateStatus(readyClient, oldServerStatus[0], oldServerStatus[1]);
    
    checkStatusLoop(readyClient, oldServerStatus);
});

async function getServerStatus() {
    const { default: psList } = await import("ps-list");
    const processes = await psList();

    for (const process of processes) {
        if (process.cmd && process.cmd.startsWith(config.PROCESSQUERY) && (process.cmd.includes("forge") || process.cmd.includes("server.jar"))) {
            try {
                const destination = await fs.readlink(`/proc/${process.pid}/cwd`);
                const fileContents = await fs.readFile(`${destination}/logs/latest.log`, "utf-8");
                
                if (fileContents.includes("For help")) {
                    return [true, destination.split('/').at(-1)];
                }
                
            } catch (error) {
                continue; 
            }
        }
    }

    return [false, ""];
}

async function updateStatus(client, isOnline, prescence) {
    const status = isOnline ? "online" : "dnd";
    const statusText = isOnline ? "Online" : "Offline";
    const description = prescence.split(' ').slice(0, -1).join(' ');
    const version = prescence.split(' ').at(-1);
    
    client.user.setPresence({ activities: [{ name: (status != "dnd" ? `${description} (${version}) | IP: ${serverAddress}` : "") }], status: status })
    console.log(`Minecraft server status: ${statusText}`);
}

function checkStatusLoop(readyClient, oldServerStatus) {
    setTimeout(async () => {
        const currentServerStatus = await getServerStatus();

        if (currentServerStatus[0] !== oldServerStatus[0]) {
            await updateStatus(readyClient, currentServerStatus[0], currentServerStatus[1]);
            oldServerStatus = currentServerStatus;
        }
        
        checkStatusLoop(readyClient, oldServerStatus); 
        
    }, config.UPDATEINTERVAL);
}

discordClient.login(token);
