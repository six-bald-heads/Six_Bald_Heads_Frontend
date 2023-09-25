import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import MainPage from './pages/MainPage.tsx';
import LoginPage from "./pages/LoginPage";

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage/>}/>
                <Route path="/Main" element={<MainPage/>}></Route>

            </Routes>
        </Router>
    );
}

export default App;
