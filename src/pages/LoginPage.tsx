import React, {useState} from 'react';
import styled from 'styled-components';
import axios, {AxiosError} from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    interface ErrorResponse {
        message: string;
    }

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

    return (
        <LoginContainer>
            <LoginWrapper>
                <Title>Six_bald_heads IDE</Title>
                <Input
                    type="email"
                    placeholder="이메일"
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
            </LoginWrapper>
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

const LoginWrapper = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #141617;
  gap: 20px;
  white-space: nowrap;
`;


const Title = styled.h1`
  color: #CED0D9;
  font-size: clamp(36px, 6vw, 70px);
`;


const Input = styled.input`
  width: 100%;
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

/*  @media (max-width: 2000px) {
    font-size: 25px;
    width: 45%;
  }

  @media (max-width: 1700px) {
    font-size: 20px;
    width: 40%;
  }

  @media (max-width: 1400px) {
    font-size: 15px;
    width: 40%;
  }

  @media (max-width: 1080px) {
    font-size: 15px;
    width: 40%;
  }

  @media (max-width: 670px) {
    font-size: 15px;
    width: 50%;
  }*/
`;

const Button = styled.button`
  /*
  width: 15%;
  */
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

  /*@media (max-width: 1080px) {
    width: 20%;
  }

  @media (max-width: 670px) {
    width: 25%;
  }*/
`;

export default LoginPage;
