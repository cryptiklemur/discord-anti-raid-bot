const AbstractQueue = require('./AbstractQueue');

class KickQueue extends AbstractQueue {
    get name() { return 'kick'; }
    
    async tick() {
        this.lock(async () => {
            let item = this.pop();
            if (!item) {
                return;
            }
            
            try {
                await item.member.kick();
            } catch (e) {
                item.attempt++;
                if (item.attempt < 50) {
                    this.unshift(item);
                }
            }
        });
    }
}

module.exports = KickQueue;