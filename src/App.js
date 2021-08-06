import './App.css';
import Autocomplete from './components/Autocomplete';

function App() {
  return (
    <div className="App">
      <Autocomplete
          suggestions={['White', 'Black', 'Green', 'Blue', 'Yellow', 'Red']}
        />
    </div>
  );
}

export default App;
