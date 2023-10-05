import styled from "styled-components";
import React from "react";

interface ContextMenuProps {
  left: number;
  top: number;
}

const ContextMenu = styled.div<ContextMenuProps>`
  position: absolute;
  background-color: #303336;
  border: 1px solid white;
  z-index: 1000;
  cursor: pointer;
  font-size: 11px;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
`;

const ContextMenuItem = styled.div`
  padding: 5px 9px;
  &:hover {
    background-color: #222426;
  }
  border-bottom: 1px solid gray;
  text-align: center;
`;

interface Props {
  x: number;
  y: number;
  parentKey: string | null;
  onCreateFolder: (parentKey: string) => void;
  onCreateFile: (parentKey: string) => void;
  onRename: (parentKey: string) => void;
  onDelete: (parentKey: string) => void;
}

const RightClickMenu = React.forwardRef<HTMLDivElement, Props>(
  (
    { x, y, parentKey, onCreateFolder, onCreateFile, onRename, onDelete },
    ref
  ) => {
    if (parentKey) {
      return (
        <ContextMenu left={x} top={y} ref={ref}>
          {parentKey ? (
            parentKey.startsWith("folder-") ? (
              <>
                <ContextMenuItem onClick={() => onCreateFolder(parentKey)}>
                  새 폴더
                </ContextMenuItem>
                <ContextMenuItem onClick={() => onCreateFile(parentKey)}>
                  새 파일
                </ContextMenuItem>
                <ContextMenuItem onClick={() => onRename(parentKey)}>
                  이름 수정
                </ContextMenuItem>
                <ContextMenuItem onClick={() => onDelete(parentKey)}>
                  삭제
                </ContextMenuItem>
              </>
            ) : (
              parentKey.startsWith("file-") && (
                <>
                  <ContextMenuItem onClick={() => onRename(parentKey)}>
                    이름 수정
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => onDelete(parentKey)}>
                    삭제
                  </ContextMenuItem>
                </>
              )
            )
          ) : (
            <ContextMenuItem onClick={() => console.log("X")}>
              x
            </ContextMenuItem>
          )}
        </ContextMenu>
      );
    }
  }
);

export default RightClickMenu;
