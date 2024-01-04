import React from "react";
import DocViewer from "react-doc-viewer";
import FileSaver from "file-saver";
import { Flex } from "@wingmate/toolkit";
import { Button, Modal, Text } from "wm-ui-toolkit";
import { DocumentType } from "../../types/Document";

import "./DocumentPreview.scss";

export interface IDocumentPreviewProps {
  documentName?: string;
  parsedDocument?: DocumentType;
  isModalOpen: boolean;
  onRequestClose: () => void;
}

export const DocumentPreview: React.FC<IDocumentPreviewProps> = ({
  documentName = "",
  isModalOpen,
  onRequestClose,
  parsedDocument,
}) => {
  const download = () => {
    if (parsedDocument) {
      FileSaver.saveAs(parsedDocument as Blob, documentName);
    }
  };

  return (
    <Modal
      className="DocumentPreview"
      isModalOpen={isModalOpen}
      onRequestClose={onRequestClose}
      showCloseButton={false}
    >
      <Flex vertical gap="large">
        <Flex align="center" justify="space-between" gap="large">
          <Text type="H1" weight="Semi">
            Preview
          </Text>
          <Button type="primary" onClick={download}>
            Download
          </Button>
        </Flex>
        <DocViewer documents={[]} />
      </Flex>
    </Modal>
  );
};

export default DocumentPreview;
