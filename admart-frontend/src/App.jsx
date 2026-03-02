import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';
import Layout from './components/layout/Layout';
import AuthGuard from './components/common/AuthGuard';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Billboards from './pages/Billboards';
import Proposals from './pages/Proposals';
import CreateProposal from './pages/CreateProposal';
import ReceivedBids from './pages/ReceivedBids';
import MyBillboards from './pages/MyBillboards';
import CreateBillboard from './pages/CreateBillboard';
import MyBids from './pages/MyBids';

function App() {
  const { checkAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
        
        {/* Protected Routes */}
        <Route path="dashboard" element={
          <AuthGuard>
            <Dashboard />
          </AuthGuard>
        } />
        
        {/* Customer Routes */}
        <Route path="billboards" element={
          <AuthGuard allowedRoles={['CUSTOMER']}>
            <Billboards />
          </AuthGuard>
        } />
        
        <Route path="proposals" element={
          <AuthGuard allowedRoles={['CUSTOMER']}>
            <Proposals />
          </AuthGuard>
        } />
        
        <Route path="create-proposal" element={
          <AuthGuard allowedRoles={['CUSTOMER']}>
            <CreateProposal />
          </AuthGuard>
        } />
        
        <Route path="received-bids" element={
          <AuthGuard allowedRoles={['CUSTOMER']}>
            <ReceivedBids />
          </AuthGuard>
        } />

        {/* Billboard Owner Routes */}
        <Route path="my-billboards" element={
          <AuthGuard allowedRoles={['BILLBOARD_OWNER']}>
            <MyBillboards />
          </AuthGuard>
        } />
        
        <Route path="create-billboard" element={
          <AuthGuard allowedRoles={['BILLBOARD_OWNER']}>
            <CreateBillboard />
          </AuthGuard>
        } />
        
        <Route path="my-bids" element={
          <AuthGuard allowedRoles={['BILLBOARD_OWNER']}>
            <MyBids />
          </AuthGuard>
        } />
      </Route>
    </Routes>
  );
}

export default App;
