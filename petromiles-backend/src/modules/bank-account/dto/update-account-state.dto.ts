import { IsNotEmpty } from 'class-validator';
import {StateName} from "@/enums/state.enum";

export class UpdateAccountStateDto {
    @IsNotEmpty()
    idUserClient: number;

    @IsNotEmpty()
    idBankAccount: number;

    @IsNotEmpty()
    state: StateName;
}