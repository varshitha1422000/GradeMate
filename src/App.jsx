import Shell from './components/Shell';
import MastHead from './components/MastHead/MastHead';
import SideBar from './components/SideBar/SideBar';

import './App.css';

function App() {
  return (
    <div className="App">
      <MastHead/>
      <div className="spacer">
      <SideBar/>
      <Shell/>
      </div>
    </div>
  );
}

export default App;
