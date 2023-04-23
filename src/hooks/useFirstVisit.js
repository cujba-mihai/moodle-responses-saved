import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const useFirstVisit = () => {
  const [firstVisit, setFirstVisit] = useState(false);

  useEffect(() => {
    const isFirstVisit = Cookies.get('firstTimeVisitor') === undefined;

    if (isFirstVisit) {
      Cookies.set('firstTimeVisitor', 'false', { expires: 365 });
      setFirstVisit(true);
    }
  }, []);

  return firstVisit;
};

export default useFirstVisit;
