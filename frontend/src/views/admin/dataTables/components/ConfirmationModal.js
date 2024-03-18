import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button } from '@chakra-ui/react';
import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete Confirmation</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Are you sure you want to delete this item?
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onConfirm}>
            Confirm
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal;
