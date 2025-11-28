import { Role } from '@/app/config/constants';

export type UserBase = {
  id: string;
  email: string;
  name?: string;
  fullName?: string;
  username?: string;
  avatar?: string;
  role: Role;
};

export type OrgId = string;
