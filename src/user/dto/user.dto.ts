import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class UserDto {
    name: string;
    phone: string;
    address: string;
    personalInformation: string;
}