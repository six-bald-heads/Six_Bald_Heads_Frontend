import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Tree from "rc-tree";
import { treeData as initialTreeData } from "./treeData";
import {
  addFile,
  addFolder,
  handleRightClick,
  handleItemClick,
} from "./TreeFunction";
import { Item, Menu, useContextMenu } from "react-contexify";
import "react-contexify/ReactContexify.css";

const MENU_ID = "context-menu";

const FileDirectory: React.FC = () => {
  const [treeData, setTreeData] = useState(initialTreeData);

  useEffect(() => {
    console.log("treeData가 변경됨:", treeData);
  }, [treeData]);

  const [menuItems, setMenuItems] = useState<string[]>([]); //메뉴 아이템 담을 상태

  const { show } = useContextMenu({
    id: MENU_ID,
  });

  interface SelectedInfo {
    selectedKey: string;
    selectedIsLeaf: boolean;
  }

  const [selectedInfo, setSelectedInfo] = useState<SelectedInfo | null>(null);

  return (
    <DirectoryContainer>
      <ButtonContainer>
        <button
          onClick={() => {
            console.log("폴더 추가 버튼 클릭"); // 로그 추가
            addFolder(treeData, setTreeData);
          }}
        >
          + 폴더
        </button>
        <button onClick={() => addFile(treeData, setTreeData)}>+ 파일</button>
      </ButtonContainer>

      <div
        onContextMenu={(e) => {
          // custom logic
          show({ event: e });
        }}
      >
        <Tree
          defaultExpandAll={false}
          style={{ border: "1px solid #000" }}
          treeData={treeData}
          onRightClick={(eventInfo) => {
            console.log("eventInfo:", eventInfo);
            console.log("eventInfo.node.props:", eventInfo.node.props);

            const items = handleRightClick(eventInfo);
            setMenuItems(items);
          }}
          onSelect={(selectedKeys, e) => {
            console.log("onSelect:", e);
            setSelectedInfo({
              selectedKey: e.node.props.eventKey,
              selectedIsLeaf: e.node.props.isLeaf,
            });
          }}
        />
      </div>
      <StyledMenu id={MENU_ID}>
        {menuItems.map((item, index) => (
          <Item
            key={index}
            onClick={() => {
              if (selectedInfo) {
                // 여기서 null 체크
                handleItemClick(
                  item,
                  selectedInfo.selectedKey,
                  selectedInfo.selectedIsLeaf,
                  treeData,
                  setTreeData
                );
              }
            }}
          >
            {item}
          </Item>
        ))}
      </StyledMenu>
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

  font-size: 10px;

  & > button:first-child {
    margin-right: 3px; // 첫 번째 버튼과 두 번째 버튼 사이의 간격
  }

  & > button {
    background-color: #6d9ae3; // 버튼 내부의 텍스트 색을 검정색으로
  }
`;

const StyledMenu = styled(Menu)`
  --contexify-menu-bgColor: rgba(40, 40, 40, 0.98);
  --contexify-separator-color: #4c4c4c;
  --contexify-item-color: #fff;
  --contexify-activeItem-color: #fff;
  --contexify-activeItem-bgColor: #6d9ae3;
  --contexify-rightSlot-color: #6f6e77;
  --contexify-activeRightSlot-color: #fff;
  --contexify-arrow-color: #6f6e77;
  --contexify-activeArrow-color: #fff;
  font-size: 15px;
`;

export default FileDirectory;
