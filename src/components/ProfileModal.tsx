import React, {useEffect, useRef, useState} from 'react';
import {useAuth} from "../hooks/useAuth.ts"
import {useNavigate} from 'react-router-dom';
import styled, {css} from 'styled-components';
import {CloseOutlined, EditOutlined} from "@ant-design/icons";
import axios, {AxiosError} from "axios";
import DeleteAccountModal from "./DeleteAccountModal.tsx";
import { useSnackbar } from '../hooks/useSnackbar';


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
    const [password, setPassword] = useState('');

    const [nicknameValidationError, setNicknameValidationError] = useState<string | null>(null);
    const [nicknameValid, setNicknameValid] = useState<boolean>(false);

    const [passwordValidationError, setPasswordValidationError] = useState<string | null>(null);

    const {logout} = useAuth();
    const { displaySnackbar } = useSnackbar();
    const navigate = useNavigate();

    interface ErrorResponse {
        message: string;
    }

    const handleClose = () => {
        setIsModalOpen(false);
    };

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadButtonClick = () => {
        fileInputRef.current?.click();
    };

    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedImage(event.target.files[0]);
            await handleUploadImage();
        }
    };

    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        if (selectedImage) {
            const imageUrl = URL.createObjectURL(selectedImage);
            setPreviewImage(imageUrl);

            return () => URL.revokeObjectURL(imageUrl);
        }
    }, [selectedImage]);

    const handleUploadImage = async () => {
        if (!selectedImage) return;

        const uploadUrl = 'UPLOAD_URL_HERE';

        const formData = new FormData();
        formData.append('image', selectedImage);

        const accessToken = localStorage.getItem('accessToken');

        try {
            const uploadResponse = await axios.put(uploadUrl, formData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (uploadResponse.status === 200) {
                console.log('이미지 업로드 성공:', uploadResponse.data);
                const imageUrl = uploadResponse.data.imageUrl; // 서버에서 반환하는 실제 이미지 URL
                setPreviewImage(imageUrl);

                // 이미지 URL 을 사용하여 추가 요청 보내기
                const data = {
                    imageUrl: imageUrl
                };
                const updateUrl = 'http://ec2-3-34-131-210.ap-northeast-2.compute.amazonaws.com:8080/api/v1/auth/profile/image';
                const updateResponse = await axios.put(updateUrl, data, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                if (updateResponse.status === 200) {
                    console.log('이미지 URL 업데이트 성공:', updateResponse.data);
                } else {
                    console.error('이미지 URL 업데이트 실패:', updateResponse.status, updateResponse.data);
                }

            } else {
                console.error('예상치 못한 문제가 발생했어요! :', uploadResponse.status, uploadResponse.data);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                if (axiosError.response) {
                    console.error('네트워크 혹은 서버 에러입니다. :', axiosError.response.data);
                } else {
                    console.error('네트워크 혹은 서버 에러입니다. :', axiosError.message);
                }
            } else {
                console.error('예상치 못한 문제가 발생했어요! :', error);
            }
        }
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

                displaySnackbar('닉네임을 변경했어요!', 'success');
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

    const validatePassword = (password: string) => {
        if (password === '') {
            setPasswordValidationError(null);
        } else if (!passwordRegex.test(password)) {
            setPasswordValidationError('비밀번호는 8~12자의 영문 소문자와 숫자로 구성되어야 합니다.');
        } else {
            setPasswordValidationError(null);
        }
    };

    const handlePasswordChange = async () => {
        const url = 'http://ec2-3-34-131-210.ap-northeast-2.compute.amazonaws.com:8080/api/v1/auth/password';
        const data = {
            password
        };

        const accessToken = localStorage.getItem('accessToken');

        try {
            const response = await axios.put(url, data, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (response.status === 200) {
                console.log('비밀번호 변경 성공!');
            } else {
                console.error('예상치 못한 문제가 발생했어요! : ', response.status, response.data);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                if (axiosError.response && axiosError.response.status === 401) {
                    const errorResponse = axiosError.response.data as ErrorResponse;
                    console.error('기존 비밀번호와 일치합니다. : ', errorResponse.message);

                    displaySnackbar('기존 비밀번호와 일치합니다.', 'error');
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

                displaySnackbar("로그아웃 되었습니다.", 'success');
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
                    <ImgContainer>
                        <ProfileImg src={previewImage || '/src/assets/logo-square.png'} alt="Profile Preview"/>
                        <UploadButton onClick={handleUploadButtonClick}>
                            <EditOutlined/>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                style={{display: 'none'}}
                                onChange={handleImageChange}
                            />
                        </UploadButton>
                    </ImgContainer>
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
                            $isDisabled={!!nicknameValidationError || currentNickname === initialNickname || !currentNickname}
                            disabled={!!nicknameValidationError || currentNickname === initialNickname || !currentNickname}
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
                                validatePassword(e.target.value);
                            }}
                        />
                        <PasswordButton
                            onClick={handlePasswordChange}
                            $isDisabled={!!passwordValidationError || !password}
                            disabled={!!passwordValidationError || !password}>
                            비밀번호 변경
                        </PasswordButton>
                    </ModifyWrapper>
                    {passwordValidationError && <ErrorText>{passwordValidationError}</ErrorText>}
                    <Button onClick={handleLogout}>로그아웃</Button>
                    <DeleteAccountButton onClick={handleOpenModal}>회원탈퇴</DeleteAccountButton>
                    {isDeleteAccountModalOpen &&
                        <DeleteAccountModal setIsDeleteAccountModalOpen={setIsDeleteAccountModalOpen}/>}
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

const ImgContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProfileImg = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color:  #303336;
`;

const UploadButton = styled.button`
  position: absolute;
  right: -15px;
  bottom: 0;
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
