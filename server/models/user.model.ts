export interface User {
  id: string;
  email: string;
  username: string | null;
  password?: string;
  created_at: Date;
  updated_at: Date;
}
