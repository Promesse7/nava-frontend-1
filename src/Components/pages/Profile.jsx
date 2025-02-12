

const AdminDashboard = () => {
  const [userRoles, setUserRoles] = useState([]);

  useEffect(() => {
    const fetchUserRoles = async (user) => {
      if (user) {
        try {
          const tokenResult = await getIdTokenResult(user);
          setUserRoles(tokenResult.claims.roles || []);
        } catch (error) {
          console.error("Error fetching user roles:", error);
        }
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      fetchUserRoles(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <ul>
        {userRoles.map((role, index) => (
          <li key={index}>{role}</li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
