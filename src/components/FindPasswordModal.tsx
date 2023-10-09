import React, {useState} from 'react';
import styled, {css} from 'styled-components';
import axios, { AxiosError } from 'axios';
import { useSnackbar } from '../hooks/useSnackbar';


const emailRegex = new RegExp(
    '^[\\w!#$%&\'+/=?`{|}~^-]+(?:\\.[\\w!#$%&\'+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$'
);

const FindPasswordModal: React.FC<{ onClose: () => void }> = ({onClose}) => {
    const [email, setEmail] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(true);  // 이메일 유효성 상태

    const [serverError, setServerError] = useState<string | null>(null);

    const { displaySnackbar } = useSnackbar();

    interface ErrorResponse {
        message: string;
    }

    const handleSend = async () => {
        if (emailRegex.test(email)) {
            setIsEmailValid(true);
            const url = 'http://ec2-3-34-131-210.ap-northeast-2.compute.amazonaws.com:8080/api/v1/auth/findpassword';
            const data = {
                email
            };

            try {
                const response = await axios.post(url, data);
                if (response.status === 200) {
                    console.log('임시 비밀번호 전송 성공! : ', response.data);
                    setServerError(null);

                    displaySnackbar('가입한 이메일로 임시 비밀번호를 전송했어요!', 'success');
                    onClose();
                } else {
                    console.error('예상치 못한 문제가 발생했어요! : ', response.status, response.data);
                    setServerError('예상치 못한 문제가 발생했습니다.');
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    const axiosError = error as AxiosError;
                    if (axiosError.response) {
                        if (axiosError.response.status === 404) {
                            setServerError('존재하지 않는 사용자입니다.');
                        } else if (axiosError.response.status === 400) {
                            const errorResponse = axiosError.response.data as ErrorResponse;
                            console.error('이메일이 올바르지 않습니다. : ', errorResponse.message);
                            setServerError('이메일이 올바르지 않습니다.');
                        } else {
                            console.error('네트워크 혹은 서버 에러입니다. : ', axiosError.response.data);
                            setServerError('네트워크 혹은 서버 에러입니다.');
                        }
                    } else {
                        console.error('네트워크 혹은 서버 에러입니다. : ', axiosError.message);
                        setServerError('네트워크 혹은 서버 에러입니다.');
                    }
                } else {
                    console.error('예상치 못한 문제가 발생했어요! : ', error);
                    setServerError('예상치 못한 문제가 발생했습니다.');
                }
            }
        } else {
            setIsEmailValid(false);
        }
    };


    return (
        <ModalWrapper>
            <ModalContent>
                <Input
                    type="email"
                    placeholder="이메일"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        if (!e.target.value) {
                            setIsEmailValid(true);
                            setServerError(null);
                        }
                    }}                />
                {email && !isEmailValid && <ErrorText>이메일 형식이 올바르지 않습니다.</ErrorText>}
                {email && serverError && <ErrorText>{serverError}</ErrorText>}
                <SendButton onClick={handleSend}
                            isDisabled={!email}
                            disabled={!email}>
                    임시 비밀번호 전송
                </SendButton>
                <CloseButton onClick={onClose}>닫기</CloseButton>
            </ModalContent>
        </ModalWrapper>
    );
};

const ModalWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: #222426;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  width: clamp(36px, 50vw, 300px);
  padding: 10px;
  box-shadow: 0 0 0 3px #CED0D9;
  outline: none;
  border: none;
  border-radius: 4px;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px #6D9AE3;
  }
`;

const DisabledButtonStyle = css`
  background-color: #CED0D9;
  cursor: not-allowed;
`;

interface ButtonProps {
    isDisabled?: boolean;
}

const SendButton = styled.button<ButtonProps>`
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #6D9AE3;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;

  ${(props) => props.isDisabled && DisabledButtonStyle}

  &:focus {
    outline: none;
  }

  &:hover {
    background-color: ${props => props.isDisabled ? '#CED0D9' : '#0056b3'};
  }
`;

const CloseButton = styled.button`
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: transparent;
  color: #6D9AE3;
  cursor: pointer;
  transition: background-color 0.2s;

  &:focus {
    outline: none;
  }

  &:hover {
    background-color: #6D9AE3;
    color: #ffffff;
  }
`;

const ErrorText = styled.p`
    color: red;
    font-size: 12px;
    margin-top: -5px;
  margin-bottom: 0;
`;


export default FindPasswordModal;
