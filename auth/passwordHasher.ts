import crypto from "crypto"

export function generateSalt(){
    return crypto.randomBytes(16).toString("hex").normalize();
}

export function hashPassword(password: string, salt: string): Promise<string>{
return new Promise((resolve, reject) =>{
    crypto.scrypt(password.normalize(), salt, 64, (error, hash)=>{
        if(error) reject(error);
        resolve(hash.toString("hex").normalize());
    })
})
}

export async function comparePasswords({
    password,
    salt,
    hashedPassword
}:{
    password: string,
    salt: string,
    hashedPassword: string
}){
    const inputPassword = await hashPassword(password, salt);

    return crypto.timingSafeEqual(
        Buffer.from(inputPassword, "hex"),
        Buffer.from(hashedPassword, "hex")
    )
}