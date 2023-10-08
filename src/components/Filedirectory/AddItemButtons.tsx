// AddItemButtons.tsx
import React from "react";
import { FolderOutlined, FileOutlined } from "@ant-design/icons";
import styled from "styled-components";

const AddItemButtons: React.FC<{
  onAddFolder: () => void;
  onAddFile: () => void;
}> = ({ onAddFolder, onAddFile }) => {
  return (
    <ButtonContainer>
      <AddButton onClick={onAddFolder}>
        <FolderOutlined /> +
      </AddButton>
      <AddButton onClick={onAddFile}>
        <FileOutlined /> +
      </AddButton>
    </ButtonContainer>
  );
};

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  width: 100%;
  border-bottom: 1px solid #ced0d9;
  padding-bottom: 2px;
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

export default AddItemButtons;
