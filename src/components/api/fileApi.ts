export const fetchFileContent = async (path: string, fileName: string) => {
  try {
    const url = new URL(
      "http://ec2-3-34-131-210.ap-northeast-2.compute.amazonaws.com:8080/api/v1/file-tree/file"
    );
    url.searchParams.append("path", path);
    url.searchParams.append("fileName", fileName);

    console.log(path, fileName);
    const accessToken = localStorage.getItem("accessToken");
    console.log(accessToken);
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message);
    }
  } catch (error) {
    console.error("API 호출 중 오류 발생:", error);
  }
};

export const createFileOnServer = async (path: string, fileName: string) => {
  const endpoint =
    "http://ec2-3-34-131-210.ap-northeast-2.compute.amazonaws.com:8080/api/v1/file-tree/file";

  const requestBody = {
    path: path,
    fileName: fileName,
  };

  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("토큰이 없습니다. 로그인해주세요.");
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    // 여기서 응답의 상태를 체크
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error creating file:`, error);
    throw error;
  }
};

export const createFolderOnServer = async (
  path: string,
  folderName: string
) => {
  const endpoint =
    "http://ec2-3-34-131-210.ap-northeast-2.compute.amazonaws.com:8080/api/v1/file-tree/folder";

  const requestBody = {
    path: path,
    folderName: folderName,
  };
  console.log(requestBody);

  const token = localStorage.getItem("accessToken");
  console.log("Token:", token); // 이렇게 로그로 토큰을 출력해서

  if (!token) {
    throw new Error("토큰이 없습니다. 로그인해주세요.");
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    console.log(`Response status code: ${response.status}`);

    // 여기서 응답의 상태를 체크
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error creating folder:`, error);
    throw error;
  }
};

// // 초기 렌더링
// export const fetchFileTree = async (path: string = "/src") => {
//   const endpoint = `http://ec2-3-34-131-210.ap-northeast-2.compute.amazonaws.com:8080/api/v1/file-tree`;

//   const token = localStorage.getItem("accessToken");

//   if (!token) {
//     throw new Error("토큰이 없습니다. 로그인해주세요.");
//   }

//   const response = await fetch(endpoint, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   if (!response.ok) {
//     const data = await response.json();
//     throw new Error(data.message || "Unknown error");
//   }

//   return await response.json();
// };

export const renameFolderOnServer = async (
  path: string,
  folderName: string,
  folderReName: string
) => {
  try {
    const response = await fetch(
      "http://ec2-3-34-131-210.ap-northeast-2.compute.amazonaws.com:8080/api/v1/file-tree/folder/rename",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path,
          folderName,
          folderReName,
        }),
      }
    );

    const data = await response.json();

    if (data.status === "Success") {
      return { success: true, message: data.message };
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    return { success: false, message: (error as any).message };
  }
};

export const renameFileOnServer = async (
  path: string,
  fileName: string,
  fileReName: string
) => {
  try {
    const response = await fetch(
      "http://ec2-3-34-131-210.ap-northeast-2.compute.amazonaws.com:8080/api/v1/file-tree/file/rename",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path,
          fileName, // 'folderName'을 'fileName'으로 바꿔줌
          fileReName, // 'folderReName'을 'fileReName'으로 바꿔줌
        }),
      }
    );

    const data = await response.json();

    if (data.status === "Success") {
      return { success: true, message: data.message };
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// fileApi.ts 혹은 적절한 api 파일
export const moveFileOnServer = async (
  currentPath: string,
  movePath: string,
  fileName: string
) => {
  const endpoint =
    "http://ec2-3-34-131-210.ap-northeast-2.compute.amazonaws.com:8080/api/v1/file-tree/file/move"; // 여기에 실제 서버 URL을 적어
  const token = localStorage.getItem("accessToken"); // 토큰이 필요하다면 추가

  if (!token) {
    throw new Error("토큰이 없습니다. 로그인해주세요.");
  }

  try {
    const response = await fetch(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPath,
        movePath,
        fileName,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    console.error(`Error moving file:`, error);
    throw error;
  }
};

// fileApi.ts 혹은 적절한 api 파일
export const moveFolderOnServer = async (
  currentPath: string,
  movePath: string,
  folderName: string
) => {
  const endpoint =
    "http://ec2-3-34-131-210.ap-northeast-2.compute.amazonaws.com:8080/api/v1/file-tree/folder/move"; // 여기에 실제 서버 URL을 적어
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("토큰이 없습니다. 로그인해주세요.");
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST", // 메소드가 POST로 변경되었어요!
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPath,
        movePath,
        folderName,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    console.error(`Error moving folder:`, error);
    throw error;
  }
};
