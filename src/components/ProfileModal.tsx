import React, {useState} from 'react';
import {useAuth} from "../hooks/useAuth.ts"
import {useNavigate} from 'react-router-dom';
import styled, {css} from 'styled-components';
import {CloseOutlined, EditOutlined} from "@ant-design/icons";
import axios, {AxiosError} from "axios";
import DeleteAccountModal from "./DeleteAccountModal.tsx";

const nicknameRegex = new RegExp('^[A-Za-z0-9가-힇]{4,10}$');
const passwordRegex = new RegExp('^(?=.*[a-z])(?=.*[0-9]).{8,12}$');

interface ProfileModalProps {
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

type ButtonProps = {
    $isDisabled: boolean;
};


const ProfileModal: React.FC<ProfileModalProps> = ({setIsModalOpen}) => {
    const [initialNickname, setInitialNickname] = useState(localStorage.getItem('nickname') || '');
    const [currentNickname, setCurrentNickname] = useState(initialNickname);

    const [nicknameValidationError, setNicknameValidationError] = useState<string | null>(null);
    const [nicknameValid, setNicknameValid] = useState<boolean>(false);
    const [isNicknameVerified, setIsNicknameVerified] = useState(false);

    const [password, setPassword] = useState('');

    const {logout} = useAuth();
    const navigate = useNavigate();

    const handleClose = () => {
        setIsModalOpen(false);
    };

    const validateNickname = (nickname: string) => {
        if (nickname === '') {
            setNicknameValidationError(null);
            setNicknameValid(false);
        } else if (!nicknameRegex.test(nickname)) {
            setNicknameValidationError('닉네임은 4~10자의 영문자, 숫자, 한글(음절)로 구성되어야 합니다.');
            setNicknameValid(false);
        } else if (nickname === initialNickname) {
            setNicknameValidationError('기존 닉네임과 동일합니다.');
            setNicknameValid(false);
        } else {
            setNicknameValidationError(null);
            setNicknameValid(true);
        }
    }

    const handleCheckNickname = async () => {
        const url = 'http://ec2-3-34-131-210.ap-northeast-2.compute.amazonaws.com:8080/api/v1/auth/nickcheck';
        const data = {
            nickname: currentNickname
        };

        try {
            const response = await axios.post(url, data);
            if (response.status === 200) {
                console.log(currentNickname);
                console.log('닉네임 중복 확인 성공! : ', data);
                console.log(response);
                setNicknameValid(true);
                setIsNicknameVerified(true);
            } else if (response.status === 400) {
                console.log("중복된 닉네임입니다.");
                setNicknameValid(false);
            } else {
                console.error('예상치 못한 문제가 발생했어요! : ', response.status, response.data);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                if (axiosError.response) {
                    if (axiosError.response.status === 400) {
                        console.log("중복된 닉네임입니다.");
                    } else {
                        console.error('네트워크 혹은 서버 에러입니다. : ', axiosError.response.data);
                    }
                } else {
                    console.error('네트워크 혹은 서버 에러입니다. : ', axiosError.message);
                }
            } else {
                console.error('예상치 못한 문제가 발생했어요! : ', error);
            }
        }
    };

    const handleNicknameChange = async () => {
        await handleCheckNickname();

        if (!nicknameValid) {
            console.log("NicknameValid 값이 false입니다.");
            return;
        }

        const url = 'http://ec2-3-34-131-210.ap-northeast-2.compute.amazonaws.com:8080/api/v1/auth/profile/nickname';
        const data = {
            nickname: currentNickname,
            nicknameValid
        };

        const accessToken = localStorage.getItem('accessToken');

        try {
            const response = await axios.put(url, data, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (response.status === 200) {
                localStorage.setItem('nickname', currentNickname);
                setInitialNickname(currentNickname);
                console.log('요청: ', data);
                console.log('응답: ', response);
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
    }

    const handleLogout = async () => {
        const url = 'http://ec2-3-34-131-210.ap-northeast-2.compute.amazonaws.com:8080/api/v1/auth/logout';

        try {
            const response = await axios.post(url);

            if (response.status === 200) {
                console.log('로그아웃 성공! : ', response.data);
                logout();
                navigate('/login');
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

    const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsDeleteAccountModalOpen(true);
    };

    return (
        <ModalWrapper>
            <ModalContainer>
                <ModalHeader>
                    <CloseButton onClick={handleClose}>
                        <CloseOutlined/>
                    </CloseButton>
                </ModalHeader>
                <ProfileContainer>
                    <UploadButton>
                        <EditOutlined/>
                    </UploadButton>
                    <ModifyWrapper>
                        <Input
                            type="text"
                            placeholder="닉네임 변경"
                            value={currentNickname}
                            onChange={(e) => {
                                setCurrentNickname(e.target.value);
                                validateNickname(e.target.value);
                            }}
                        />
                        <NicknameButton
                            onClick={handleNicknameChange}
                            $isDisabled={!!nicknameValidationError || currentNickname === initialNickname}
                            disabled={!!nicknameValidationError || currentNickname === initialNickname}
                        >
                            닉네임 변경
                        </NicknameButton>
                    </ModifyWrapper>
                    {nicknameValidationError && <ErrorText>{nicknameValidationError}</ErrorText>}
                    <ModifyWrapper>
                        <Input
                            type="password"
                            placeholder="비밀번호 변경"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                        />
                        <Button>
                            비밀번호 변경
                        </Button>
                    </ModifyWrapper>
                    <Button onClick={handleLogout}>로그아웃</Button>
                    <DeleteAccountButton onClick={handleOpenModal}>회원탈퇴</DeleteAccountButton>
                    {isDeleteAccountModalOpen && <DeleteAccountModal setIsDeleteAccountModalOpen={setIsDeleteAccountModalOpen} />}
                </ProfileContainer>
            </ModalContainer>
        </ModalWrapper>
    );
};

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: clamp(400px, 50vw, 600px);
  height: 80%;
  background-color: #CED0D9;
  border-radius: 10px;
  z-index: 1000;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 20px;
`;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px;
`;

const CloseButton = styled.button`
  background: none;
  border-radius: 50%;
  border: none;
  outline: none;
  font-size: 20px;
  cursor: pointer;
  color: #141617;
  left: 20px;

  &:focus {
    outline: none;
    border: none;
  }

  &:hover {
    color: #6d9ae3;
  }
`;

const UploadButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.7);
  color: #141617;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  outline: none;
  cursor: pointer;

  &:focus {
    outline: none;
  }

  &:active {
    outline: none;
    border: none;
  }

  &:hover {
    box-shadow: 0 0 0 3px #6D9AE3;
    transition: box-shadow 0.2s;

  }
`;

const ModifyWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const Input = styled.input`
  width: clamp(25px, 50vw, 200px);
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

const NicknameButton = styled.button<ButtonProps>`
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: ${props => props.$isDisabled ? '#CED0D9' : '#303336'};
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;

  ${props => props.$isDisabled && DisabledButtonStyle}
  &:focus {
    outline: none;
  }

  &:hover {
    background-color: ${props => props.$isDisabled ? 'transparent' : '#6d9ae3'};
  }
`;

const PasswordSection = styled.div`
  display: flex;
  gap: 10px;
`;

const PasswordButton = styled.button<ButtonProps>`
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: ${props => props.$isDisabled ? '#CED0D9' : '#303336'};
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;

  ${props => props.$isDisabled && DisabledButtonStyle}
  &:focus {
    outline: none;
  }

  &:hover {
    background-color: ${props => props.$isDisabled ? 'transparent' : '#6d9ae3'};
  }
`;

const Button = styled.button`
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #303336;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;

  &:focus {
    outline: none;
  }

  &:hover {
    background-color: #6d9ae3;
  }
`;

const DeleteAccountButton = styled.button`
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  color: #646060;
  transition: color 0.2s;

  &:focus {
    outline: none;
  }

  &:hover {
    color: #6d9ae3;
  }
`;

const ErrorText = styled.p`
  color: red;
  font-size: 12px;
  margin-top: -5px;
  margin-bottom: 0;
`;

const DisabledButtonStyle = css`
  background-color: #CED0D9;
  cursor: not-allowed;
`;


export default ProfileModal;
