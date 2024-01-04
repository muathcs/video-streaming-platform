import React from "react";

interface ErrorMessageProps {
  message?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message = "Something went wrong",
}) => {
  return <div data-testid="message-container">{message}</div>;
};

export default ErrorMessage;
