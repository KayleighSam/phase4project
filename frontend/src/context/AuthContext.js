import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [adminData, setAdminData] = useState(() => {
    const savedAdmin = localStorage.getItem('admin');
    return savedAdmin ? JSON.parse(savedAdmin) : null;
  });
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Login function for both users and admins
  const login = (data, token) => {
    setToken(token);
    localStorage.setItem('token', token);

    if (data.role === 'admin') {
      setAdminData(data);
      localStorage.setItem('admin', JSON.stringify(data));  // Save admin data
    } else {
      setUserData(data);
      localStorage.setItem('user', JSON.stringify(data));  // Save user data
    }
  };

  // Logout function
  const logout = () => {
    setUserData(null);
    setAdminData(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('admin');
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    
    // If there's no token, there's no need to fetch user data
    if (!storedToken) {
      return;
    }

    // Decode the token and check if it's expired
    const tokenPayload = JSON.parse(atob(storedToken.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    if (tokenPayload.exp < currentTime) {
      logout();
      return;
    }

    // Fetch user data if token is valid
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/user', {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.role === 'admin') {
            setAdminData(data);
            localStorage.setItem('admin', JSON.stringify(data));
          } else {
            setUserData(data);
            localStorage.setItem('user', JSON.stringify(data));
          }
        } else {
          logout();
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        logout();
      }
    };

    fetchUserData();
  }, [token]);

  return (
    <AuthContext.Provider value={{ userData, adminData, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
