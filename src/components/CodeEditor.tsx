import React, { useState } from 'react';
import styled from 'styled-components';
import CodeMirror, {EditorView, keymap} from '@uiw/react-codemirror';
import {indentWithTab} from "@codemirror/commands"
import {javascript} from '@codemirror/lang-javascript';

const CodeEditor: React.FC = () => {
    const [value, setValue] = useState("console.log('hello world!');");
    const [fontSize, setFontSize] = useState(14);

    const onChange = (val: string) => {
        setValue(val);
    };

    const handleFontSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFontSize(Number(event.target.value));
    };


    return (
        <EditorContainer>
            <TopBar>
                <FontSizeSelector onChange={handleFontSizeChange}>
                    <option value="12">12px</option>
                    <option value="14">14px</option>
                    <option value="16">16px</option>
                    <option value="18">18px</option>
                    <option value="20">20px</option>
                </FontSizeSelector>
            </TopBar>
            <EditorWrapper fontSize={fontSize}>
                <CodeMirror
                    value={value}
                    height="100%"
                    width="100%"
                    extensions={[
                        javascript({jsx: true}),
                        EditorView.lineWrapping,
                        keymap.of([indentWithTab]),
                    ]}
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

const TopBar = styled.div`
  margin-bottom: 20px;
`;

const FontSizeSelector = styled.select`
    padding: 5px;
`;

const EditorWrapper = styled.div<{ fontSize: number }>`
  height: calc(100% - 50px);
  width: 100%;
  box-sizing: border-box;
  overflow: scroll;
  
  .cm-outer-container {
    font-size: ${props => props.fontSize}px;
  }
`;

export default CodeEditor;
