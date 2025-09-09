import { z} from 'zod'

export const acceptingMsgSchema = z.object({
    uisAcceptingMsg : z.boolean()
})