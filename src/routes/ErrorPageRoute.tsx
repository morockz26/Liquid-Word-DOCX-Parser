import React, { ReactNode } from "react";

interface ErrorPageRouteProps {
  children: ReactNode;
}

export const ErrorPageRoute: React.FC<ErrorPageRouteProps> = ({ children }) => (
  <div>{children}</div>
);

export default ErrorPageRoute;
