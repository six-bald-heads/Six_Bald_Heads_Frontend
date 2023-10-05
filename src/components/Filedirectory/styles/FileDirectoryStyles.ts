import { Tree } from "antd";
import { createGlobalStyle, styled } from "styled-components";

export const DirectoryContainer = styled.div`
  height: 100%;
  background-color: #303336;
  flex: 1;
  box-sizing: border-box;
  padding: 5px;
  padding-left: 15px;
  padding-right: 30px;
  color: #ced0d9;
  display: flex;
  flex-direction: column;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  width: 100%;
  border-bottom: 1px solid #ced0d9;
  padding-bottom: 2px;
`;

export const AddButton = styled.button`
  background-color: #6d9ae3;
  border: none;
  color: white;
  text-align: center;
  display: inline-flex;
  align-items: center;
  font-size: 10px;
  margin: 0.25rem 0.25rem;
  padding: 5px 10px;
  transition-duration: 0.4s;
  cursor: pointer;

  &:hover {
    background-color: #6486bd;
  }
`;

export const TreeFile = styled(Tree)`
  && {
    background-color: #303336;
    font-size: 14px;
    margin: 3px;
    color: white;
  }
`;

export const GlobalStyle = createGlobalStyle`
  .ant-tree-node-content-wrapper.ant-tree-node-selected {
    background-color: #303336 !important;
  }
`;
