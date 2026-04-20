import { useAuthStore } from './store';
import Auth from './pages/Auth';
import Home from './pages/Home';

export default function App() {
  const token = useAuthStore((s) => s.token);
  return token ? <Home /> : <Auth />;
}
