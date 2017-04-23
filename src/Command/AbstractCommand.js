class AbstractCommand {
    constructor(bot, register = true) {
        this.bot = bot;
        
        if (register) {
            this.command = bot.registerCommand(this.name, this.doRun.bind(this), this.configuration);
        }
    }
    
    async doRun(message, args) {
        this.config = await this.bot.config.get(message.channel.guild);
        
        return await this.run(message, args);
    }
}

module.exports = AbstractCommand;
