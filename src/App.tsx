import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import MainPage from './pages/MainPage.tsx';
import SnackbarPage from "./pages/SnackbarPage.tsx";

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPage/>}/>
                <Route path="/snackbar" element={<SnackbarPage/>}/>
            </Routes>
        </Router>
    );
}

export default App;
