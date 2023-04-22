// FileUpload.js
import React, { useState } from 'react';
import axios from 'axios';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const FileUpload = () => {
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    console.log(...args)
    e.preventDefault();
    if (!file) return;
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error uploading file:', error.response?.data?.error || error.message);
    }
  };

  return (
    <Upload
      name="file"
      maxCount={1}
      beforeUpload={handleSubmit}
      showUploadList={false}
    >
      <Button icon={<UploadOutlined />}>Upload HTML file</Button>
    </Upload>
  );
};

export default FileUpload;
