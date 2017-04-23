const AbstractSubCommand = require('./AbstractSubCommand');

class RaidWebhookSubCommand extends AbstractSubCommand {
    get name() { return 'webhook'; }
    
    get configuration() {
        return {
            description:     "Updates the webhook.",
            fullDescription: `Updates the webhook for notifications.`,
            caseInsensitive: true,
            guildOnly:       true,
            usage:           "[webhook url]",
            requirements:    {
                permissions: {
                    "manageGuild": true
                }
            }
        };
    }
    
    async run(message, args) {
        if (args.length === 0) {
            await message.reply("Current webhook: " + (this.config.webhook || "No webhook defined."));
        
            return;
        }
    
        this.config.set('webhook', args.join(" "));
        await this.config.save();
    
        await message.addReaction("👍🏻");
    }
}

module.exports = RaidWebhookSubCommand;