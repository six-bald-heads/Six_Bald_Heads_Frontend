import React, { useState, useEffect, useRef } from "react";
import { FolderOutlined, FileOutlined } from "@ant-design/icons";
import RightClickMenu from "./RightClickMenu";
import { fetchFileTree } from "./api";
import {
  DirectoryContainer,
  ButtonContainer,
  AddButton,
  TreeFile,
  GlobalStyle,
} from "./styles/FileDirectoryStyles";
import { findAndRemove, addNodeToTree, findParent } from "./treeHelpers";

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
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const MyComponent = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
      fetchFileTree()
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => {
          console.error("API 요청 에러", error);

          if (error.response) {
            switch (error.response.status) {
              case 401:
                alert("토큰이 만료되었습니다. 다시 로그인해주세요.");
                break;
              case 400:
                alert("존재하지 않는 폴더입니다. ");
                break;
              default:
                alert("알 수 없는 에러가 발생했습니다.");
            }
          } else {
            alert("네트워크 에러 또는 알 수 없는 에러가 발생했습니다.");
          }
        });
    }, []);
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
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

  const handleDrop = (info) => {
    const { dragNode, node, dropPosition } = info;

    console.log("dropPosition:", dropPosition);
    console.log("dragNode:", dragNode);
    console.log("dragNode.props:", dragNode.props);
    console.log("dragNode.data:", dragNode.data);
    console.log("node:", node);
    console.log("node.props:", node.props);
    console.log("node.data:", node.data);

    // 원래의 트리에서 드래그한 노드 삭제
    let newData = findAndRemove(items, dragNode.key);

    if (dragNode.props.data.type === "folder" || dropPosition === 1) {
      // 드롭하는 노드가 폴더거나, 노드 바로 아래로 드롭하는 경우
      newData = addNodeToTree(newData, dragNode.props.data, node.key, 0);
    } else {
      console.log("dragNode.props.data.type:", dragNode.props.data.type);
      const parentNode = findParent(newData, node.key); // 드롭하는 노드의 부모 노드
      console.log("parentNode:", parentNode);

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
