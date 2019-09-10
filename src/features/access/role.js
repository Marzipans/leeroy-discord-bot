import '../../internal/extensions'
import groups from '../../internal/groups'
import colors from '../../internal/colors'
import man from '../settings/man'
import { Server } from '../../internal/config'
import P from '../../internal/permissions'

function hasHigherRole(msg, expected) {
    return msg.guild.member(msg.author).roles
        .find(role => role.comparePositionTo(expected) > 0)
}

export default {
    name: 'role',
    group: groups.access,
    description: 'role.description',
    usage: 'role [@role] [description]',
    examples: 'role @somerole Gives access to some voice and text channels',
    arguments: 2,
    reaction: true,
    emojis: ['👌'],
    permissions: [P.MANAGE_ROLES],

    handle: async (msg, snowflake, description) => {
        const t = await Server.language(msg.guild)
        const role = msg.guild.roles.get(snowflake.slice(3, -1))

        if (!snowflake) {
            man.handle(msg, 'role')

        } else if (!role) {
            msg.channel.send('', {
                embed: {
                    title: t('global.error'),
                    description: t('role.role_not_found', { role: snowflake }),
                    color: colors.highlightError
                }
            })

        } else if (!hasHigherRole(msg, role)) {
            msg.channel.send('', {
                embed: {
                    title: t('global.error'),
                    description: t('role.role_is_higher_or_equals'),
                    color: colors.highlightError
                }
            })

        } else {
            const embed = {
                embed: {
                    color: colors.highlightDefault,
                    fields: [
                        {
                            name: 'feature',
                            value: 'role',
                            inline: true
                        },
                        {
                            name: t('role.role'),
                            value: '' + snowflake,
                            inline: true
                        },
                        {
                            name: t('role.howto'),
                            value: '👌',
                            inline: true
                        }
                    ]
                }
            }
            msg.channel
                .send(description, embed)
                .then(message => { message.react('👌') })
        }
    },

    react: async (msg, emoji, author, reacted) => {
       const snowflake = msg.embeds[0].fields[1].value
       const role = msg.guild.roles.get(snowflake.slice(3, -1))
       if (role && author) {
           if (reacted) {
               author.addRole(role)
           } else {
               author.removeRole(role)
           }
       }
    }
}