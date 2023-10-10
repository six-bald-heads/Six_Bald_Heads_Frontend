import React, { createContext, useState } from "react";
import Success from "../components/Snackbar/Success";
import Error from "../components/Snackbar/Error";
import Info from "../components/Snackbar/Info";
import Warning from "../components/Snackbar/Warning";

export interface SnackbarContextType {
  message: string;
  type: "success" | "error" | "info" | "warning";
  showSnackbar: boolean;
  displaySnackbar: (
    message: string,
    type: "success" | "error" | "info" | "warning"
  ) => void;
  hideSnackbar: () => void;
}

export const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined
);

interface SnackbarProviderProps {
  children: React.ReactNode;
}

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({
  children,
}) => {
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"success" | "error" | "info" | "warning">(
    "success"
  );

  const displaySnackbar = (
    message: string,
    type: "success" | "error" | "info" | "warning"
  ) => {
    setMessage(message);
    setType(type);
    setShowSnackbar(true);
    setTimeout(() => {
      setShowSnackbar(false);
    }, 3000);
  };

  const hideSnackbar = () => {
    setShowSnackbar(false);
  };

  return (
    <SnackbarContext.Provider
      value={{ message, type, showSnackbar, displaySnackbar, hideSnackbar }}
    >
      {children}
      {showSnackbar && type === "success" && (
        <Success $showSnackbar={showSnackbar} message={message} />
      )}
      {showSnackbar && type === "error" && (
        <Error $showSnackbar={showSnackbar} message={message} />
      )}
      {showSnackbar && type === "info" && (
        <Info $showSnackbar={showSnackbar} message={message} />
      )}
      {showSnackbar && type === "warning" && (
        <Warning $showSnackbar={showSnackbar} message={message} />
      )}
    </SnackbarContext.Provider>
  );
};

export default SnackbarContext;
