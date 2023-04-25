import axios from 'axios';

export const getServerSideProps = async (context) => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/search?question=&offset=0&limit=10`, {
    method: 'GET',
  })

  return {
    props: {
      initialResults: response.data.results,
      totalResults: response.data.totalResults,
    },
  };
};

export default getServerSideProps;
