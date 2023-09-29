import axios from "axios";
import { TreeNode } from "rc-tree";
import { useState } from "react";

export const addFile = (treeData, setTreeData) => {
  console.log("addFile 함수 호출됨");
  const newTreeData = [...treeData];
  newTreeData.push({
    key: `${newTreeData.length}`,
    title: "새 파일",
  });
  setTreeData(newTreeData);
  console.log("새로운 treeData:", newTreeData);
};

export const addFolder = (treeData, setTreeData) => {
  const newTreeData = [...treeData];
  newTreeData.push({
    key: `${newTreeData.length}`,
    title: "새 폴더",
    children: [],
  });
  setTreeData(newTreeData);
};

type TreeNode = {
  key: string;
  title: string;
  isLeaf?: boolean;
  children?: TreeNode[];
};

const findNodeByKey = (nodes, key) => {
  for (const node of nodes) {
    if (node.key === key) return node;
    if (node.children) {
      const found = findNodeByKey(node.children, key);
      if (found) return found;
    }
  }
  return null;
};

// 새로운 key를 생성하는 함수
const generateNewKey = () => `${Date.now()}`;

export const handleRightClick = (eventInfo) => {
  const { node } = eventInfo;

  // node 정보에서 폴더인지 파일인지를 판단, children 여부로 판단
  const isFolder = Boolean(node.children);

  const menuItems = isFolder
    ? ["폴더 추가", "파일 추가", "이름 수정", "삭제"]
    : ["이름 수정", "삭제"];

  return menuItems;
};

export const handleItemClick = (
  option: string,
  selectedKey: string,
  selectedIsLeaf: boolean,
  treeData: TreeNode[],
  setTreeData: React.Dispatch<React.SetStateAction<TreeNode[]>>
) => {
  if (selectedIsLeaf) return;

  const newTreeData = [...treeData];
  const targetNode = findNodeByKey(newTreeData, selectedKey);

  if (!targetNode) return;

  switch (option) {
    case "폴더 추가":
      targetNode.children = targetNode.children || [];
      targetNode.children.push({
        key: generateNewKey(),
        title: "새 폴더",
        children: [],
      });
      break;
    case "파일 추가":
      targetNode.children = targetNode.children || [];
      targetNode.children.push({
        key: generateNewKey(),
        title: "새 파일",
        isLeaf: true,
      });
      break;
    case "이름 수정":
      // 이름 수정 로직
      break;
    case "삭제":
      // 삭제 로직
      break;
    default:
      return;
  }
  setTreeData(newTreeData);
};

const findAndUpdateNode = (
  currentNode: TreeNode,
  targetKey: string,
  newNode: TreeNode
): boolean => {
  console.log("현재 노드 키:", currentNode.key, "목표 키:", targetKey);

  if (currentNode.key === targetKey) {
    if (!currentNode.children) {
      currentNode.children = [];
    }
    currentNode.children.push(newNode);
    return true;
  }

  if (currentNode.children) {
    for (const child of currentNode.children) {
      if (findAndUpdateNode(child, targetKey, newNode)) {
        return true;
      }
    }
  }

  return false;
};
