import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import { Input, Space, Spin, Tour, Affix } from 'antd';
import QuizComponent from '../components/QuizComponent';
import axios from 'axios';
import { useState , useRef, useEffect } from 'react';
import useFirstVisit from '../hooks/useFirstVisit';
import useIsomorphicLayoutEffect from '../hooks/useIsomorphicLayoutEffect';

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
  const [firstSearchTriggered, setFirstSearchTriggered ] = useState(false);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const [isOpen, setOpen] = useState(false);
  const firstVisit = useFirstVisit();
  const isBrowser = typeof window !== 'undefined';

  useEffect(() => {
    if (firstVisit) {
      setOpen(true);
    }
  }, [firstVisit]);

  const steps = [
    {
      title: 'Încărcare fișier',
      description: `Apasă pe acest buton pentru a încărca fișierele HTML cu răspunsurile salvate. Selectează fișierul dorit direct de pe computerul tău.`,
      cover: (
        <img
          alt="tour.png"
          src="https://www.wikihow.com/images/thumb/d/d0/Run-a-HTML-File-Step-1-Version-3.jpg/v4-460px-Run-a-HTML-File-Step-1-Version-3.jpg.webp"
        />
      ),
      target: () => ref1.current,
    },
  ];

  const onSearch = async (value) => {
    setLoading(true)
    const response = await axios.get(`/api/search?question=${value}`, {
      method: 'GET',
    })

    setResults(response.data.results)
    setLoading(false)

    setFirstSearchTriggered(true);
  }


 return (
     <Spin  tip="Datele se incarca..." spinning={loading}>
    <>
    <Affix offsetTop={7}>
    <Space >
     <Upload  {...props}>
       <Button ref={ref1} icon={<UploadOutlined />}>Incarca HTML File-ul</Button>
     </Upload>

     <Search
       placeholder="Cauta dupa intrebare"
       allowClear
       enterButton="Search"
       size="large"
       onSearch={onSearch} />
   </Space>

    </Affix>
   
    <Space>
       <QuizComponent data={results} firstSearchTriggered={firstSearchTriggered} />
    </Space>
    </>

    <Tour arrow open={isOpen} onClose={() => setOpen(false)} steps={steps} />

    </Spin>
  )
};
export default App;