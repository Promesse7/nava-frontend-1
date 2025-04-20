import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          const role = userDoc.exists() ? userDoc.data().role : "user";

          setUser(currentUser);
          setUserRole(role);
          localStorage.setItem("auth", "true");
          localStorage.setItem("role", role);
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      } else {
        setUser(null);
        setUserRole(null);
        localStorage.removeItem("auth");
        localStorage.removeItem("role");
        
        const protectedRoutes = ["/dashboard", "/profile", "/settings"];
        if (protectedRoutes.includes(location.pathname)) {
          navigate("/login");
        }
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [db, navigate]);

  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userRole, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
