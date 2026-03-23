import useWindowSize from 'react-use/lib/useWindowSize';

function useWidth() {
  const { width } = useWindowSize();

  return width > 800 ? 800 : width;
}

export default useWidth;
