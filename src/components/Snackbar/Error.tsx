import React from 'react';
import styled, {keyframes, css} from 'styled-components';

interface SnackbarProps {
    $showSnackbar: boolean;
    message: string;
}

const Error: React.FC<SnackbarProps> = ({$showSnackbar, message}) => {
    return (
        <SnackbarContainer $showSnackbar={$showSnackbar}>
            {message}
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

const SnackbarContainer = styled.div<{ $showSnackbar: boolean }>`
  position: fixed;
  right: 1.25em;
  top: 1.25em;
  padding: 0.625em;
  color: white;
  border-radius: 0.625em;
  background-color: rgba(255, 114, 114);
  opacity: 0;
  visibility: hidden;
  transition: visibility 0s 0.5s, opacity 0.5s ease-in-out;
  z-index: 999;

  ${props => props.$showSnackbar && css`
    animation: ${slideIn} 0.3s forwards;
    opacity: 1;
    visibility: visible;
  `}
`;

export default Error;
