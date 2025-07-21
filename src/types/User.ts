export interface User {
  id: string;
  username: string;
  email: string | null;
  profileImage: string | null;
  roles: string[];
}