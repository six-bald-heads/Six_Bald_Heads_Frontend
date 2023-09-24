import React, {useState} from 'react';
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

    const handleSave = async () => {
        const requestData = {
            path: "your-path-here",
            fileName: "your-file-name-here",
            content: value
        };

        try {
            const response = await fetch('/api/v1/editor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }

            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
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
                <SaveButton onClick={handleSave}>Save</SaveButton>
            </TopBar>
            <EditorWrapper fontSize={fontSize}>
                <CodeMirror
                    className="cm-outer-container"
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
  display: flex;
  align-items: center;
`;

const FontSizeSelector = styled.select`
  padding: 5px;
  // background-color: #6D9AE3;
  // color: white;
`;

const SaveButton = styled.button`
  padding: 5px 10px;
  margin-left: 10px;
  background-color: #6D9AE3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #CED0D9;
  }
`;

const EditorWrapper = styled.div<{ fontSize: number }>`
  height: calc(100% - 50px);
  width: 100%;
  box-sizing: border-box;
  overflow: scroll;

  .cm-outer-container {
    font-size: ${props => props.fontSize}px;

    /* CodeMirror 컴포넌트의 스크롤바 스타일 */
    ::-webkit-scrollbar {
      width: 12px;
    }

    ::-webkit-scrollbar-track {
      background-color: transparent;
    }

    ::-webkit-scrollbar-thumb {
      background-color: #CED0D9;
      border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background-color: #b0b0b0;
    }
  }
`;

export default CodeEditor;
