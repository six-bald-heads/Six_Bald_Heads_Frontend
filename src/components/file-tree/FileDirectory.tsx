import React, { useState } from "react";
import styled from "styled-components";
import Tree from "rc-tree";
import { treeData as initialTreeData } from "./TreeData";
import { addFile, addFolder } from "./TreeFunction";

const FileDirectory: React.FC = () => {
  const [treeData, setTreeData] = useState(initialTreeData);

  return (
    <DirectoryContainer>
      <ButtonContainer>
        <button onClick={() => addFile(treeData, setTreeData)}>+ 파일</button>
        <button onClick={() => addFolder(treeData, setTreeData)}>+ 폴더</button>
      </ButtonContainer>
      <Tree
        defaultExpandAll={false}
        style={{ border: "1px solid #000" }}
        treeData={treeData}
      />
    </DirectoryContainer>
  );
};

const DirectoryContainer = styled.div`
  height: 100%;
  background-color: #303336;
  flex: 1;
  box-sizing: border-box;
  padding: 20px;
  color: #ced0d9;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 0px;
  padding-top: 0px;

  font-size: 8px;

  & > button:first-child {
    margin-right: 3px; // 첫 번째 버튼과 두 번째 버튼 사이의 간격
  }
`;

export default FileDirectory;
