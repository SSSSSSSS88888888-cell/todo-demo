import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { gql, useMutation, useLazyQuery } from '@apollo/client';
import { apolloClient } from '../lib/apollo';

const SIGNUP = gql`
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
      token
      user { id email name }
    }
  }
`;

const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user { id email name }
    }
  }
`;

const ME = gql`
  query Me {
    me { id email name }
  }
`;

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginMutation] = useMutation(LOGIN);
  const [signupMutation] = useMutation(SIGNUP);
  const [fetchMe] = useLazyQuery(ME);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchMe().then(({ data }) => {
        if (data?.me) setUser(data.me);
        setLoading(false);
      }).catch(() => {
        localStorage.removeItem('token');
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [fetchMe]);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await loginMutation({
      variables: { input: { email, password } },
    });
    localStorage.setItem('token', data.login.token);
    setUser(data.login.user);
  }, [loginMutation]);

  const signup = useCallback(async (email: string, password: string, name: string) => {
    const { data } = await signupMutation({
      variables: { input: { email, password, name } },
    });
    localStorage.setItem('token', data.signup.token);
    setUser(data.signup.user);
  }, [signupMutation]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    apolloClient.resetStore();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
