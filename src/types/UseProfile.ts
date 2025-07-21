import { User } from './User';

interface UseProfile {
  user: User | null;
  loading: boolean;
  error: string | null;
  handleImageChange: (newImageUri: string) => Promise<void>;
  getUser: () => Promise<User | null>;
}

export default UseProfile;