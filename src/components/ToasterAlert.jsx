import React from 'react';
import { Toaster } from 'react-hot-toast';

export default function ToasterAlert() {
  return (
    <Toaster 
      position="top-center"
      toastOptions={{
        duration: 4000
      }}
    />
  );
}
