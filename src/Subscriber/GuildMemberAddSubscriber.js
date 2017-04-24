const request            = require('request');
const moment             = require('moment-timezone');
const mongoose           = require('mongoose');
const AbstractSubscriber = require('./AbstractSubscriber');
const Helper             = require('../Helper.js');
const KickQueue          = require('../Queue/KickQueue.js');
const BanQueue           = require('../Queue/BanQueue.js');
const Join               = require('../Model/Join');
const Long               = mongoose.Types.Long;

class GuildCreateSubscriber extends AbstractSubscriber {
    get event() {
        return 'guildMemberAdd';
    }
    
    async handleUser(type, guild, member) {
        const join   = new Join({guildId: Long.fromString(guild.id), userId: Long.fromString(member.id), method: type});
        const config = await this.bot.config.get(guild);
        if (!config.enabled) {
            join.handled    = false;
            join.handleDate = undefined;
            await join.save();
            
            return;
        }
        
        if (config.whitelist.findIndex(x => x.toString() === member.id) >= 0) {
            join.handled     = false;
            join.handleDate  = undefined;
            join.whitelisted = true;
            await join.save();
            
            return;
        }
        
        if (config.webhook) {
            request({
                method: 'post',
                body:   {
                    avatar_url: this.bot.user.avatarURL,
                    username:   this.bot.user.username,
                    content:    "New account just joined: " + member.mention + " (" + member.id + ")"
                },
                json:   true,
                url:    config.webhook
            });
        }
        
        if (type === 'notify') {
            if (!config.webhook) {
                return console.error("No webhook defined for " + guild.id);
            }
            
            await join.save();
            
            return;
        }
        
        let message = config.message;
        if (config.invite) {
            message += "\n\n" + config.invite;
        }
        
        setTimeout(
            async () => {
                try {
                    const channel = await member.user.getDMChannel();
                    await channel.createMessage(message);
                } catch (e) {
                    // Do nothing, still want to kick/ban
                }
                
                
                if (type === 'kick') {
                    if (!this.bot.kickQueues[guild.id]) {
                        this.bot.kickQueues[guild.id] = new KickQueue(this.bot, guild);
                    }
                    
                    this.bot.kickQueues[guild.id].push({member, join});
                } else {
                    if (!this.bot.banQueues[guild.id]) {
                        this.bot.banQueues[guild.id] = new BanQueue(this.bot, guild);
                    }
                    
                    this.bot.banQueues[guild.id].push({member, join});
                }
            },
            300
        );
    }
    
    async onEvent(guild, member) {
        const config = await this.bot.config.get(guild);
        if (config.status === 'disabled') {
            return;
        }
        
        const type = config.method;
        if (config.age !== 'all') {
            const age  = Helper.ParseDuration(config.age).asMilliseconds();
            const diff = moment.duration(Math.abs(moment().diff(member.createdAt)));
            if (diff.asMilliseconds() >= age) {
                return;
            }
        }
        
        await this.handleUser(type, guild, member);
    }
}

module.exports = GuildCreateSubscriber;