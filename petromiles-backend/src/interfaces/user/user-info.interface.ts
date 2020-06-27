import { UserDetails } from '@/entities/user-details.entity';
import { Role } from '@/enums/role.enum';

export interface UserInfo {
  email: string;
  userDetails: UserDetails;
  role: Role;
  id: number;
  federated: boolean;
}
