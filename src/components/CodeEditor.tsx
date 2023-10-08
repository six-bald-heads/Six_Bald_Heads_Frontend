import React, { useState } from "react";
import styled from "styled-components";
import CodeMirror, { EditorView, keymap } from "@uiw/react-codemirror";
import { indentWithTab } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";

type Props = {
  content: string;
};

const CodeEditor: React.FC<Props> = ({ content }) => {
  const [value, setValue] = useState(content);
  const [fontSize, setFontSize] = useState(14);

  const onChange = (val: string) => {
    setValue(val);
  };

  const handleFontSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFontSize(Number(event.target.value));
  };

  const handleSave = async () => {
    const requestData = {
      path: "/src/bald",
      fileName: "bald.js",
      content: value,
    };

    try {
      const response = await fetch(
        "http://ec2-3-34-131-210.ap-northeast-2.compute.amazonaws.com:8080/api/v1/editor",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
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
        <SaveButton onClick={handleSave}>저장</SaveButton>
      </TopBar>
      <EditorWrapper fontSize={fontSize}>
        <CodeMirror
          className="cm-outer-container"
          value={value}
          height="100%"
          width="100%"
          extensions={[
            javascript({ jsx: true }),
            EditorView.lineWrapping,
            keymap.of([indentWithTab]),
          ]}
          theme={"dark"}
          onChange={onChange}
        />
      </EditorWrapper>
    </EditorContainer>
  );
};

const EditorContainer = styled.div`
  height: 100%;
  width: 100%;
  background-color: #141617;
  flex: 2;
  box-sizing: border-box;
  padding: 20px;
  color: #ced0d9;
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
  background-color: #6d9ae3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #ced0d9;
  }
`;

const EditorWrapper = styled.div<{ fontSize: number }>`
  height: calc(100% - 50px);
  width: 100%;
  box-sizing: border-box;
  overflow: scroll;

  .cm-outer-container {
    font-size: ${(props) => props.fontSize}px;
  }
`;

export default CodeEditor;
