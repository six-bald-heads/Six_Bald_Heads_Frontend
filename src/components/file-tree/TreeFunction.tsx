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
