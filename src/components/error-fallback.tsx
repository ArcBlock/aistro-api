import Error from './error';

function ErrorFallback({ error }: { error: Error }) {
  return <Error message={error?.message} />;
}

export default ErrorFallback;
