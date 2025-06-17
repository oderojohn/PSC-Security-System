import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Logo from './components/Logo';
import './App.css';

import { useAuth } from './service/auth/AuthContext';

// Page Components
import Dashboard from './components/pages/Dashboard';
import ReportsDashboard from './components/Reports/Reports';
import TopNavbar from './components/TopNavbar';
import PackageDashboard from './components/Dropped Packages/PackageDashboard';
import PhoneExtensionsDashboard from './components/PhoneExtensions/PhoneExtensionsDashboard';
import Login from './components/login/login';

import "./assets/css/LostItemsDashboard.css";

// Private route component
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <div className="app">
        {isAuthenticated && (
          <>
            <Logo />
            <TopNavbar />
            <Sidebar />
          </>
        )}

        <div className={`main-content ${!isAuthenticated ? 'full-width' : ''}`}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/dropped-packages" element={<PrivateRoute><PackageDashboard /></PrivateRoute>} />
            <Route path="/ReportsDashboard" element={<PrivateRoute><ReportsDashboard /></PrivateRoute>} />
            <Route path="/PhoneExtensionsDashboard" element={<PrivateRoute><PhoneExtensionsDashboard /></PrivateRoute>} />

            {/* Uncomment these routes only when their components are implemented */}
            {/*
              <Route path="/lost-found" element={<LostItemsDashboard />} />
              <Route path="/lost-found/report-lost" element={<ReportLostForm onSubmit={() => {}} />} />
              <Route path="/lost-found/report-found" element={<ReportFoundForm onSubmit={() => {}} />} />
              <Route path="/lost-found/item-details/:id" element={<ItemDetailsForm onPickup={() => {}} />} />
              <Route path="/events" element={<PrivateRoute><EventsDashboard /></PrivateRoute>} />
              <Route path="/AnnouncementsDashboard" element={<PrivateRoute><AnnouncementsDashboard /></PrivateRoute>} />
              <Route path="/ClampingDashboard" element={<PrivateRoute><ClampingDashboard /></PrivateRoute>} />
              <Route path="/SecurityControlDashboard" element={<PrivateRoute><SecurityControlDashboard /></PrivateRoute>} />
              <Route path="/ReportIssue" element={<PrivateRoute><ReportIssue /></PrivateRoute>} />
            */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
