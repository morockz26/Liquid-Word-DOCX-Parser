import React, { useEffect, useState } from "react";
import AceEditor from "react-ace";
import JSZip from "jszip";
import { Flex, Text } from "@wingmate/toolkit";
import { Button } from "wm-ui-toolkit";
import { DocumentType } from "../../types/Document";
import { cleanXml, generateDocx, getXmlString } from "../../utils/parser";
import { DocumentPreview } from "../DocumentPreview/DocumentPreview";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";
import "./ErrorChecker.scss";

export const ErrorChecker: React.FC = () => {
  const [data, setData] = useState<string>("{}");
  const [document, setDocument] = useState<File>();
  const [error, setError] = useState<unknown>();
  const [xmlString, setXmlString] = useState<string>("");
  const [parsedDocument, setParsedDocument] = useState<DocumentType>();
  const [parsedXmlString, setParsedXmlString] = useState<string>("");
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const onDataChange = (value: string) => {
    setData(value);
  };

  const resetParsedDocument = () => {
    setParsedDocument(undefined);
    setParsedXmlString("");
  };

  const onFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    const file = files ? files[0] : undefined;
    resetParsedDocument();

    setDocument(file);
  };

  const openDocumentPreviewModal = () => {
    setIsPreviewModalOpen(true);
  };

  const closeDocumentPreviewModal = () => {
    setIsPreviewModalOpen(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getDocumentXmlString = async (zipFiles: any) => {
    const documentXmlString = await getXmlString(zipFiles);

    return documentXmlString;
  };

  useEffect(() => {
    const unzipAndGenerate = async () => {
      if (document) {
        const unzippedDocument = await JSZip.loadAsync(document);

        setXmlString(await getDocumentXmlString(unzippedDocument));

        try {
          const generatedFile = await generateDocx(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            unzippedDocument as any,
            JSON.parse(data),
            "blob"
          );

          setParsedDocument(generatedFile);

          const unzippedGeneratedFile = await JSZip.loadAsync(generatedFile);
          await getDocumentXmlString(unzippedGeneratedFile);

          setParsedXmlString(await getDocumentXmlString(unzippedGeneratedFile));
        } catch (err) {
          setError(
            new Error(
              "Failed to parsed document. Please check your liquid tags"
            )
          );
        }
      }
    };

    unzipAndGenerate();
  }, [data, document]);

  const renderCopyButtons = () => (
    <Flex gap="middle" wrap="wrap" justify="center">
      {xmlString && (
        <Button
          type="primary"
          onClick={() => {
            copyText(xmlString);
          }}
        >
          Copy Xml
        </Button>
      )}
      {xmlString && (
        <Button
          type="primary"
          onClick={() => {
            copyText(cleanXml(xmlString));
          }}
        >
          Copy Cleaned Xml
        </Button>
      )}
      {parsedXmlString && (
        <Button
          type="primary"
          onClick={() => {
            copyText(parsedXmlString);
          }}
        >
          Copy Parsed Xml
        </Button>
      )}
    </Flex>
  );

  return (
    <Flex rootClassName="ErrorChecker" vertical gap="40px">
      <Flex
        rootClassName="ErrorChecker__header"
        gap="large"
        justify="space-between"
        align="center"
      >
        <Text className="header__title" type="H1" weight="Semi">
          Document Tester
        </Text>
        <input
          className="header__fileInput"
          accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          data-testid="fileInput"
          id="file"
          onChange={onFileUpload}
          placeholder="Upload Docx File"
          type="file"
          multiple={false}
        />
      </Flex>
      <Flex rootClassName="ErrorChecker__editors" gap="large" flex={1}>
        <Flex vertical gap="large" flex={3}>
          <AceEditor
            mode="json"
            defaultValue={data}
            theme="monokai"
            width="100%"
            height="100%"
            onChange={onDataChange}
            showPrintMargin={false}
            setOptions={{
              tabSize: 2,
              useWorker: false,
            }}
          />
        </Flex>
        <Flex
          rootClassName="editors__result"
          vertical
          flex={2}
          align="center"
          gap="middle"
        >
          {renderCopyButtons()}
          {xmlString ? (
            <Flex vertical gap="middle" align="center">
              <Flex gap="middle">
                <Button type="light" onClick={openDocumentPreviewModal}>
                  View Parsed Document
                </Button>
              </Flex>
              <Text type="H3" weight="Semi">
                {!error
                  ? "All Set! Your document was successfully parsed without any errors."
                  : error}
              </Text>
            </Flex>
          ) : (
            <Text type="H3" weight="Semi">
              Upload a document to check for errors
            </Text>
          )}
        </Flex>
      </Flex>
      <DocumentPreview
        isModalOpen={isPreviewModalOpen}
        onRequestClose={closeDocumentPreviewModal}
        parsedDocument={parsedDocument}
      />
    </Flex>
  );
};

export default ErrorChecker;
