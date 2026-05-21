import { UserRole } from '../common/enums/auth.enum';

export class MeResponseDto {
  id!: string;
  email!: string;
  role!: UserRole;
  nome!: string;
  status!: string;
}