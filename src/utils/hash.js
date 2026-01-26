import bcrypt from "bcrypt";

export const hashPassword = (plain) => bcrypt.hashSync(plain, bcrypt.genSaltSync(10));
export const comparePassword = (plain, hashed) => bcrypt.compareSync(plain, hashed);
