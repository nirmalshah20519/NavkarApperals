import React, { useState } from 'react';
import { Box, Button, Text, Spinner } from '@chakra-ui/react';

const Error = ({ errorMessage, onRetry }) => {
  const [loading, setLoading] = useState(false);

  const handleRetry = () => {
    setLoading(true);
    // You can perform any asynchronous operation here, like retrying the server request
    // For demonstration purposes, I'm just simulating a delay using setTimeout
    setTimeout(() => {
      setLoading(false);
      onRetry(); // Call the callback function passed from the parent component
    }, 1000);
  };

  return (
    <Box textAlign="center">
      <Text color="red.500" fontWeight="bold" mb={4}>
        {errorMessage}
      </Text>
      <Button onClick={handleRetry} colorScheme="blue" disabled={loading}>
        {loading ? <Spinner size="sm" /> : 'Retry'}
      </Button>
    </Box>
  );
};

export default Error;
