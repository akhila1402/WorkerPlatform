import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    token: localStorage.getItem('token') || null,
    userId: localStorage.getItem('userId') || null,
    email: localStorage.getItem('email') || null,
    role: localStorage.getItem('role') || null,
    profileCompleted: localStorage.getItem('profileCompleted') !== 'false',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial verification of stored authentication details
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const email = localStorage.getItem('email');
    let role = localStorage.getItem('role');
    const profileCompleted = localStorage.getItem('profileCompleted') !== 'false';

    if (role && role.startsWith('ROLE_')) {
      role = role.substring(5);
      localStorage.setItem('role', role);
    }

    if (token && userId && email && role) {
      setAuthState({ token, userId, email, role, profileCompleted });
    } else {
      // Clear incomplete details
      clearAuth();
    }
    setLoading(false);
  }, []);

  const login = (jwtResponse) => {
    let { token, id, email, role, profileCompleted } = jwtResponse;
    
    if (role && role.startsWith('ROLE_')) {
      role = role.substring(5);
    }

    if (profileCompleted === undefined || profileCompleted === null) {
      profileCompleted = true;
    }

    localStorage.setItem('token', token);
    localStorage.setItem('userId', id);
    localStorage.setItem('email', email);
    localStorage.setItem('role', role);
    localStorage.setItem('profileCompleted', profileCompleted.toString());

    setAuthState({
      token,
      userId: id,
      email,
      role,
      profileCompleted,
    });
  };

  const logout = () => {
    clearAuth();
  };

  const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    localStorage.removeItem('profileCompleted');

    setAuthState({
      token: null,
      userId: null,
      email: null,
      role: null,
      profileCompleted: true,
    });
  };

  const updateProfileCompleted = (completed) => {
    localStorage.setItem('profileCompleted', completed.toString());
    setAuthState((prev) => ({
      ...prev,
      profileCompleted: completed,
    }));
  };

  const isAuthenticated = !!authState.token;
  const isAdmin = authState.role === 'ADMIN';
  const isWorker = authState.role === 'WORKER';
  const isUser = authState.role === 'USER';

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        loading,
        login,
        logout,
        clearAuth,
        updateProfileCompleted,
        isAuthenticated,
        isAdmin,
        isWorker,
        isUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
