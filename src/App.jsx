import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import TransactionList from './components/transactions/TransactionList';
import UserList from './components/users/UserList';
import Settings from './components/settings/Settings';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          autoHideDuration={3000}
        >
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/transactions" element={<TransactionList />} />
                      <Route
                        path="/users"
                        element={
                          <ProtectedRoute adminOnly>
                            <UserList />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/settings"
                        element={
                          <ProtectedRoute adminOnly>
                            <Settings />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </SnackbarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;