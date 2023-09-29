import React, { useState, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';


type ButtonProps = {
    isDisabled: boolean;
};

const SignupPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [countdown, setCountdown] = useState<number | null>(null);
    const timerIdRef = useRef<number | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [nicknameError, setNicknameError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const emailRegex = new RegExp(
        '^[\\w!#$%&\'+/=?`{|}~^-]+(?:\\.[\\w!#$%&\'+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$'
    );
    const nicknameRegex = new RegExp('^[A-Za-z0-9가-힇]{4,10}$');
    const passwordRegex = new RegExp('^(?=.*[a-z])(?=.*[0-9]).{8,12}$');
    const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
    const [emailValid, setEmailValid] = useState<boolean | null>(null);
    const [nicknameValid, setNicknameValid] = useState<boolean | null>(null);


    const isEmailInvalid = !email || emailError !== null;
    const isNicknameInvalid = !nickname || nicknameError !== null;
    const isPasswordMismatch = password !== confirmPassword;
    const isFormIncomplete = !email || !nickname || !password || !confirmPassword;

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
                setEmailValid(true);
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

    const validateEmail = (email: string) => {
        if (email === '') {
            setEmailError(null);
        } else if (!emailRegex.test(email)) {
            setEmailError('유효하지 않은 이메일 주소입니다.');
        } else {
            setEmailError(null);
        }
    };

    const validateNickname = (nickname: string) => {
        if (nickname === '') {
            setNicknameError(null);
        } else if (!nicknameRegex.test(nickname)) {
            setNicknameError('닉네임은 4~10자의 영문자, 숫자, 한글로 구성되어야 합니다.');
        } else {
            setNicknameError(null);
        }
    };

    const validatePassword = (password: string) => {
        if (password === '') {
            setPasswordError(null);
        } else if (!passwordRegex.test(password)) {
            setPasswordError('비밀번호는 8~12자의 영문 소문자와 숫자로 구성되어야 합니다.');
        } else {
            setPasswordError(null);
        }
    };

    const validateConfirmPassword = (confirmPassword: string) => {
        if (confirmPassword === '') {
            setConfirmPasswordError(null);
        } else if (confirmPassword !== password) {
            setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
        } else {
            setConfirmPasswordError(null);
        }
    };

    useEffect(() => {
        validateEmail(email);
        validateNickname(nickname);
        validatePassword(password);
        validateConfirmPassword(confirmPassword);
    }, [email, nickname, password, confirmPassword]);

    const handleSignupSubmit = async () => {
        const url = 'http://ec2-3-34-131-210.ap-northeast-2.compute.amazonaws.com:8080/api/v1/auth/signup';
        const data = {
            email,
            password,
            nickname,
            emailValid: emailError === null && email !== '',  // 이메일 유효성 검사가 통과되었는지 확인
            nicknameValid: nicknameError === null && nickname !== ''  // 닉네임 유효성 검사가 통과되었는지 확인
        };

        try {
            const response = await axios.post(url, data);
            if (response.status === 200) {
                console.log('회원가입 성공! : ', response.data);
                navigate('/login');  // 회원가입 성공 시 로그인 페이지로 이동
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


    return (
        <SignupContainer>
            <SignupWrapper>
                <Title>회원가입</Title>
                <InputContainerWrapper>
                    <EmailSection>
                        <Input
                            type="email"
                            placeholder="이메일"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <SendCodeButton
                            onClick={handleSendVerificationCode}
                            isDisabled={isEmailInvalid}
                            disabled={isEmailInvalid}
                        >
                            인증번호 전송
                        </SendCodeButton>
                        {emailError && <ErrorText>{emailError}</ErrorText>}
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
                        <VerifyCodeButton
                            onClick={handleVerifyCode}
                            isDisabled={!verificationCode}
                            disabled={!verificationCode}
                        >
                            인증 확인
                        </VerifyCodeButton>
                    </VerificationSection>
                    <NicknameSection>
                        <Input
                            type="text"
                            placeholder="닉네임"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                        />
                        <CheckNicknameButton
                            onClick={handleCheckNickname}
                            isDisabled={isNicknameInvalid}
                            disabled={isNicknameInvalid}
                        >
                            중복 확인
                        </CheckNicknameButton>
                        {nicknameError && <ErrorText>{nicknameError}</ErrorText>}
                    </NicknameSection>
                    <Input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {passwordError && <ErrorText>{passwordError}</ErrorText>}
                    <Input
                        type="password"
                        placeholder="비밀번호 확인"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {confirmPasswordError && <ErrorText>{confirmPasswordError}</ErrorText>}
                </InputContainerWrapper>
                <SignupButton
                    onClick={handleSignupSubmit}
                    isDisabled={isFormIncomplete || isPasswordMismatch}
                    disabled={isFormIncomplete || isPasswordMismatch}
                >
                    가입하기
                </SignupButton>
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

const InputContainerWrapper = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 20px;
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

const SendCodeButton = styled.button<ButtonProps>`
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #6D9AE3;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
  ${(props) => props.isDisabled && DisabledButtonStyle}

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

const VerifyCodeButton = styled.button<ButtonProps>`
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #6D9AE3;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
  ${(props) => props.isDisabled && DisabledButtonStyle}

  &:hover {
    background-color: #0056b3;
  }
`;

const NicknameSection = styled.div`
  display: flex;
  gap: 10px;
`;

const CheckNicknameButton = styled.button<ButtonProps>`
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #6D9AE3;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
  ${(props) => props.isDisabled && DisabledButtonStyle}

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

const SignupButton = styled.button<ButtonProps>`
  width: 15%;
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #CED0D9;
  color: white;
  cursor: pointer;
  ${(props) => props.isDisabled && DisabledButtonStyle}

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

const ErrorText = styled.span`
  color: red;
  font-size: 12px;
  margin-top: 5px;
`;

const DisabledButtonStyle = css`
  background-color: #CED0D9;
  cursor: not-allowed;
`;

export default SignupPage;
