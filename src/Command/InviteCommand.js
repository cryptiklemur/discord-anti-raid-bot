const AbstractCommand = require('./AbstractCommand');

class InviteCommand extends AbstractCommand {
    get name() { return 'invite'};
    
    get configuration() {
        return {
            description:     "Invites me to a server!",
            fullDescription: "Invites me to a server!",
            caseInsensitive: true
        };
    }
    
    async run(msg) {
        await msg.reply("https://discordapp.com/oauth2/authorize?client_id=305140278480863233&scope=bot&permissions=3078");
    }
}

module.exports = InviteCommand;
