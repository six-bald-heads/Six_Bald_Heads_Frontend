import React, {useState} from 'react';
import styled from 'styled-components';
import { Tree } from 'antd';
import { FolderOutlined, FileOutlined } from '@ant-design/icons';


const FileDirectory: React.FC = () => {

    type Item = {
        type: 'folder' | 'file'
        title : string
    }


    const [items, setItems] = useState<Item[]>([])

    const onRightClick = (itemType) => {
        const newItem = {
            type: itemType,
            title : itemType === 'folder' ? '새 폴더' : '새 파일'
        };
        setItems([...items, newItem]);
    }


    return (
        <DirectoryContainer>
            {items.map((item, index)=> (
                <div key={index}>
                    {item.type === 'folder' ?  < FolderOutlined /> : < FileOutlined /> }
                    {item.title}
                </div>
            ))}
            <AddButton onClick={() => onRightClick('folder')}>
                <FolderOutlined /> +
            </AddButton>
            <AddButton onClick={() => onRightClick('file')}>
                <FileOutlined /> +
            </AddButton>
        </DirectoryContainer>
    );
}

const DirectoryContainer = styled.div`
  height: 100%;
  background-color: #303336;
  flex: 1;
  box-sizing: border-box;
  padding: 5px;
  padding-left: 15px;
  padding-right: 20px; 
  color: #CED0D9;
  display: flex;  // 여기를 flex로 바꿔
  justify-content: flex-end; // 수평으로 중앙에 배치
  align-items: flex-start;     // 수직으로 중앙에 배치
`;


const AddButton = styled.button`
  background-color: #6D9AE3;  
  border: none;
  color: white;
  text-align: center;
  display: inline-flex;  
  align-items: center;
  font-size: 8px;  
  margin: 0.25rem 0.25rem;
  padding: 5px 10px;
  transition-duration: 0.4s;
  cursor: pointer;
  
  &:hover {
    background-color: #6486bd;  
  }
`;

export default FileDirectory;
