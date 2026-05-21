import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from '../common/enums/auth.enum';

export class AddressDto {
  @IsNotEmpty({ message: 'CEP é obrigatório' })
  @IsString()
  cep!: string;

  @IsNotEmpty()
  @IsString()
  logradouro!: string;

  @IsNotEmpty()
  @IsString()
  numero!: string;

  @IsNotEmpty()
  @IsString()
  bairro!: string;

  @IsNotEmpty()
  @IsString()
  cidade!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  uf!: string;

  @IsOptional()
  @IsString()
  complemento?: string;
}

export class RegisterRequestDto {
  @IsEmail({}, { message: 'E-mail inválido' })
  email!: string;

  @IsString()
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  password!: string;

  @IsString()
  passwordConfirm!: string;

  @IsEnum(UserRole)
  role!: UserRole;

  // Campos específicos de Freela
  @IsOptional() @IsString() nome?: string;
  @IsOptional() @IsString() cpf?: string;
  @IsOptional() @IsString() bio?: string;
  @IsOptional() @IsString() nivel?: string;
  @IsOptional() @IsBoolean() disponivel?: boolean;
  @IsOptional() @IsString() linkedinUrl?: string;
  @IsOptional() @IsString() githubUrl?: string;

  // Campos específicos de Empresa
  @IsOptional() @IsString() razaoSocial?: string;
  @IsOptional() @IsString() nomeFantasia?: string;
  @IsOptional() @IsString() cnpj?: string;
  @IsOptional() @IsString() sobre?: string;
  @IsOptional() @IsString() siteUrl?: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AddressDto)
  address!: AddressDto;
}