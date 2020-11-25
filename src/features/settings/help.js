import groups from '../../internal/groups.js'
import colors from '../../internal/colors.js'
import { Server, VERSION } from '../../internal/config.js'
import { REQUIRED as REQUIRED_PERMISSIONS } from '../../internal/permissions.js'
import { message } from '../../utils/response.js'

export default {
    name: 'help',
    group: groups.settings,
    description: 'help.description',
    usage: 'help',
    examples: 'help.examples',
    permissions: [],
    stable: true,

    execute: async (context) => {
        const config = await Server.config(context)

        return message({
            channel: context.channel,
            color: colors.highlightDefault,
            fields: [
                {
                    name: context.t('help.version'),
                    value: VERSION
                },
                {
                    name: context.t('help.commands_list'),
                    value: 'man'
                },
                {
                    name: context.t('help.language'),
                    value: config.language
                },
                {
                    name: context.t('help.prefix'),
                    value: config.prefix
                },
                {
                    name: context.t('help.core_permissions'),
                    value: REQUIRED_PERMISSIONS.map(p => context.t(`permissions.${p}`)).join('\n')
                }
            ]
        })
    }
}