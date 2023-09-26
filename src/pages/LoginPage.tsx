import React, {useState} from 'react';
import styled from 'styled-components';
import axios, {AxiosError} from 'axios';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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
            } else if (response.status === 400) {
                console.error('이메일이나 비밀번호가 올바르지 않습니다. : ', response.data.message);
            } else {
                console.error('예상치 못한 문제가 발생했어요! : ', response.status, response.data);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                console.error('네트워크 혹은 서버 에러입니다. : ', axiosError.response ? axiosError.response.data : axiosError.message);
            } else {
                console.error('예상치 못한 문제가 발생했어요! : ', error);
            }
        }
    };

    const handleSignup = () => {
        // 회원가입 페이지로 이동 또는 회원가입 로직
        console.log('Navigating to signup page');
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
  width: 100vw;
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

  @media (max-width: 2000px) {
    width: 55%;
  }

  @media (max-width: 1700px) {
    width: 60%;
  }

  @media (max-width: 1400px) {
    width: 65%;
  }

  @media (max-width: 1080px) {
    width: 70%;
  }

  @media (max-width: 670px) {
    width: 80%;
  }
`;


const Title = styled.h1`
  color: #CED0D9;
  font-size: 72px;

  @media (max-width: 2000px) {
    font-size: 64px;
  }

  @media (max-width: 1700px) {
    font-size: 56px;
  }

  @media (max-width: 1400px) {
    font-size: 48px;
  }

  @media (max-width: 1080px) {
    font-size: 40px;
  }

  @media (max-width: 670px) {
    font-size: 36px;
  }
`;


const Input = styled.input`
  width: 50%;
  padding: 10px;
  box-shadow: 0 0 0 3px #CED0D9;
  outline: none;
  border: none;
  border-radius: 4px;
  font-size: 30px;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px #6D9AE3;
  }

  @media (max-width: 2000px) {
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
  }
`;

const Button = styled.button`
  width: 15%;
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

  @media (max-width: 1080px) {
    width: 20%;
  }

  @media (max-width: 670px) {
    width: 25%;
  }
`;

export default LoginPage;
