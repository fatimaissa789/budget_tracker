import { Currencies } from "@/lib/devise";
import {z} from "zod";


export const UpdateUserCurrencySchema =  z.object({
    currency: z.custom(value => {
        const found = Currencies.some(c=> c.value ===
            value);
            if(!found){
                throw new Error (`Invalide devise:${value}`)
            }
            return value
    })
})