import './App.css';
import Autocomplete from './components/Autocomplete';

function App() {
  return (
    <div className="App">
      <Autocomplete />
    </div>
  );
}

/To do list/
// Memoize results
// onStartMatch - typed string only matches chars at beginning
// onEndMatch - typed string only matches chars at end
// add loading behaviour when network call is happening

export default App;
