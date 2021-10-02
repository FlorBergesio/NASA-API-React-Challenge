import { useState, useEffect, useCallback } from 'react';
import './App.css';
import RoverPhoto from './components/RoverPhoto';
import Button from './components/Button';

const App = () => {
  const [ dataRetrieved, setDataRetrieved ] = useState( [] );
  const [ rover, setRover ] = useState( 'curiosity' );
  /* const [ query, setQuery ] = useState({
    query: 'photos',
    filters: 'sol=1000'
  }); */
  const [ query, setQuery ] = useState({
    query: 'latest_photos',
    filters: ''
  });

  const fetchData = useCallback( async () => {
    const fetch_url = `${process.env.REACT_APP_NASA_API_URL}/${rover}/${query.query}?${query.filters !== "" ? ( query.filters + '&' ) : "" }api_key=${process.env.REACT_APP_NASA_API_KEY}`;
    const response = await fetch( fetch_url );
    const dataFromAPI = await response.json();
    if ( query.query === "latest_photos" ) {
      setDataRetrieved(dataFromAPI.latest_photos);
    } else {
      setDataRetrieved(dataFromAPI.photos);
    }
  }, [ rover, query ] );

  useEffect( () => {
    fetchData();
  }, [ fetchData ] );

  const changeRover = ( new_rover ) => {
    setRover( new_rover );
  };

  let content;

  if ( !!dataRetrieved && dataRetrieved.length > 0 ) {
    content = dataRetrieved.map( ( item ) => {
        return (
          <RoverPhoto
            key={ item.id }
            item={ item }
          />
        );
      }
    );
  } else {
    content = (
      <p>There are no results available.</p>
    );
  }

  return (
    <div className="App">

      <header className="App-header">
        <h1>
          NASA API Challenge
        </h1>
      </header>

      <div className="btn-container">
        <Button
          handleClick={ () => changeRover( "curiosity" ) }
          text="Curiosity"
        />
        <Button
          handleClick={ () => changeRover( "opportunity" ) }
          text="Opportunity "
        />
        <Button
          handleClick={ () => changeRover( "spirit" ) }
          text="Spirit"
        />
      </div>

      <div className="photos-by-rover">
        <h2>{ rover.charAt(0).toUpperCase() + rover.slice(1) }</h2>

        { content }

      </div>

    </div>
  );
}

export default App;
