//1. handleDrop 함수에서, 드래그한 노드가 드롭된 위치 찾기
//2. 원래읱 트리에서 드래그한 노드 삭제하기.
//3. 드래그한 노드를 새로운 위치에 삽입하기
//4. 하위구조로 옮기기

//트리에서 특정 키를 가진 노드 찾아서 제거

export const findAndRemove = (tree, targetKey) => {
  return tree.reduce((acc, node) => {
    if (node.key === targetKey) return acc; //대상 결과면 노드에 미포함

    if (node.children) {
      const newChildren = findAndRemove(node.children, targetKey);
      return [...acc, { ...node, children: newChildren }];
    }

    return [...acc, node];
  }, []);
};

// 트리의 특정 위치에 노드 삽입
export const addNodeToTree = (tree, newNode, targetKey, position) => {
  let inserted = false;

  const _insertIntoTree = (arr, targetKey, position) => {
    return arr
      .map((node) => {
        console.log("Current node:", node);
        console.log("inserted:", inserted);
        if (inserted) return node;

        if (node.key === targetKey) {
          inserted = true;
          if (position === -1) {
            return [newNode, node];
          }
          return [node, newNode];
        }
        if (node.children) {
          return {
            ...node,
            children: _insertIntoTree(node.children, targetKey, position),
          };
        }

        return node;
      })
      .flat();
  };

  return _insertIntoTree(tree, targetKey, position);
};

/**
 * 트리에서 특정 키를 가진 노드의 부모 노드를 찾는다.
 * @param tree 전체 트리
 * @param key 찾고자 하는 노드의 키
 * @param parent 현재 검사 중인 노드의 부모 노드 (재귀 호출에 사용됨)
 * @returns 부모 노드 또는 null (찾지 못한 경우)
 */

export const findParent = (tree, key, parent = null) => {
  for (const node of tree) {
    if ((node.children || []).some((child) => child.key === key)) {
      return parent;
    }

    if (node.children) {
      const found = findParent(node.children, key, node);
      if (found) {
        return found;
      }
    }
  }
  return null;
};
