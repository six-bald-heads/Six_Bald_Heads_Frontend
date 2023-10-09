import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import MainPage from './pages/MainPage';
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import PrivateRoute from "./components/PrivateRoute";
import SnackbarPage from "./pages/SnackbarPage";

import {AuthProvider} from "./context/AuthProvider";
import {SnackbarProvider} from "./context/SnackbarContext";

const App: React.FC = () => {
    return (
        <AuthProvider>
            <SnackbarProvider>
                <Router>
                    <Routes>
                        <Route path="/login" element={<PrivateRoute element={<LoginPage/>} redirectTo="/" isReverse/>}/>
                        <Route path="/" element={<PrivateRoute element={<MainPage/>} redirectTo="/login"/>}/>
                        <Route path="/signup"
                               element={<PrivateRoute element={<SignupPage/>} redirectTo="/" isReverse/>}/>
                        <Route path="/snackbar" element={<SnackbarPage/>}/>
                    </Routes>
                </Router>
            </SnackbarProvider>
        </AuthProvider>
    );
}


export default App;