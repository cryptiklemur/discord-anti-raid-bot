const AbstractSubscriber = require('./AbstractSubscriber');

class GuildCreateSubscriber extends AbstractSubscriber {
    get event() { return 'guildCreate'; }
    
    async onEvent(guild) {
        const query = {guildId: guild.id};
    
        this.bot.config.get(guild);
    }
}

module.exports = GuildCreateSubscriber;