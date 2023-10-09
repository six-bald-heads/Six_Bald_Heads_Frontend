import React from 'react';
import styled, { keyframes, css } from 'styled-components';

interface SnackbarProps {
    showSnackbar: boolean;
}

const Warning: React.FC<SnackbarProps> = ({ showSnackbar }) => {
    return (
        <SnackbarContainer showSnackbar={showSnackbar}>
            스낵바 메시지를 입력하세요!
        </SnackbarContainer>
    );
}

const slideIn = keyframes`
    from {
        right: -12.5rem;
    }
    to {
        right: 1.25rem;
    }
`;

const SnackbarContainer = styled.div<{ showSnackbar: boolean }>`
    position: fixed;
    right: 1.25em;
    top: 1.25em;
    padding: 0.625em;
    color: white;
    border-radius: 0.625em;
    background-color: rgba(255, 207, 63, 0.75);
    opacity: 0;
    visibility: hidden;
    transition: visibility 0s 0.5s, opacity 0.5s ease-in-out;

    ${props => props.showSnackbar && css`
        animation: ${slideIn} 0.3s forwards;
        opacity: 1;
        visibility: visible;
    `}
`;

export default Warning;
