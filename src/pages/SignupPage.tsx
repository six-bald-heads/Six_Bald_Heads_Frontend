import React, {useState} from 'react';
import styled from 'styled-components';
import {useNavigate} from 'react-router-dom';
import axios, {AxiosError} from 'axios';

const SignupPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSendVerificationCode = async () => {
        const url = 'http://ec2-3-34-131-210.ap-northeast-2.compute.amazonaws.com:8080/api/v1/auth/sendmail';
        const data = {
            email
        };

        try {
            const response = await axios.post(url, data);
            if (response.status === 200) {
                console.log('인증번호 전송 성공! : ', response.data);
                console.log(response);
            } else {
                console.error('예상치 못한 문제가 발생했어요! : ', response.status, response.data);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                if (axiosError.response) {
                    console.error('네트워크 혹은 서버 에러입니다. : ', axiosError.response.data);
                } else {
                    console.error('네트워크 혹은 서버 에러입니다. : ', axiosError.message);
                }
            } else {
                console.error('예상치 못한 문제가 발생했어요! : ', error);
            }
        }
    };


    const handleSignupSumit = () => {
        navigate('/');
    };

    return (
        <SignupContainer>
            <SignupWrapper>
                <Title>회원가입</Title>
                <EmailSection>
                    <Input
                        type="email"
                        placeholder="이메일"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <SendCodeButton onClick={handleSendVerificationCode}>인증번호 전송</SendCodeButton>
                </EmailSection>
                <Input
                    type="text"
                    placeholder="이메일 인증코드"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                />
                <Input
                    type="text"
                    placeholder="닉네임"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                />
                <Input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                    type="password"
                    placeholder="비밀번호 확인"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button onClick={handleSignupSumit}>가입하기</Button>
            </SignupWrapper>
        </SignupContainer>
    );
};

const SignupContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #141617;
`;

const SignupWrapper = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #141617;
  gap: 20px;
`;

const Title = styled.h1`
  color: #CED0D9;
  font-size: 72px;
`;

const EmailSection = styled.div`
    display: flex;
    gap: 10px;
`;

const SendCodeButton = styled.button`
    padding: 10px;
    border: none;
    border-radius: 4px;
    background-color: #007BFF;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #0056b3;
    }
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 16px;
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

export default SignupPage;
