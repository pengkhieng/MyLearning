import { User } from './User';

interface UseProfileReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  handleImageChange: (newImageUri: string) => Promise<void>;
  getUser: () => Promise<User | null>;
}

export default UseProfileReturn;