import { UserRole } from '../common/enums/auth.enum';

export class RegisterRequestDto {
  email!: string;
  password_text!: string;
  role!: UserRole;
  nome_ou_razao_social!: string;
  documento!: string; // CPF ou CNPJ
}