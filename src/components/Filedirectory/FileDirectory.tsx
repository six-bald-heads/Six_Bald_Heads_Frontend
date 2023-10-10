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
import {
  fetchFileContent,
  createFileOnServer,
  createFolderOnServer,
  renameFolderOnServer,
  renameFileOnServer,
  moveFileOnServer,
  moveFolderOnServer,
  deleteFileOnServer,
  deleteFolderOnServer,
} from "../api";
import { v4 as uuidv4 } from "uuid";
import { useSnackbar } from "../../hooks/useSnackbar";

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
    path: string;
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
  const { displaySnackbar } = useSnackbar();

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
  const createNewItem = async (
    itemType: "folder" | "file",
    parentKey: string | null
  ) => {
    console.log("called with itemType", itemType);
    setContextMenuPos(null);

    let apiResponse;

    try {
      if (itemType === "folder") {
        const path = parentKey || "/src";
        const folderName = `NewFolder-${uuidv4()}`;
        apiResponse = await createFolderOnServer(path, folderName);
        console.log("Creating folder with name:", folderName);
      } else {
        const path = parentKey || "/src";
        const fileName = `NewFile-${uuidv4()}.js`;
        apiResponse = await createFileOnServer(path, fileName);
      }

      console.log("Server Response:", apiResponse);

      if (apiResponse.status === "Success") {
        displaySnackbar("성공적으로 생성되었습니다", "success");
        console.log("response", apiResponse.data);
      } else {
        displaySnackbar("실패했습니다", "error");
      }
    } catch (error) {
      console.error(`Failed to create ${itemType} on server:`, error);
      return;
    }

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
            onBlur={async (e) => {
              // 변경된 이름을 저장하는 로직
              if (!isSaved) {
                const newTitle = e.target.value;
                let success, message;

                if (item.type === "folder") {
                  //폴더 이름 변경
                  const result = await renameFolderOnServer(
                    item.path,
                    item.title,
                    newTitle
                  );
                  success = result.success;
                  message = result.message;
                } else if (item.type === "file") {
                  // 파일 이름 변경
                  const result = await renameFileOnServer(
                    item.path,
                    item.title,
                    newTitle
                  );
                  success = result.success;
                  message = result.message;
                } else {
                  displaySnackbar("알 수 없는 아이템 타입!", "error");
                  return;
                }
                if (success) {
                  displaySnackbar("서버에 이름 변경 성공!", "success");
                } else {
                  displaySnackbar("서버에 이름 변경 실패: " + message, "error");
                  return; // 에러 발생 시 아래의 상태 변경 로직을 실행하지 않게 함
                }

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

  const onDelete = async (key: string) => {
    const targetItem = items.find((item) => item.key === key);

    if (!targetItem) {
      console.error("해당 key를 가진 아이템이 없습니다.");
      return;
    }

    console.log(targetItem.path);
    try {
      let apiResponse;
      if (targetItem.type === "folder") {
        apiResponse = await deleteFolderOnServer(targetItem.path); // 폴더 삭제 API 호출
      } else if (targetItem.type === "file") {
        apiResponse = await deleteFileOnServer(
          targetItem.path,
          targetItem.title
        );
        console.log("딜리트 파일 path", targetItem.path);
        // 파일 삭제 API 호출
      } else {
        console.error("Unexpected item type:", targetItem.type);
        console.error("알 수 없는 아이템 타입입니다.");
        return;
      }

      if (apiResponse.status === "Success") {
        displaySnackbar("성공적으로 삭제되었습니다.", "success");
        setContextMenuPos(null);
        setItems((prevItems) => deleteItemFromParent(prevItems, key));
      } else {
        displaySnackbar("삭제에 실패했습니다: " + apiResponse.message, "error");
      }
    } catch (error) {
      console.error(`아이템 삭제에 실패했습니다.`, error);
      displaySnackbar(`오류: ${error.message}`, "error");
    }
  };

  const handleDrop = async (info) => {
    const { dragNode, node, dropPosition } = info;
    let newData = findAndRemove(items, dragNode.key);
    const currentPath = dragNode.props.data.path; // 현재 위치
    let movePath; // 이동할 위치
    let itemName;

    if (dragNode.props.data.type === "file") {
      itemName = dragNode.props.data.title;
    } else if (dragNode.props.data.type === "folder") {
      itemName = dragNode.props.data.title;
    }

    if (
      dragNode.props.data.type === "file" &&
      node.props.data.type === "folder"
    ) {
      newData = addNodeToTree(newData, dragNode.props.data, node.key, -1);
      movePath = node.props.data.path;
    } else if (dragNode.props.data.type === "folder" || dropPosition === 1) {
      newData = addNodeToTree(newData, dragNode.props.data, node.key, 0);
      movePath = node.props.data.path;
    } else {
      const parentNode = findParent(newData, node.key);
      if (parentNode) {
        newData = addNodeToTree(
          newData,
          dragNode.props.data,
          parentNode.key,
          dropPosition
        );
        movePath = parentNode.path;
      } else {
        const insertIndex =
          dropPosition > 0 ? dropPosition : newData.length + dropPosition;
        newData.splice(insertIndex, 0, dragNode.props.data);
        movePath = "/src"; // 최상위 레벨 경로로 설정. 필요하다면 수정.
      }
    }

    // 서버에 이동 작업 반영
    if (dragNode.props.data.type === "file") {
      try {
        const apiResponse = await moveFileOnServer(
          currentPath,
          movePath,
          itemName
        );
        if (apiResponse.status !== "Success") {
          throw new Error(apiResponse.message);
        }
      } catch (error) {
        console.error(`파일을 이동하는데 실패했습니다:`, error);
        displaySnackbar("파일 이동 실패", "error");
        return;
      }
    } else if (dragNode.props.data.type === "folder") {
      try {
        const apiResponse = await moveFolderOnServer(
          currentPath,
          movePath,
          itemName
        );
        if (apiResponse.status !== "Success") {
          throw new Error(apiResponse.message);
        }
      } catch (error) {
        console.error(`폴더를 이동하는데 실패했습니다:`, error);
        displaySnackbar("폴더 이동 실패", "error");
        return;
      }
    }

    // 로컬 상태를 업데이트해서 화면에 변경사항을 반영
    setItems(newData);
  };

  const treeData = treeDataItem(items);

  const handleFileSelect = async (path: string, fileName: string) => {
    console.log("함수 실행");
    try {
      console.log("트라이문");
      const fileContent = await fetchFileContent(path, fileName); // 파일 경로 대신 파일 이름을 넘기는 것을 확인하십시오.
      if (fileContent) {
        console.log(fileContent.data);
        setSelectedFileContent(fileContent);
      }
    } catch (error) {
      console.error("파일 내용을 불러오는 데 실패했습니다:", error);
    }
    // TODO: 서버 연결 해당 파일의 내용을 불러와서 setSelectedFileContent로 상태 업데이트하기
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
        onSelect={(selectedKeys, info) =>
          handleFileSelect(selectedKeys[0], info.node.title)
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
