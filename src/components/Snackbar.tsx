import React from 'react';
import styled, { keyframes, css } from 'styled-components';

interface SnackbarProps {
    showSnackbar: boolean;
    message: string;
}

const Snackbar: React.FC<SnackbarProps> = ({ showSnackbar, message }) => {
    if (!showSnackbar) {
        return null;
    }

    let backgroundColor = '';
    let displayMessage = '';

    switch (message) {
        case 'success':
            backgroundColor = 'rgba(16, 185, 129, 0.75)';
            displayMessage = '항목을 추가했어요!';
            break;
        case 'edit':
            backgroundColor = 'rgba(59, 130, 246, 0.75)';
            displayMessage = '항목을 수정했어요!';
            break;
        case 'error':
            backgroundColor = 'rgba(239, 68, 68, 0.75)';
            displayMessage = '값을 입력해주세요!';
            break;
        case 'delete':
            backgroundColor = 'rgba(107, 114, 128, 0.75)';
            displayMessage = '항목을 삭제했어요!';
            break;
        default:
            break;
    }


    return (
        <SnackbarContainer showSnackbar={showSnackbar} backgroundColor={backgroundColor}>
            {displayMessage}
        </SnackbarContainer>
    );
}

const slideIn = keyframes`
    from {
        right: -12.5em;
    }
    to {
        right: 1.25em;
    }
`;

interface SnackbarContainerProps {
    showSnackbar: boolean;
    backgroundColor: string;
}

const SnackbarContainer = styled.div<SnackbarContainerProps>`
    position: fixed;
    right: 1.25em;
    top: 1.25em;
    padding: 0.625em;
    color: white;
    border-radius: 0.625em;
    opacity: 0;
    visibility: hidden;
    transition: visibility 0s 0.5s, opacity 0.5s ease-in-out;

    ${props => props.showSnackbar && css`
        animation: ${slideIn} 0.3s forwards;
        opacity: 1;
        visibility: visible;
    `}

    background-color: ${props => props.backgroundColor};
`;

export default Snackbar;
