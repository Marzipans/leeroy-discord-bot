const common = require('../../common')

const commands = common.commands
const guilds = common.guilds
const groups = common.groups
const colors = common.colors
const send = common.send

commands.alias = {

    name: 'alias',

    group: groups.utility,

    description: 'aliasDescription',

    usage: 'alias [command] [alias]\nalias [command]',

    examples: 'alias prefix summon\nalias prefix',

    action: (msg, command, alias) => {
        const guild = guilds[msg.guild.id]
        const aliases = guild.aliases
        const t = guild.t

        // invalid command call
        if (!command || !commands[command]) {
            commands.man.action(msg, 'alias')
            
        // shows list of aliases
        } else if (!alias) {
            send({
                channel: msg.channel,
                embed: {
                    title: t('aliasesForCommandTitle', { command: command }),
                    description: Object.keys(aliases).filter(e => aliases[e].name === command).join('\n'),
                    color: colors.highlightDefault
                }
            })

        // add or remove alias
        } else {
            if (aliases[alias]) {
                delete aliases[alias]
            } else {
                aliases[alias] = commands[command]
            }

            send({
                channel: msg.channel,
                embed: {
                    title: t(aliases[alias] ? 'aliasAdded' : 'aliasRemoved'),
                    description: t(aliases[alias] ? 'aliasBound' : 'aliasUnbound', { alias: alias, command: command })
                }
            })
        }
    }

}