import React, {useState} from 'react';
import styled from 'styled-components';
import FileDirectory from '../components/FileDirectory';
import CodeEditor from '../components/CodeEditor';
import {Resizable} from 're-resizable';
import Success from "../components/Snackbar/Success.tsx";

const MainPage: React.FC = () => {
    const [showSnackbar, setShowSnackbar] = useState(false);  // 스낵바의 표시 여부를 관리하는 상태

    const handleShowSnackbar = () => {
        setShowSnackbar(true);
        setTimeout(() => {
            setShowSnackbar(false);
        }, 3000);  // 3초 후에 스낵바를 숨깁니다.
    };

    return (
        <MainContainer>
            <MainContent>
                <Resizable
                    defaultSize={{width: '20%', height: '100%'}}
                    minWidth={'10%'}
                    maxWidth={'50%'}
                    enable={{
                        top: false,
                        right: true,
                        bottom: false,
                        left: false,
                        topRight: false,
                        bottomRight: false,
                        bottomLeft: false,
                        topLeft: false,
                    }}
                    handleStyles={{
                        right: {
                            width: '15px',
                            height: '100%',
                            right: '0px',
                            backgroundColor: '#222426',
                        },
                    }}
                >
                    <FileDirectory />
                </Resizable>
                <CodeEditor />
            </MainContent>
            <ShowSnackbarButton onClick={handleShowSnackbar}>스낵바 보이기</ShowSnackbarButton>
            <Success showSnackbar={showSnackbar} message="success" />
        </MainContainer>
    );
}

const MainContainer = styled.div`
  background-color: #222426;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  height: 100vh;
  width: 100vw;
`;

const MainContent = styled.div`
  width: 100%;
  padding: 2%;
  display: flex;
`;

const ShowSnackbarButton = styled.button`
    position: fixed;
    bottom: 1.25em;
    left: 1.25em;
    padding: 0.625em 1em;
    background-color: #333;
    color: white;
    border: none;
    border-radius: 0.625em;
    cursor: pointer;

    &:hover {
        background-color: #555;
    }
`;


export default MainPage;
