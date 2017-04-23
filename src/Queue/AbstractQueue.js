const mutex = require('node-mutex')({
    url:        process.env.REDIS_URL || "redis://127.0.0.1",
    expireTime: 5000
});

class AbstractQueue {
    constructor(bot, guild) {
        this.bot = bot;
        this.guild = guild;
        
        this.items = [];
        setInterval(this.tick.bind(this), 100);
    }
    
    push(member) {
        this.items.push({member, attempt: 0});
        
        return this;
    }
    
    pop() {
        return this.items.pop();
    }
    
    unshift(item) {
        this.items.unshift(item);
        
        return this;
    }
    
    async lock(callback) {
        const unlock = await mutex.lock(this.name + '-queue-' + this.guild.id);
        
        try {
            await callback();
        } finally {
            unlock();
        }
    }
}

module.exports = AbstractQueue;