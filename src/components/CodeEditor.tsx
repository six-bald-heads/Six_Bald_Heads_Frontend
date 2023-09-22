import React from 'react';
import styled from 'styled-components';
import CodeMirror from '@uiw/react-codemirror';
import { EditorView } from '@codemirror/view';
import {javascript} from '@codemirror/lang-javascript';


const CodeEditor: React.FC = () => {
    const [value, setValue] = React.useState("console.log('hello world!');");

    const onChange = (val: string) => {
        setValue(val);
    };

    return (
        <EditorContainer>
            <EditorWrapper>
                <CodeMirror
                    className="cm-outer-container"
                    value={value}
                    height="100%"
                    width="100%"
                    extensions={[javascript({jsx: true}), EditorView.lineWrapping]}
                    theme={'dark'}
                    onChange={onChange}
                />
            </EditorWrapper>
        </EditorContainer>
    );
}

const EditorContainer = styled.div`
  height: 100%;
  width: 100%;
  background-color: #141617;
  flex: 2;
  box-sizing: border-box;
  padding: 20px;
  color: #CED0D9;
`;

const EditorWrapper = styled.div`
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  
`;

export default CodeEditor;