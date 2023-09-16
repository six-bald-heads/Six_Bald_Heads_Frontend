import React from 'react';
import styled from 'styled-components';

const CodeEditor: React.FC = () => {
    return (
        <EditorContainer>
            코드에디터 컴포넌트
            {/* 구현 내용 */}
        </EditorContainer>
    );
}

const EditorContainer = styled.div`
  height: 100%;
  background-color: #141617;
  flex: 2;
  box-sizing: border-box;
  padding: 20px;
  color: #CED0D9;
`;

export default CodeEditor;
