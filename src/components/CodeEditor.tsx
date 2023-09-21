import React from 'react';
import styled from 'styled-components';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

const CodeEditor: React.FC = () => {
    const [value, setValue] = React.useState("console.log('hello world!');");

    const onChange = (val: string) => {
        setValue(val);
    };

    return (
        <EditorContainer>
            <CodeMirror
                value={value}
                height="100%"
                width="100%"
                extensions={[javascript({ jsx: true })]}
                onChange={onChange}
            />
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
