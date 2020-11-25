import groups from '../../internal/groups.js'
import P from '../../internal/permissions.js'
import { man } from './man.js'
import { Server, PREFIX } from '../../internal/config.js'
import { success, error } from '../../utils/response.js'

const MAX_LENGTH = 5

export default {
    name: 'prefix',
    group: groups.settings,
    description: 'prefix.description',
    usage: 'prefix [new prefix]',
    examples: 'prefix.examples',
    arguments: 1,
    permissions: [P.ADMINISTRATOR],

    execute: async (context, prefix) => {
        if (!prefix) {
            return man(context, 'prefix')

        } else if (prefix.length > MAX_LENGTH) {
            return error({
                context: context,
                description: context.t('prefix.max_length_exceeded', { length: MAX_LENGTH })
            })

        } else {
            const config = await Server.config(context)
            config.prefix = prefix === 'reset' ? PREFIX : prefix
            await Server.save(context, config)

            return success({
                context: context,
                description: context.t('prefix.new_prefix', { prefix: config.prefix })
            })
        }
    }
}