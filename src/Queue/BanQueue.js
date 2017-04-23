const AbstractQueue = require('./AbstractQueue');

class BanQueue extends AbstractQueue {
    get name() { return 'ban'; }
    
    async tick() {
        this.lock(async () => {
            let item = this.pop();
            if (!item) {
                return;
            }
            
            try {
                await item.member.ban();
            } catch (e) {
                item.attempt++;
                if (item.attempt < 50) {
                    this.unshift(item);
                }
            }
        });
    }
}

module.exports = BanQueue;