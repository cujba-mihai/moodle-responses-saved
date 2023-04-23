import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, Input, Space, Spin, Tour, Affix, Pagination } from 'antd';
import QuizComponent from '../components/QuizComponent';
import axios from 'axios';
import { useState, useRef, useEffect } from 'react';
import useFirstVisit from '../hooks/useFirstVisit';

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
  const [results, setResults] = useState([]);
  const [firstSearchTriggered, setFirstSearchTriggered] = useState(false);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const [isOpen, setOpen] = useState(false);
  const firstVisit = useFirstVisit();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [currentSearchValue, setCurrentSearchValue] = useState('');
  const [totalResults, setTotalResults] = useState(0);

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
    {
      title: 'Cauta dupa intrebare',
      description: `Introducere intrebarea in acest camp pentru a cauta raspunsurile salvate in baza noastra de date.`,
      cover: (
        <img
          alt="tour.png"
          src="https://play-lh.googleusercontent.com/mLvvgUXJVZeu-GbqWZfr8ug74V7d8Od9yU2AOvUUptiki9wIH-BJHataFTJI_J0TlQ"
        />
      ),
      target: () => ref2.current,
    },
  ];

  const onSearch = async (value, page, pageSize) => {
    setCurrentSearchValue(value);
    setLoading(true);
    const offset = (page - 1) * pageSize;
  
    const response = await axios.get(`/api/search?question=${value}&offset=${offset || 0}&limit=${pageSize || 20}`, {
      method: 'GET',
    })
  
    setResults(response.data.results)
    setTotalResults(response.data.totalResults);
  
    setLoading(false)
  
    setFirstSearchTriggered(true);
  }
  
  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    onSearch(currentSearchValue, page, pageSize); // Pass page and pageSize as arguments
  }
  

  useEffect(() => {
    onSearch(currentSearchValue);
  }, [])


  return (
    <Spin tip="Datele se incarca..." spinning={loading}>
      <>
        <Affix offsetTop={7}>
          <Space >
            <div ref={ref1}>
            <Upload  {...props}>
              <Button ref={ref1} icon={<UploadOutlined />}>Incarca HTML File-ul</Button>
            </Upload>
            </div>

            <div ref={ref2}>
              <Search
                placeholder="Cauta dupa intrebare"
                allowClear
                enterButton="Search"
                size="large"
                onSearch={onSearch} />
            </div>
          </Space>

        </Affix>

        <Space>
          <QuizComponent data={results} firstSearchTriggered={firstSearchTriggered} />
        </Space>

        {results.length ? (<Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalResults}
          onChange={handlePaginationChange}
          showSizeChanger
          onShowSizeChange={handlePaginationChange}
        />) : null}
      </>

      <Tour arrow open={isOpen} onClose={() => setOpen(false)} steps={steps} />

    </Spin>
  )
};
export default App;