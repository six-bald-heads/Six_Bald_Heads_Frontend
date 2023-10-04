import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import MainPage from './pages/MainPage';
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import PrivateRoute from "./components/PrivateRoute";
import {AuthProvider} from "./context/AuthProvider.tsx";


const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<PrivateRoute element={<LoginPage />} redirectTo="/" isReverse />} />
                    <Route path="/" element={<PrivateRoute element={<MainPage />} redirectTo="/login" />} />
                    <Route path="/signup" element={<PrivateRoute element={<SignupPage />} redirectTo="/" isReverse />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}



export default App;