import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";

const SimpleModal = ({ isOpen, onClose, title, text }: { isOpen: boolean; onClose: () => void; title: string; text: string }) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent style={{ backgroundColor: "#1b1b1b", color: "white" }}>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
              <ModalBody>
                <p>
                  {text}
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default SimpleModal;
