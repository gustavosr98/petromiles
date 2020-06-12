import { IsOptional, IsNotEmpty } from 'class-validator';
import {StateName} from "@/enums/state.enum";
import {Role} from "@/enums/role.enum";

export class UpdateUserStateDTO {
    @IsOptional()
    state: StateName;

    @IsNotEmpty()
    role: Role;

}
