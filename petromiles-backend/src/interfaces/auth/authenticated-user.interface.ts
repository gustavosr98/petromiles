import { Role } from '@/enums/role.enum';

export interface AuthenticatedUser {
  email: string;
  id: number;
  role: Role;
}
