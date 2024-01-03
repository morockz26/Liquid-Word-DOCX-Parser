import React from "react";
import { Modal } from "wm-ui-toolkit";

import "./DocumentPreview.scss";

export interface IDocumentPreviewProps {
  isModalOpen: boolean;
  onRequestClose: () => void;
}

export const DocumentPreview: React.FC<IDocumentPreviewProps> = ({
  isModalOpen,
  onRequestClose,
}) => {
  const x = "Hi";

  return (
    <Modal
      isModalOpen={isModalOpen}
      onRequestClose={onRequestClose}
      showCloseButton={false}
    >
      <div>{x}</div>
    </Modal>
  );
};

export default DocumentPreview;
