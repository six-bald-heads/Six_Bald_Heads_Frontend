import React, { useState, useEffect, useRef } from "react";
import { FolderOutlined, FileOutlined } from "@ant-design/icons";
import RightClickMenu from "./RightClickMenu";
import {
  DirectoryContainer,
  ButtonContainer,
  AddButton,
  TreeFile,
  GlobalStyle,
} from "./styles/DirectoryStyle";
import { findAndRemove, addNodeToTree, findParent } from "./treeHelpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faJsSquare } from "@fortawesome/free-brands-svg-icons";

type FileDirectoryProps = {
  setSelectedFileContent: React.Dispatch<React.SetStateAction<string>>;
};

const FileDirectory: React.FC<FileDirectoryProps> = ({
  setSelectedFileContent,
}) => {
  type Item = {
    key: string;
    type: "folder" | "file";
    title: string;
    children?: Item[];
    icon: React.ReactElement;
  };

  type TreeData = {
    key: string;
    title: React.ReactNode;
    icon: React.ReactElement;
    children?: TreeData[];
  };

  const [items, setItems] = useState<Item[]>([]);
  const [contextMenuPos, setContextMenuPos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [contextMenuKey, setContextMenuKey] = useState<string | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const [selectedFileKey, setSelectedFileKey] = useState<string | null>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(e.target as Node)
      ) {
        setContextMenuPos(null);
      }
    };

    if (contextMenuPos !== null) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [contextMenuRef, contextMenuPos]);

  //오른쪽 클릭 시 콘텍스트 메뉴 위치와 키 설정
  const handleRightClick = (e: React.MouseEvent, key: string) => {
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
      title: itemType === "folder" ? "새 폴더" : "새 파일.js",
      children: itemType === "folder" ? [] : undefined,
      icon:
        itemType === "folder" ? (
          <FolderOutlined style={{ marginRight: "25px" }} />
        ) : (
          <FontAwesomeIcon icon={faJsSquare} style={{ marginRight: "25px" }} />
        ),
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
  const treeDataItem = (inputItems: Item[]): TreeData[] => {
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
          <span>{item.title}</span>
        ),
      icon: item.icon,
      children: item.children ? treeDataItem(item.children) : undefined,
    }));
  };

  const handleRenameStart = (key: string) => {
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

  const handleDrop = (info) => {
    const { dragNode, node, dropPosition } = info;

    // 원래의 트리에서 드래그한 노드 삭제
    let newData = findAndRemove(items, dragNode.key);

    if (
      dragNode.props.data.type === "file" &&
      node.props.data.type === "folder"
    ) {
      newData = addNodeToTree(newData, dragNode.props.data, node.key, -1);
    } else if (dragNode.props.data.type === "folder" || dropPosition === 1) {
      // 드롭하는 노드가 폴더거나, 노드 바로 아래로 드롭하는 경우
      newData = addNodeToTree(newData, dragNode.props.data, node.key, 0);
    } else {
      const parentNode = findParent(newData, node.key); // 드롭하는 노드의 부모 노드

      if (parentNode) {
        newData = addNodeToTree(
          newData,
          dragNode.props.data.type,
          parentNode.key,
          dropPosition
        );
      } else {
        // 최상위 레벨에서의 이동
        const insertIndex =
          dropPosition > 0 ? dropPosition : newData.length + dropPosition;
        newData.splice(insertIndex, 0, dragNode.props.data);
      }
    }

    // 로컬 상태를 업데이트해서 화면에 변경사항을 반영
    setItems(newData);
  };
  const treeData = treeDataItem(items);

  const handleFileSelect = (key: string, content: string) => {
    setSelectedFileKey(key);
    setSelectedFileContent(content);
    // TODO: 해당 파일의 내용을 불러와서 setSelectedFileContent로 상태 업데이트하기
  };

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
        draggable
        onDrop={handleDrop}
        onRightClick={(info) => handleRightClick(info.event, info.node.key)}
        treeData={treeData}
        onSelect={(keys, info) =>
          handleFileSelect(info.node.key, String(info.node.title))
        }
      />

      {contextMenuPos && (
        <RightClickMenu
          ref={contextMenuRef}
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

export default FileDirectory;
