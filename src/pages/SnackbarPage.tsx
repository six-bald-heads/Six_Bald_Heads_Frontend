import React, {useState} from 'react';
import styled from 'styled-components';
import Success from "../components/Snackbar/Success.tsx";
/*import Error from "../components/Snackbar/Error.tsx"
import Warning from "../components/Snackbar/Warning.tsx";
import Info from "../components/Snackbar/Info.tsx";*/


const SnackbarPage: React.FC = () => {
    const [showSnackbar, setShowSnackbar] = useState(false);

    const handleShowSnackbar = () => {
        setShowSnackbar(true);
        setTimeout(() => {
            setShowSnackbar(false);
        }, 3000);  // 3초 후에 스낵바 숨김
    };

    return (
        <MainContainer>
            <ShowSnackbarButton onClick={handleShowSnackbar}>스낵바 보이기</ShowSnackbarButton>
            <Success $showSnackbar={showSnackbar} message="여기에 원하는 메시지를 입력하세요!" />
            {/*<Error showSnackbar={showSnackbar} />
            <Warning showSnackbar={showSnackbar} />
            <Info showSnackbar={showSnackbar} />*/}

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

export default SnackbarPage;
