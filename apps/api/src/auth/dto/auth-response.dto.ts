import { UserRole } from '../common/enums/auth.enum';

export class AuthResponseDto {
  user_id!: string;
  email!: string;
  role!: UserRole;
  access_token!: string;
}