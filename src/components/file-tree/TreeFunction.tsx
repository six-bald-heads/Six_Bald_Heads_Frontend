export const addFile = (treeData, setTreeData) => {
  const newTreeData = [...treeData];
  newTreeData.push({
    key: `${newTreeData.length}`,
    title: "새 파일",
  });
  setTreeData(newTreeData);
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

export const handleRightClick = (eventInfo) => {
  const { node } = eventInfo;

  //node 정보에서 폴더인지 파일인지를 판단, children 여부로 판단
  const isFolder = Boolean(node.children);

  const menuItems = isFolder
    ? ["파일 추가", "이름 수정", "삭제", "X"]
    : ["이름 수정", "삭제", "X"];
};
