import React, {useEffect, useState} from "react";
import styled from "styled-components";
import CodeMirror, {EditorView, keymap} from "@uiw/react-codemirror";
import {indentWithTab} from "@codemirror/commands";
import {javascript} from "@codemirror/lang-javascript";
import ProfileModal from "./ProfileModal";
import axios from 'axios';

import { useSnackbar } from '../hooks/useSnackbar';


type Props = {
    content: {
        data: string;
    };
};

const CodeEditor: React.FC<Props> = ({ content }) => {
    const [value, setValue] = useState(content.data);
    const [fontSize, setFontSize] = useState(14);

    const { displaySnackbar } = useSnackbar();


    useEffect(() => {
        setValue(content.data);
    }, [content]);


    const onChange = (val: string) => {
        setValue(val);
    };

    const handleFontSizeChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setFontSize(Number(event.target.value));
    };

    const handleSave = async () => {
        const accessToken = localStorage.getItem('accessToken');

        try {
            const response = await axios.post(
                "http://ec2-3-34-131-210.ap-northeast-2.compute.amazonaws.com:8080/api/v1/editor",
                {
                    path: "/src",
                    fileName: "harok.js",
                    content: value
                },
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            );

            if (response.status === 200) {
                console.log("File saved successfully:", response.data);
                console.log(value);
                displaySnackbar("변경사항을 저장했어요!", 'success');
            } else {
                console.error("Failed to save file:", response.data);
                displaySnackbar("저장에 실패했습니다. 다시 시도해주세요.", 'error');
            }
        } catch (error) {
            console.error("Error saving file:", error);
            displaySnackbar("저장 중 오류가 발생했습니다. 다시 시도해주세요.", 'error');
        }
    };


    const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
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
                <ProfileButton onClick={handleOpenModal}>프로필</ProfileButton>
                {isModalOpen && <ProfileModal setIsModalOpen={setIsModalOpen} />}
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

  &:focus {
    outline: none;
  }
`;

const SaveButton = styled.button`
  padding: 5px 10px;
  margin-left: 10px;
  background-color: #6d9ae3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.3s;

  &:hover {
    background-color: #ced0d9;
  }

  &:focus {
    outline: none;
  }
`;

const ProfileButton = styled.button`
  padding: 5px 10px;
  margin-left: 10px;
  background-color: #6d9ae3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.3s;

  &:hover {
    background-color: #ced0d9;
  }

  &:focus {
    outline: none;
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
