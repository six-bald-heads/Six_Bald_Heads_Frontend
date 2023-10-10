//파일과 에디터 연결
export const fetchFileContent = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("토큰이 없습니다. 로그인해주세요.");
    }

    // const fileName = "새 파일.js";
    // const encodedFileName = encodeURIComponent(fileName);
    // const url = `http://ec2-3-34-131-210.ap-northeast-2.compute.amazonaws.com:8080/api/v1/file-tree/file?path=/&fileName=${encodedFileName}`;
    const url = `http://ec2-3-34-131-210.ap-northeast-2.compute.amazonaws.com:8080/api/v1/file-tree/file?path=%2Fsrc&fileName=harok.js`;
    // const url = `http://ec2-3-34-131-210.ap-northeast-2.compute.amazonaws.com:8080/api/v1/file-tree/file?path=%2Fsrc&fileName=%EC%83%88%20%ED%8F%B4%EB%8D%94.js`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message);
    }

    return await response.json();
  } catch (error) {
    console.error("API 호출 중 오류 발생:", error);
    throw error;
  }
};

//파일 생성
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

//폴더 생성
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
        Authorization: `Bearer ${token}`,
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

//폴더 이름 수정
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
    return { success: false, message: error.message };
  }
};

//파일 이름 수정
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
          fileName,
          fileReName,
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

// 파일 이동
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

// 폴더 이동
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

// 파일 삭제
export const deleteFileOnServer = async (path: string, fileName: string) => {
  const fullPath = `${path}/${fileName}`;
  const endpoint = `http://ec2-3-34-131-210.ap-northeast-2.compute.amazonaws.com:8080/api/v1/file-tree/file?path=${encodeURIComponent(
    fullPath
  )}`;

  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("토큰이 없습니다. 로그인해주세요.");
  }

  try {
    const response = await fetch(endpoint, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    console.log(endpoint);
    return data;
  } catch (error) {
    console.error(`Error deleting file:`, error);
    throw error;
  }
};

// 폴더 삭제
export const deleteFolderOnServer = async (path: string) => {
  const endpoint = `http://ec2-3-34-131-210.ap-northeast-2.compute.amazonaws.com:8080/api/v1/file-tree/folder?path=${encodeURIComponent(
    path
  )}`; // 여기에 실제 서버 URL을 적어
  const token = localStorage.getItem("accessToken"); // 토큰이 필요하다면 추가

  if (!token) {
    throw new Error("토큰이 없습니다. 로그인해주세요.");
  }

  try {
    const response = await fetch(endpoint, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    console.error(`Error deleting folder:`, error);
    throw error;
  }
};
