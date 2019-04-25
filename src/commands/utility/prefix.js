const common = require('../../common')

const commands = common.commands
const groups = common.groups
const config = common.config
const guilds = common.guilds
const colors = common.colors
const send = common.send

commands.prefix = {

    name: 'prefix',

    group: groups.utility,

    description: 'prefixDescription',

    usage: 'prefix [new value]',

    examples: 'prefix e!\nprefix reset',

    arguments: 1,

    action: (msg, prefix) => {
        if (prefix) {
            const guild = guilds[msg.guild.id]
            const t = guild.t

            guild.prefix = (prefix === 'reset') ? config.prefix : prefix
            send({
                channel: msg.channel,
                embed: {
                    title: t('prefixChanged'),
                    description: t('prefixChangedDescription', { prefix: prefix }),
                    color: colors.highlightSuccess
                }
            })
        } else {
            commands.man.action(msg, 'prefix')
        }
    }

}