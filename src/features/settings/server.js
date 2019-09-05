import groups from '../../internal/groups'
import storage from '../../internal/storage'
import { PREFIX } from '../../internal/config'

const servers = {}

export async function obtain(guild) {
    return servers[guild.id]
        || await storage.obtain(guild.id, {
            id: guild.id,
            language: 'en',
            prefix: PREFIX
        })
}

export async function save(guild) {
    return await storage.save(guild.id, servers[guild.id])
}

export async function remove(guild) {
    return await storage.remove(guild.id).then(() => delete servers[guild.id])
}

export default {
    name: 'server',
    group: groups.settings,
    description: 'server.description',
    usage: 'n/a',
    examples: 'n/a',

    handle: async () => {}
}