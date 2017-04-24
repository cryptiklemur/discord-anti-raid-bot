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
                if (item.member) {
                    await item.member.ban(1);
                } else if (item.id) {
                    console.log(`Banning from ${this.guild.id}: ${item.id}`);
                    await this.guild.banMember(item.id, 1);
                } else {
                    throw new Error("Item with no member or id");
                }
                
                if (item.join) {
                    await item.join.save();
                }
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