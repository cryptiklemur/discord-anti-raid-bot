const request            = require('request');
const moment             = require('moment-timezone');
const AbstractSubscriber = require('./AbstractSubscriber');
const Helper             = require('../Helper.js');
const KickQueue          = require('../Queue/KickQueue.js');
const BanQueue           = require('../Queue/BanQueue.js');

class GuildCreateSubscriber extends AbstractSubscriber {
    constructor(bot) {
        super(bot);
        
        this.kickQueues = {};
        this.banQueues  = {};
    }
    
    get event() {
        return 'guildMemberAdd';
    }
    
    async handleUser(type, guild, member) {
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
                    if (!this.kickQueues[guild.id]) {
                        this.kickQueues[guild.id] = new KickQueue(this.bot, guild);
                    }
                
                    this.kickQueues[guild.id].push(member);
                } else {
                    if (!this.banQueues[guild.id]) {
                        this.banQueues[guild.id] = new BanQueue(this.bot, guild);
                    }
                
                    this.banQueues[guild.id].push(member);
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