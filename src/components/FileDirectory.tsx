import React from 'react';
import styled from 'styled-components';

const FileDirectory: React.FC = () => {
    return (
        <DirectoryContainer>
            파일관리 컴포넌트
            {/* 구현 내용 */}
        </DirectoryContainer>
    );
}

const DirectoryContainer = styled.div`
  height: 100%;
  background-color: #303336;
  flex: 1;
  box-sizing: border-box;
  padding: 20px;
  color: #CED0D9;
`;

export default FileDirectory;
