export interface CreateUserInterface {
  fullName: string;
  email: string;
  password: string;
}

export interface UserDetailsInterface {
  id: string;
  fullName: string;
  email: string;
  password: string;
  createdAt: Date;
  deletedAt: Date | null;
}
