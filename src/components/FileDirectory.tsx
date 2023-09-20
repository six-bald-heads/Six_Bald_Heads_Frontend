import React, { useState } from "react";
import styled from "styled-components";
import { Tree } from "antd";
import { FolderOutlined, FileOutlined } from "@ant-design/icons";

const FileDirectory: React.FC = () => {
  type Item = {
    type: "folder" | "file";
    title: string;
  };

  const [items, setItems] = useState<Item[]>([]);

  const onRightClick = (itemType) => {
    const newItem = {
      type: itemType,
      title: itemType === "folder" ? "  새 폴더" : "  새 파일",
    };
    setItems([...items, newItem]);
  };

  return (
    <DirectoryContainer>
      <ButtonContainer>
        <AddButton onClick={() => onRightClick("folder")}>
          <FolderOutlined /> +
        </AddButton>
        <AddButton onClick={() => onRightClick("file")}>
          <FileOutlined /> +
        </AddButton>
      </ButtonContainer>
      <ItemsContainer>
        {items.map((item, index) => (
          <ItemStyle key={index}>
            {item.type === "folder" ? <FolderOutlined /> : <FileOutlined />}
            {item.title}
          </ItemStyle>
        ))}
      </ItemsContainer>
    </DirectoryContainer>
  );
};

const DirectoryContainer = styled.div`
  height: 100%;
  background-color: #303336;
  flex: 1;
  box-sizing: border-box;
  padding: 5px;
  padding-left: 15px;
  padding-right: 30px;
  color: #ced0d9;
  display: flex;
  flex-direction: column;
`;

const ItemsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const ItemStyle = styled.div`
  font-size: 15px; // 폰트 크기 조절
  padding: 3px; // 패딩 조절
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  width: 100%;
  border-bottom: 1px solid #ced0d9;
  padding-botton: 15px;
`;

const AddButton = styled.button`
  background-color: #6d9ae3;
  border: none;
  color: white;
  text-align: center;
  display: inline-flex;
  align-items: center;
  font-size: 10px;
  margin: 0.25rem 0.25rem;
  padding: 5px 10px;
  transition-duration: 0.4s;
  cursor: pointer;

  &:hover {
    background-color: #6486bd;
  }
`;

export default FileDirectory;
