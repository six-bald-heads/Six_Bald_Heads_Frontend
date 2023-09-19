import React from 'react';
import styled from 'styled-components';
import { Tree } from 'antd';
import 'antd/dist/antd.css';

const FileDirectory: React.FC = () => {
    return (
        <DirectoryContainer>
            파일관리 컴포넌트
            {/* console.log("지히님 최고") */}
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
