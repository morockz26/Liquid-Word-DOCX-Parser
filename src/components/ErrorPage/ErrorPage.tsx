import React from "react";
import { Link } from "react-router-dom";
import { Button, FlexCol, Text } from "wm-ui-toolkit";
import { ReactComponent as WmLogoImage } from "../../assets/images/wingmate-icon.svg";

import "./ErrorPage.scss";

interface ErrorPageProps {
  errorCode?: "403" | "404" | "500";
}

export const ErrorPage: React.FC<ErrorPageProps> = ({ errorCode }) => (
  <FlexCol className="ErrorPage" alignItems="center" gap="XS">
    <Text type="H3" weight="Bold">
      {!errorCode && "Error"}
      {errorCode === "403" && "Error no access to this resource"}
      {errorCode === "404" && "Error not found"}
      {errorCode === "500" && "Something went wrong"}
    </Text>
    <Text type="H4">Wingmate Docx Parser experienced an error</Text>
    <WmLogoImage width="280px" height="200px" />
    <Link to="/" className="text">
      <Button type="primary">Click to go Home</Button>
    </Link>
    <a
      href="https://support.wingmateapp.com/"
      target="_blank"
      rel="noreferrer"
      className="text"
    >
      <Text>Wingmate Support</Text>
    </a>
  </FlexCol>
);

export default ErrorPage;
