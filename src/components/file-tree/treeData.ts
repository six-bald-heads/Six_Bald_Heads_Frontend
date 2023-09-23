type TreeNode = {
  key: string;
  title: string;
  children?: TreeNode[];
};

export const treeData: TreeNode[] = [
  {
    key: "0",
    title: "folder",
    children: [
      { key: "0-0", title: "file.tsx" },
      { key: "0-1", title: "file.js" },
      {
        key: "0-2",
        title: "folder",
        children: [
          { key: "0-2-0", title: "file" },
          { key: "0-2-1", title: "file" },
        ],
      },
      { key: "0-3", title: "node 0-3" },
      { key: "0-4", title: "node 0-4" },
      {
        key: "0-9",
        title: "folder",
        children: [
          { key: "0-9-0", title: "node 0-9-0" },
          {
            key: "0-9-1",
            title: "folder",
            children: [
              {
                key: "0-9-1-0",
                title: "node 0-9-1-0",
              },
            ],
          },
          {
            key: "0-9-2",
            title: "folder",
            children: [
              {
                key: "0-9-2-0",
                title: "node 0-9-2-0",
              },
              {
                key: "0-9-2-1",
                title: "node 0-9-2-1",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    key: "1",
    title: "node 1",

    children: [
      {
        key: "1-0",
        title: "node 1-0",
        children: [
          { key: "1-0-0", title: "node 1-0-0" },
          {
            key: "1-0-1",
            title: "node 1-0-1",
            children: [
              {
                key: "1-0-1-0",
                title: "node 1-0-1-0",
              },
              {
                key: "1-0-1-1",
                title: "node 1-0-1-1",
              },
            ],
          },
          { key: "1-0-2", title: "node 1-0-2" },
        ],
      },
    ],
  },
];
