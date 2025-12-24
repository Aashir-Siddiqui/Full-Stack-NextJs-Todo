import { AuthProvider } from "./components/AuthContext";
import TodoAppAuth from "./components/TodoAppAuth";

export default function Home() {
  return (
    <AuthProvider>
      <TodoAppAuth />
    </AuthProvider>
  );
}
