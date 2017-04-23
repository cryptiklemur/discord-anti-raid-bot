class AbstractSubscriber {
    constructor(bot) {
        this.bot = bot;
        
        this.bot.on(this.event, this.doOnEvent.bind(this));
    }
    
    async doOnEvent() {
        try {
            await this.onEvent.apply(this, arguments);
        } catch (e) {
            console.error(e);
        }
    }
}

module.exports = AbstractSubscriber;