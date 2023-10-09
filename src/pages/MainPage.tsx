import { useState } from "react";
import styled from "styled-components";
import FileDirectory from "../components/Filedirectory/FileDirectory";
import CodeEditor from "../components/CodeEditor";
import { Resizable } from "re-resizable";

const MainPage: React.FC = () => {
  const [selectedFileContent, setSelectedFileContent] = useState<string>("");

  return (
    <MainContainer>
      <MainContent>
        <Resizable
          defaultSize={{ width: "20%", height: "100%" }}
          minWidth={"10%"}
          maxWidth={"50%"}
          enable={{
            top: false,
            right: true,
            bottom: false,
            left: false,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false,
          }}
          handleStyles={{
            right: {
              width: "15px",
              height: "100%",
              right: "0px",
              backgroundColor: "#222426",
            },
          }}
        >
          <FileDirectory setSelectedFileContent={setSelectedFileContent} />
        </Resizable>
        <CodeEditor content={selectedFileContent} />
      </MainContent>
    </MainContainer>
  );
};

const MainContainer = styled.div`
  background-color: #222426;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  height: 100vh;
  width: 100vw;
`;

const MainContent = styled.div`
  height: calc(100% - 40px);
  width: 100%;
  padding: 20px;
  display: flex;
`;

export default MainPage;
