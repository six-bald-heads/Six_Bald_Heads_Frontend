import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import {useNavigate} from 'react-router-dom';
import axios, {AxiosError} from 'axios';

const SignupPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [countdown, setCountdown] = useState<number | null>(null);
    const timerIdRef = useRef<number | null>(null);
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
                setCountdown(5 * 60);
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

    useEffect(() => {
        if (countdown !== null && countdown > 0) {
            const id = setInterval(() => {
                setCountdown(prev => (prev !== null ? prev - 1 : null));
            }, 1000);
            timerIdRef.current = id;
        } else if (timerIdRef.current !== null) {
            clearInterval(timerIdRef.current);
        }

        return () => {
            if (timerIdRef.current !== null) {
                clearInterval(timerIdRef.current);
            }
        };
    }, [countdown]);

    const formattedCountdown = countdown !== null ? `${Math.floor(countdown / 60)}:${countdown % 60 < 10 ? '0' : ''}${countdown % 60}` : '';

    const handleVerifyCode = async () => {
        const url = 'http://ec2-3-34-131-210.ap-northeast-2.compute.amazonaws.com:8080/api/v1/auth/emailcheck';
        const data = {
            email,
            code: verificationCode
        };

        try {
            const response = await axios.post(url, data);
            if (response.status === 200) {
                console.log('인증번호 확인 성공! : ', response.data);
                console.log(response);
                setCountdown(null);
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


    const handleCheckNickname = async () => {
        const url = 'http://ec2-3-34-131-210.ap-northeast-2.compute.amazonaws.com:8080/api/v1/auth/nickcheck';
        const data = {
            nickname
        };

        try {
            const response = await axios.post(url, data);
            if (response.status === 200) {
                console.log('닉네임 중복 확인 성공! : ', response.data);
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
        navigate('/login');
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
                <VerificationSection>
                    <InputContainer>
                        <Input
                            type="text"
                            placeholder="이메일 인증코드"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                        />
                        {countdown !== null && <CountdownSpan>{formattedCountdown}</CountdownSpan>}
                    </InputContainer>
                    <VerifyCodeButton onClick={handleVerifyCode}>인증 확인</VerifyCodeButton>
                </VerificationSection>
                <NicknameSection>
                    <Input
                        type="text"
                        placeholder="닉네임"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                    />
                    <CheckNicknameButton onClick={handleCheckNickname}>중복 확인</CheckNicknameButton>
                </NicknameSection>
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

const VerificationSection = styled.div`
    display: flex;
    gap: 10px;
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const CountdownSpan = styled.span`
  position: absolute;
  right: 10px;
  color: #6D9AE3;
`;

const VerifyCodeButton = styled.button`
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

const Countdown = styled.span`
    color: #6D9AE3;
`;

const NicknameSection = styled.div`
    display: flex;
    gap: 10px;
`;

const CheckNicknameButton = styled.button`
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
