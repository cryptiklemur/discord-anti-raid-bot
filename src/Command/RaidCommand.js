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
            await message.reply("Current raid mode status: " + (this.config.enabled ? 'enabled' : 'disabled'));
            
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