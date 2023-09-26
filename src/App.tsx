import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import MainPage from './pages/MainPage';
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";


const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage/>}/> {/* 로그인 되었을 때 여기로 접속되면 안되니까 guard*/}
                <Route path="/" element={<MainPage/>}></Route> {/* url 은 small character, 로그인 안되었을 때 여기로 접속되면 안되니까 guard*/}
                <Route path="/signup" element={<SignupPage/>}></Route> {/* 로그인 되었을 때 여기로 접속되면 안되니까 guard*/}
                {/* 랜딩 페이지도 추천! 랜딩 페이지가 있다면 이것이 root path! guard 필요없음*/}
            </Routes>
        </Router>
    );
}

export default App;