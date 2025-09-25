import { Role } from '@/app/config/constants';

export type UserBase = {
  id: string;
  email: string;
  name: string;
  role: Role;
};

export type OrgId = string;
