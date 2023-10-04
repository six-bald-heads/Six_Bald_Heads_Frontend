import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import axios, {AxiosError} from 'axios';
import { useNavigate } from 'react-router-dom';

import backgroundImage from '../assets/bg-login.jpeg';
import logo from '../assets/logo.png'
import logofill from '../assets/logo-fill.png'
import FindPasswordModal from '../components/FindPasswordModal.tsx'

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isValidationPassed, setIsValidationPassed] = useState(false);
    const navigate = useNavigate();

    interface ErrorResponse {
        message: string;
    }

    useEffect(() => {
        // 이메일과 비밀번호의 유효성 검사
        if (email && password) {
            setIsValidationPassed(true);
        } else {
            setIsValidationPassed(false);
        }
    }, [email, password]);


    const handleLogin = async () => {
        const url = 'http://ec2-3-34-131-210.ap-northeast-2.compute.amazonaws.com:8080/api/v1/auth/login';
        const data = {
            email,
            password
        };

        try {
            const response = await axios.post(url, data);
            if (response.status === 200) {
                console.log('로그인 성공! : ', response.data);
                console.log(response);
                navigate('/');
            } else {
                console.error('예상치 못한 문제가 발생했어요! : ', response.status, response.data);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                if (axiosError.response && axiosError.response.status === 400) {
                    const errorResponse = axiosError.response.data as ErrorResponse;
                    console.error('이메일이나 비밀번호가 올바르지 않습니다. : ', errorResponse.message);
                } else {
                    console.error('네트워크 혹은 서버 에러입니다. : ', axiosError.response ? axiosError.response.data : axiosError.message);
                }
            } else {
                console.error('예상치 못한 문제가 발생했어요! : ', error);
            }
        }
    };

    const handleSignup = () => {
        navigate('/signup');
    };

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };


    return (
        <LoginContainer>
            <LoginWrapper>
                <Logo src={isValidationPassed ? logofill : logo}>
                </Logo>
                <Title>SBH IDE</Title>
                <Input
                    type="email"
                    placeholder="example@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button onClick={handleLogin}>로그인</Button>
                <Button onClick={handleSignup}>회원가입</Button>
                <FindPasswordButton onClick={handleOpenModal}>비밀번호를 잊으셨나요?</FindPasswordButton>
                {isModalOpen && <FindPasswordModal onClose={handleCloseModal} />}
            </LoginWrapper>
            <ImageHalf>
            </ImageHalf>
        </LoginContainer>
    );
};

const LoginContainer = styled.div`
  width: 100vw; // 모바일 환경 조심할 것: vw, vh, % 아이폰은 힘들다! 특히 safari vh 때문에!
  height: 100vh; 
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #141617;
`;

const Logo = styled.img`
  width: 30%;
`;

const LoginWrapper = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
  white-space: nowrap;
`;

const ImageHalf = styled.div`
  flex: 1;
  height: 100%;
  opacity: 0.3;
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: left center;
  display: none;
  border-radius: 3% 0 0 3%;

  @media (min-width: 768px) {
    display: flex;
  }
`;

const Title = styled.h1`
  color: #CED0D9;
  font-size: clamp(36px, 6vw, 50px);
`;

const Input = styled.input`
  width: clamp(36px, 50vw, 300px);
  padding: 10px;
  box-shadow: 0 0 0 3px #CED0D9;
  outline: none;
  border: none;
  border-radius: 4px;
  font-size: clamp(10px, 1vw, 15px);

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px #6D9AE3;
  }
`;

const Button = styled.button`
  width: clamp(36px, 50vw, 300px);
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #CED0D9;
  color: white;
  cursor: pointer;

  &:focus {
    outline: none;
  }

  &:hover {
    background-color: #6D9AE3;
  }
`;

const FindPasswordButton = styled.button`
  width: clamp(30px, 50vw, 200px);
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: transparent;
  color: #6D9AE3;
  cursor: pointer;

  &:focus {
    outline: none;
  }

  &:hover {
    color: #CED0D9;
  }
`;

export default LoginPage;
