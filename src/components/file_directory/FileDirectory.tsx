import React, { useState } from "react";
import { createGlobalStyle, styled } from "styled-components";
import { Tree } from "antd";
import { FolderOutlined, FileOutlined } from "@ant-design/icons";
import RightClickMenu from "./RightClickMenu";

const FileDirectory: React.FC = () => {
  type Item = {
    type: "folder" | "file";
    title: string;
    children?: Item[];
  };

  const [items, setItems] = useState<Item[]>([]);
  const [contextMenuPos, setContextMenuPos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [contextMenuKey, setContextMenuKey] = useState(null);

  const handleRightClick = (e, key) => {
    console.log("우클릭", e, key);
    e.preventDefault();
    if (key.startsWith("folder-")) {
      setContextMenuPos({ x: e.clientX, y: e.clientY });
      setContextMenuKey(key);
    }
  };

  const handleCreateFile = (parentKey) => {
    setContextMenuPos(null);

    //새파일 생성
    const newFile: Item = {
      type: "file",
      title: "새 파일",
      children: undefined,
    };

    const newItems = [...items];
    const parentFolder = newItems.find((item) => item.key === parentKey);

    if (parentFolder) {
      if (!parentFolder.children) {
        parentFolder.children = [];
      }
      parentFolder.children.push(newFile);
    } else {
      newItems.push(newFile);
    }

    setItems(newItems);
  };

  const onRightClick = (itemType) => {
    const newItem = {
      key: `${itemType}-${Date.now()}`,
      type: itemType,
      title: itemType === "folder" ? "  새 폴더" : "  새 파일",
    };
    setItems([...items, newItem]);
  };

  const treeDataItem = (items) => {
    return items.map((item, index) => {
      return {
        key: `${item.type}-${index}`,
        title: item.title,
        icon: item.type === "folder" ? <FolderOutlined /> : <FileOutlined />,
        children: [],
      };
    });
  };

  const treeData = treeDataItem(items);

  return (
    <DirectoryContainer>
      <GlobalStyle />
      <ButtonContainer>
        <AddButton onClick={() => onRightClick("folder")}>
          <FolderOutlined /> +
        </AddButton>
        <AddButton onClick={() => onRightClick("file")}>
          <FileOutlined /> +
        </AddButton>
      </ButtonContainer>
      <TreeFile
        multiple
        defaultExpandAll
        onRightClick={(info) => handleRightClick(info.event, info.node.key)}
        treeData={treeData}
      />
      {contextMenuPos && (
        <RightClickMenu
          x={contextMenuPos.x}
          y={contextMenuPos.y}
          onCreateFile={() => handleCreateFile(contextMenuKey)}
        />
      )}
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

const TreeFile = styled(Tree)`
  && {
    background-color: #303336;
    font-size: 14px;
    margin: 3px;
    color: white;
  }
`;

const GlobalStyle = createGlobalStyle`
  .ant-tree-node-content-wrapper.ant-tree-node-selected {
    background-color: #303336 !important;
  }
`;

export default FileDirectory;
