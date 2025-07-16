export default function RequireAuth({ children }) {
    const token = localStorage.getItem('managerToken');
    if (!token) {
      return <Navigate to='/' replace />;
    }
    return children;
}
