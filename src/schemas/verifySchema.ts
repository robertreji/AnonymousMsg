import { z} from 'zod'

export const verifyCode = z.object({
    code :z.string().min(6,"code must be 6 characters !")
})