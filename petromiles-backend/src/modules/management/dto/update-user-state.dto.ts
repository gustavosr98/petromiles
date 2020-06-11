import { IsOptional, IsNotEmpty } from 'class-validator';
import {StateName} from "@/enums/state.enum";
export class UpdateUserStateDTO {
    @IsOptional()
    state: StateName;

}
