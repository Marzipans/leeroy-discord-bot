import features from "../features/index.js"
import { isRunning } from "../features/settings/pause.js"
import channel from "../internal/channel.js"
import { Server } from "../internal/config.js"
import event from "../internal/event.js"
import { handlers } from "../internal/register.js"
import { log } from "../utils/response.js"

export default async function(previous, current) {
    await Server.language(previous).then(t => {
        previous.t = t
        current.t = t
    })
    
    handlers()
        .filter(handler => handler.channel === channel.voice)
        .forEach(handler => {
            if (isRunning() || features[handler.feature].unstoppable) {
                _handleMovement(handler, previous, current).catch(error => log(previous, error))
            }
        })
}

async function _handleMovement(handler, previous, current) {
    if (previous.voiceChannelID === current.voiceChannelID) return
    if (![event.onJoinVoice, event.onLeaveVoice].includes(handler.event)) return

    const member = handler.event === event.onJoinVoice ? current : previous
    if (member.voiceChannelID) {
        await features[handler.feature][handler.event](member)
    }
}