import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import { Input, Space } from 'antd';
import QuizComponent from '../components/QuizComponent';
import axios from 'axios';
import { useState } from 'react';
const { Search } = Input;
const props = {
  action: '/api/upload',
  onChange({ file, fileList }) {
    if (file.status !== 'uploading') {
      console.log(file, fileList);
    }
  },
  defaultFileList: [],
};
const App = () => {
  const [results, setResults ] = useState([]);
  const onSearch = async (value) => {
    const res = await axios.get(`/api/search?question=${value}`, {
      method: 'GET',
    })

    setResults(res.data.results)
  }


 return (
    <><Space>
     <Upload {...props}>
       <Button icon={<UploadOutlined />}>Upload</Button>
     </Upload>

     <Search
       placeholder="input search text"
       allowClear
       enterButton="Search"
       size="large"
       onSearch={onSearch} />
   </Space><Space>
       <QuizComponent data={results} />
     </Space></>
  )
};
export default App;