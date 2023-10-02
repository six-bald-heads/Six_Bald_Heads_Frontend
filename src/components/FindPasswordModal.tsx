import React, {useState} from 'react';
import styled from 'styled-components';

const emailRegex = new RegExp(
    '^[\\w!#$%&\'+/=?`{|}~^-]+(?:\\.[\\w!#$%&\'+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$'
);

const FindPasswordModal: React.FC<{ onClose: () => void }> = ({onClose}) => {
    const [email, setEmail] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(true);  // 이메일 유효성 상태

    const handleSend = async () => {
        if (emailRegex.test(email)) {
            setIsEmailValid(true);
            console.log('요청을 보낸다! 메일을 보낸다!', email);
            onClose();
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
                    onChange={(e) => setEmail(e.target.value)}
                />
                {!isEmailValid && <ErrorText>이메일 형식이 올바르지 않습니다.</ErrorText>}
                <SendButton onClick={handleSend}>임시 비밀번호 전송</SendButton>
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
  font-size: clamp(10px, 1vw, 15px);

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px #6D9AE3;
  }
`;

const SendButton = styled.button`
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #6D9AE3;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: clamp(10px, 1vw, 15px);

  &:focus {
    outline: none;
  }

  &:hover {
    background-color: #0056b3;
  }
`;

const CloseButton = styled.button`
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: transparent;
  color: #6D9AE3;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: clamp(10px, 1vw, 15px);

  &:focus {
    outline: none;
  }

  &:hover {
    background-color: #6D9AE3;
    color: #ffffff;
  }
`;

const ErrorText = styled.span`
    color: red;
    font-size: 12px;
    margin-top: -5px;
`;


export default FindPasswordModal;
