const AbstractCommand = require('../AbstractCommand');

class AbstractSubCommand extends AbstractCommand {
    constructor(bot, parentCommand) {
        super(bot, false);
    
        this.command = parentCommand.registerSubcommand(this.name, this.doRun.bind(this), this.config);
    }
}

module.exports = AbstractSubCommand;
