import React, {useState} from 'react';
import { useAuth } from "../hooks/useAuth.ts"
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {CloseOutlined, EditOutlined} from "@ant-design/icons";
import axios, {AxiosError} from "axios";

interface ProfileModalProps {
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ setIsModalOpen }) => {
    const initialNickname = localStorage.getItem('nickname') || '';
    const [currentNickname, setCurrentNickname] = useState(initialNickname);
    const [password, setPassword] = useState('');
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleClose = () => {
        setIsModalOpen(false);
    };

    const handleNicknameChange = () => {
        // 닉네임 변경 로직
    };

    const handlePasswordChange = () => {
        // 비밀번호 변경 로직
    };

    const handleDeleteAccount = () => {
        // 회원탈퇴 로직
    };

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
                            onChange={(e) => setCurrentNickname(e.target.value)}
                        />
                        <Button onClick={handleNicknameChange}>닉네임 변경</Button>
                    </ModifyWrapper>
                    <ModifyWrapper>
                        <Input
                            type="password"
                            placeholder="비밀번호 변경"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button onClick={handlePasswordChange}>비밀번호 변경</Button>
                    </ModifyWrapper>
                    <Button onClick={handleLogout}>로그아웃</Button>
                    <WithdrawButton onClick={handleDeleteAccount}>회원탈퇴</WithdrawButton>
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
  width: 50%;
  height: 80%;
  background-color: #CED0D9;
  border-radius: 10px;
  z-index: 1000;
`;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 20px;
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

const WithdrawButton = styled.button`
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

export default ProfileModal;
