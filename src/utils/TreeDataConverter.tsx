// TreeDataConverter.ts

import React from "react";
import { FolderOutlined, FileOutlined } from "@ant-design/icons";

export type Item = {
  key: string;
  type: "folder" | "file";
  title: string;
  children?: Item[];
};

export type TreeData = {
  key: string;
  title: React.ReactNode;
  icon: React.ReactElement;
  children?: TreeData[];
};

export const convertToTreeData = (inputItems: Item[]): TreeData[] => {
  return inputItems.map((item) => ({
    key: item.key,
    title: item.title,
    icon: item.type === "folder" ? <FolderOutlined /> : <FileOutlined />,
    children: item.children ? convertToTreeData(item.children) : undefined,
  }));
};
