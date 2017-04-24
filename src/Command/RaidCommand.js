const AbstractCommand       = require('./AbstractCommand');
const RaidWebhookSubCommand = require('./SubCommand/RaidWebhookSubCommand');
const RaidMethodSubCommand  = require('./SubCommand/RaidMethodSubCommand');
const RaidMessageSubCommand = require('./SubCommand/RaidMessageSubCommand');
const RaidInviteSubCommand  = require('./SubCommand/RaidInviteSubCommand');
const RaidAgeSubCommand     = require('./SubCommand/RaidAgeSubCommand');

class RaidCommand extends AbstractCommand {
    get name() {
        return 'raid';
    }
    
    get configuration() {
        return {
            description:     "Gets or sets the current status of raid mode. Type `help raid` to get the sub commands.",
            fullDescription: "Gets or sets the current status of raid mode. Type `help raid` to get the sub commands.",
            caseInsensitive: true,
            guildOnly:       true,
            usage:           "[status=on|off|enable|disable|enabled|disabled]",
            requirements:    {
                permissions: {
                    "manageGuild": true
                }
            }
        };
    }
    
    get subCommands() {
        return [
            RaidWebhookSubCommand,
            RaidMethodSubCommand,
            RaidMessageSubCommand,
            RaidInviteSubCommand,
            RaidAgeSubCommand
        ];
    }
    
    async run(message, args) {
        if (args.length === 0) {
            await this.bot.createMessage(message.channel.id, {
                embed: {
                    title: "Current raid mode status",
                    fields: [
                        {inline: true, name: '__Status:__', value: this.config.enabled ? 'enabled' : 'disabled'},
                        {inline: true, name: '__Invite:__', value: this.config.invite || 'none'},
                        {inline: true, name: '__Webhook:__', value: this.config.webhook || 'none'},
                        {inline: true, name: '__Method:__', value: this.config.method || 'kick'},
                        {inline: true, name: '__Age:__', value: this.config.age || '24h'},
                    ]
                }
            });
            
            return;
        }
        
        const stringStatus = args.join(" ").toLowerCase();
        if (['on', 'off', 'enabled', 'disabled', 'enable', 'disable'].indexOf(stringStatus) === -1) {
            await message.reply("Invalid status.");
            
            return;
        }
        
        this.config.set('enabled', stringStatus === 'on' || stringStatus === 'enabled' || stringStatus === 'enable');
        await this.config.save();
        
        await message.addReaction("👍🏻");
    }
}

module.exports = RaidCommand;