import styled from "styled-components";

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
  onCreateFile: () => void;
}

const RightClickMenu: React.FC<Props> = ({ x, y, onCreateFile }) => {
  return (
    <ContextMenu left={x} top={y}>
      <ContextMenuItem onClick={onCreateFile}>새 폴더</ContextMenuItem>
      <ContextMenuItem onClick={onCreateFile}>새 파일</ContextMenuItem>
      <ContextMenuItem onClick={onCreateFile}>삭제</ContextMenuItem>
      <ContextMenuItem onClick={onCreateFile}>이름 수정하기</ContextMenuItem>
      <ContextMenuItem onClick={onCreateFile}>x</ContextMenuItem>
    </ContextMenu>
  );
};

export default RightClickMenu;
