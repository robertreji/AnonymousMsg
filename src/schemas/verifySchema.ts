import { z} from 'zod'

export const verifyCode = z.object({
    code :z.string().min(4,"code must be 6 characters !")
})