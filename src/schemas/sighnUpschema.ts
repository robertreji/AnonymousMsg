import {z} from 'zod'

export const signUpSchema = z.object(
    {
        username : z.string().min(2,"minimum 4 characters is required !")
            .max(12,"max length is 12 characters !"),
        email : z.email(),
        Password : z.string().min(4,"min length is 4 characters ")
    }
)

