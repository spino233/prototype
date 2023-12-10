import './App.css';
import { useAppContext } from './feature/context/AppContext';
import * as Database from './data/db';
import { useEffect } from 'react';
import InsertSample from './feature/component/InsertSample';
import SampleDataTable from './feature/component/SampleDataTable';

function App() {
  const {items, updateItems} = useAppContext();
  const tableStyle = {minWidth: '50rem'};
  async function getData() {
    const db = await Database.get();
    db.sample.find({
        selector: {},
    }).$.subscribe(sample => {
        if (!sample) {
            return;
        }
        var modifiedSamples = sample.map((v) => { return{
          id: v._data.id,
          name: v._data.name,
          age: v._data.age,
          surname: v._data.surname,
        }})
        updateItems([...items, ...modifiedSamples])
    });
  }

  useEffect(() => {getData()}, []);

  return (
    <div className="card flex flex-column gap-3 justify-center align-center m-10">
      <div className='flex-1 justify-center align-center'>
        <InsertSample/>
      </div>
      <div className='flex-1 justify-center align-center'>
        <SampleDataTable items={items} tableStyle={tableStyle}/>
      </div>
    </div>
  );
}


export default App;
