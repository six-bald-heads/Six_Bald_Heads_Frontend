import React, { useState, useEffect, useRef } from "react";
import { createGlobalStyle, styled } from "styled-components";
import { Tree } from "antd";
import { FolderOutlined, FileOutlined } from "@ant-design/icons";
import RightClickMenu from "./RightClickMenu";

const FileDirectory: React.FC = () => {
  type Item = {
    key: string;
    type: "folder" | "file";
    title: string;
    children?: Item[];
  };

  const [items, setItems] = useState<Item[]>([]);
  const [contextMenuPos, setContextMenuPos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [contextMenuKey, setContextMenuKey] = useState<string | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const contextMenuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      console.log("contextMenuRef.current:", contextMenuRef.current);
      console.log("e.target", e.target);
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(e.target as Node)
      ) {
        console.log("외부 클릭 감지, 모달 닫기");
        setContextMenuPos(null);
      }
    };

    if (contextMenuPos! == null) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [contextMenuRef, contextMenuPos]);

  //오른쪽 클릭 시 콘텍스트 메뉴 위치와 키 설정
  const handleRightClick = (e, key) => {
    e.preventDefault();
    if (key.startsWith("folder-") || key.startsWith("file-")) {
      setContextMenuPos({ x: e.clientX, y: e.clientY });
      setContextMenuKey(key);
    }
  };

  //parentKey 를 가진 폴더에 새로운 아이템 추가, 재귀함수
  const addNewItemToParent = (
    items: Item[],
    newItem: Item,
    parentKey: string | null
  ): Item[] => {
    return items.map((item) => {
      if (item.key === parentKey) {
        return {
          ...item,
          children: [...(item.children || []), newItem],
        };
      }
      if (item.children) {
        return {
          ...item,
          children: addNewItemToParent(item.children, newItem, parentKey),
        };
      }
      return item;
    });
  };

  //folder와 file 생성 로직, 생성한 아이템 위 함수로 추가
  const createNewItem = (
    itemType: "folder" | "file",
    parentKey: string | null
  ) => {
    setContextMenuPos(null);

    const newItem: Item = {
      key: `${itemType}-${Date.now()}`,
      type: itemType,
      title: itemType === "folder" ? "새 폴더" : "새 파일",
      children: itemType === "folder" ? [] : undefined,
    };

    if (parentKey === null) {
      setItems((prevItems) => [...prevItems, newItem]);
    } else {
      setItems((prevItems) =>
        addNewItemToParent(prevItems, newItem, parentKey)
      );
    }
  };

  //입력받은 아이템 배열 트리 형식으로 변환
  const treeDataItem = (inputItems: Item[]) => {
    return inputItems.map((item) => ({
      key: item.key,
      title:
        editingKey === item.key ? (
          <input
            type="text"
            defaultValue={item.title}
            onBlur={(e) => {
              // 변경된 이름을 저장하는 로직
              if (!isSaved) {
                const newTitle = e.target.value;
                setItems((prevItems) => {
                  //아이템 업데이터 함수. 아이템 트리 순회 하면서 특정 key title 변경
                  const updateItemTitle = (item: Item[]): Item[] => {
                    return item.map((item) => {
                      if (item.key === editingKey) {
                        return {
                          ...item,
                          title: newTitle,
                        };
                      }
                      if (item.children) {
                        return {
                          ...item,
                          children: updateItemTitle(item.children),
                        };
                      }
                      return item;
                    });
                  };
                  return updateItemTitle(prevItems);
                });
              }
              setEditingKey(null);
              setIsSaved(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setIsSaved(true);
                (e.target as HTMLInputElement).blur();
              }
            }}
          />
        ) : (
          item.title
        ),
      icon: item.type === "folder" ? <FolderOutlined /> : <FileOutlined />,
      children: item.children ? treeDataItem(item.children) : [],
    }));
  };

  const handleRenameStart = (key) => {
    setEditingKey(key);
    setContextMenuPos(null); //콘텍스트 메뉴 숨기기
  };

  //삭제 기능
  const deleteItemFromParent = (items: Item[], targetKey: string): Item[] => {
    return items.reduce<Item[]>((acc, item) => {
      if (item.key === targetKey) return acc; // 타겟키와 일치하면 아예 반환 배열에 추가하지 않음 (삭제)

      if (item.children) {
        return [
          ...acc,
          { ...item, children: deleteItemFromParent(item.children, targetKey) },
        ];
      }

      return [...acc, item];
    }, []);
  };

  const onDelete = (key: string) => {
    setContextMenuPos(null);
    setItems((prevItems) => deleteItemFromParent(prevItems, key));
  };

  const treeData = treeDataItem(items);

  return (
    <DirectoryContainer>
      <GlobalStyle />
      <ButtonContainer>
        <AddButton onClick={() => createNewItem("folder", null)}>
          <FolderOutlined /> +
        </AddButton>
        <AddButton onClick={() => createNewItem("file", null)}>
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
          parentKey={contextMenuKey}
          onCreateFolder={(parentKey) => createNewItem("folder", parentKey)}
          onCreateFile={(parentKey) => createNewItem("file", parentKey)}
          onRename={(key) => {
            handleRenameStart(key);
          }}
          onDelete={() => {
            if (contextMenuKey !== null) {
              onDelete(contextMenuKey);
            }
          }}
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
