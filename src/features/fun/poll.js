import groups from '../../internal/groups'
import colors from '../../internal/colors'
import man from '../settings/man'
import { Server } from '../../internal/config'

export default {
    name: 'poll',
    group: groups.fun,
    description: 'poll.description',
    usage: 'poll [your message]',
    examples: 'poll Am I the best bot?',
    arguments: 1,
    reaction: true,
    emojis: ['👍', '👎'],

    handle: async (msg, question) => {
        if (!question) {
            man.handle(msg, 'poll')

        } else {
            const t = await Server.language(msg.guild)
            const embed = {
                embed: {
                    color: colors.highlightDefault,
                    fields: [
                        {
                            name: 'feature',
                            value: 'poll',
                            inline: true
                        },
                        {
                            name: t('poll.reactions'),
                            value: t('poll.yesno'),
                            inline: true
                        }
                    ]
                }
            }

            msg.channel.send(`@here ${question}`, embed)
                .then(message => message.react('👍').then(() => message))
                .then(message => message.react('👎'))
        }
    },

    react: async (msg, emoji, author, reacted) => {}
}