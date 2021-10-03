import { useState } from 'react';
import './App.css';
import Filters from './components/Filters';
import PhotosContainer from './components/PhotosContainer';

const App = () => {
  const [ dataRetrieved, setDataRetrieved ] = useState( [] );
  const [ pagination, setPagination ] = useState( 1 );

  return (
    <div className="App">

      <header className="App-header">
        <h1>
          NASA API Challenge
        </h1>
      </header>

      <div className="main-container">

        <aside>
          <Filters
            dataRetrieved={ dataRetrieved }
            setDataRetrieved={ setDataRetrieved }
            pagination={ pagination }
            setPagination={ setPagination }
          />
        </aside>

        <section>
          {
            ( !!dataRetrieved && dataRetrieved.length > 0 ) 
            ? <PhotosContainer
                dataRetrieved={ dataRetrieved }
                pagination={ pagination }
                setPagination={ setPagination }                  
              />
            : <p>There are no results available for this particular query.</p>
          }
        </section>
      </div>
    </div>
  );
}

export default App;
