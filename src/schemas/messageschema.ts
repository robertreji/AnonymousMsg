import { z} from 'zod'

export const messagesSchema = z.object({
    content  : z.string().min(2).max(100,"max lenght of msg is 100 characters ")
})