import React from "react";
import FileSaver from "file-saver";
import { Flex } from "@wingmate/toolkit";
import { Button, Modal, Text } from "wm-ui-toolkit";
import { DocumentType } from "../../types/Document";

import "./DocumentPreview.scss";

export interface IDocumentPreviewProps {
  document?: DocumentType;
  isModalOpen: boolean;
  onRequestClose: () => void;
}

export const DocumentPreview: React.FC<IDocumentPreviewProps> = ({
  document,
  isModalOpen,
  onRequestClose,
}) => {
  const download = () => {
    if (document) {
      FileSaver.saveAs(document as Blob, "output.docx");
    }
  };

  return (
    <Modal
      className="DocumentPreview"
      isModalOpen={isModalOpen}
      onRequestClose={onRequestClose}
      showCloseButton={false}
    >
      <Flex align="center" justify="space-between" gap="large">
        <Text type="H1" weight="Semi">
          Preview
        </Text>
        <Button type="primary" onClick={download}>
          Download
        </Button>
      </Flex>
    </Modal>
  );
};

export default DocumentPreview;
