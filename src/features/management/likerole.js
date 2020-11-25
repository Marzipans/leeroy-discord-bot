import channel from '../../internal/channel.js'
import colors from '../../internal/colors.js'
import event from '../../internal/event.js'
import groups from '../../internal/groups.js'
import P from '../../internal/permissions.js'
import { register } from '../../internal/register.js'
import { path } from '../../utils/object.js'
import reference from '../../utils/reference.js'
import { error, message } from '../../utils/response.js'
import { verifyRolePosition } from '../../utils/role.js'
import features from '../index.js'
import { man } from '../settings/man.js'

register('likerole', channel.text, event.onReaction)

export default {
    name: 'likerole',
    group: groups.management,
    description: 'likerole.description',
    usage: 'likerole [@role] [description]',
    examples: 'likerole.examples',
    arguments: 2,
    emojis: ['👌'],
    permissions: [P.MANAGE_ROLES],

    execute: async (context, snowflake, description) => {
        if (!snowflake) return man(context, 'likerole')
        
        const role = await context.guild.roles.fetch(reference(snowflake))
        if (!role) {
            return error({
                context: context,
                description: context.t('role.role_not_found', { role: snowflake })
            })
        }
        if (!(await verifyRolePosition(context, context.member, role))) {
            return error({
                context: context,
                description: context.t('role.role_should_be_lower', { role: snowflake })
            })
        }
        return message({
            channel: context.channel,
            text: description,
            color: colors.highlightDefault,
            fields: [
                {
                    name: 'feature',
                    value: 'likerole',
                    inline: true
                },
                {
                    name: context.t('likerole.role'),
                    value: '' + snowflake,
                    inline: true
                },
                {
                    name: context.t('likerole.howto'),
                    value: '👌',
                    inline: true
                }
            ]
        })
        .then(message => message.react('👌'))
    },

    [event.onReaction]: async (context, user, reacted) => {
        const field = path(context.message, 'embeds[0].fields[0]')
        if (field.name !== 'feature') return
        const feature = features[field.value]
        if (!feature && feature.name !== 'likerole') return
        if (!feature.emojis.includes(context.emoji.name)) return
        
        const snowflake = context.message.embeds[0].fields[1].value
        const role = context.message.guild.roles.get(reference(snowflake))
        const member = context.guild.member(user)
        if (role && member) {
            await member.roles[reacted ? 'add' : 'remove'](role)
        }
    }
}