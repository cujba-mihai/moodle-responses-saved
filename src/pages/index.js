import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import { Input, Space, Spin } from 'antd';
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
  const [loading, setLoading] = useState(false);
  const [results, setResults ] = useState([]);

  const onSearch = async (value) => {
    setLoading(true)
    const response = await axios.get(`/api/search?question=${value}`, {
      method: 'GET',
    })

    setResults(response.data.results)
    setLoading(false)

  }


 return (
    <><Space>
     <Upload {...props}>
       <Button icon={<UploadOutlined />}>Incarca HTML File-ul</Button>
     </Upload>

     <Search
       placeholder="Cauta dupa intrebare"
       allowClear
       enterButton="Search"
       size="large"
       onSearch={onSearch} />
   </Space>
   
    <Space>
    <Spin spinning={loading}>
       <QuizComponent data={results} />
    </Spin>
    </Space>
    </>
  )
};
export default App;