// TreeFileComponent.tsx
import React from "react";
import styled from "styled-components";
import { Tree } from "antd";

const TreeFileComponent: React.FC<{
  treeData: any; // TreeData의 타입을 지정해주세요.
  onRightClick: (info: any) => void; // info의 타입을 지정해주세요.
  onDrop: (info: any) => void; // info의 타입을 지정해주세요.
}> = ({ treeData, onRightClick, onDrop }) => {
  return (
    <TreeFile
      multiple
      defaultExpandAll
      draggable
      onDrop={onDrop}
      onRightClick={onRightClick}
      treeData={treeData}
    />
  );
};

const TreeFile = styled(Tree)`
  && {
    background-color: #303336;
    font-size: 14px;
    margin: 3px;
    color: white;
  }
`;

export default TreeFileComponent;
