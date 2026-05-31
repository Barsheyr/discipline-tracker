import { Toaster } from 'react-hot-toast';
import { TrackerPage } from './components/TrackerPage';

function App() {
  return (
    <>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#111',
            color: '#faf8f3',
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '13px',
            borderRadius: '0',
          },
          duration: 2500,
        }}
      />
      <TrackerPage />
    </>
  );
}

export default App;
