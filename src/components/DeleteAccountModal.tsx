import React, {useState} from 'react';
import styled, {css} from 'styled-components';
import axios, { AxiosError } from 'axios';
import {CloseOutlined} from "@ant-design/icons";

interface DeleteAccountModalProps {
    setIsDeleteAccountModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}


const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({setIsDeleteAccountModalOpen}) => {

    const handleClose = () => {
        setIsDeleteAccountModalOpen(false);
    };

    const handleDeleteAccount = async () => {
        const url = 'http://ec2-3-34-131-210.ap-northeast-2.compute.amazonaws.com:8080/api/v1/auth/profile';

        try {
            const response = await axios.delete(url);
            if (response.status === 200) {
                console.log('회원탈퇴 완료! ', response.data);
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

    return (
        <ModalWrapper>
            <ModalContainer>
                <ModalHeader>
                    <CloseButton onClick={handleClose}>
                        <CloseOutlined/>
                    </CloseButton>
                </ModalHeader>
                <DeleteAccountContainer>
                    <PlainText>정말 탈퇴하시겠습니까?</PlainText>
                    <PlainText>저장한 코드는 영구삭제되며, 복구할 수 없습니다.</PlainText>
                    <SelectContainer>
                        <SelectButton onClick={handleDeleteAccount}>예</SelectButton>
                        <SelectButton onClick={handleClose}>
                            아니오
                        </SelectButton>
                    </SelectContainer>

                </DeleteAccountContainer>
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
  width: 300px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #CED0D9;
  border-radius: 10px;
  padding: 20px;
  z-index: 1000;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const DeleteAccountContainer = styled.div`
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
  font-size: 15px;
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

const SelectContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-top: 20px;
`;

const SelectButton = styled.button`
  background: #303336;
  width: 5rem;
  border: none;
  outline: none;
  font-size: 15px;
  cursor: pointer;
  color: #FFFFFF;
  white-space: nowrap;
  transition: background-color 0.2s;
  
  &:focus {
    outline: none;
    border: none;
  }

  &:hover {
    background-color: #6d9ae3;
  }
`;

const PlainText = styled.p`
  color: #141617;
  font-size: 15px;
  margin-top: 0;
  margin-bottom: -5px;
  font-weight: bold;
`;


export default DeleteAccountModal;
