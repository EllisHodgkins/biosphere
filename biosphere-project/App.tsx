import { View } from 'react-native';
import AppNav from './components/App.navigator';
import { Provider as PaperProvider } from 'react-native-paper';

export default function App() {
  return (
    <PaperProvider>
      <AppNav />
    </PaperProvider>
  );
}
