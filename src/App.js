import { useState, useEffect, useCallback } from 'react';
import './App.css';
import RoverPhoto from './components/RoverPhoto';
import Button from './components/Button';

const camerasByRoverList = {
  curiosity: [
    "FHAZ",
    "RHAZ",
    "MAST",
    "CHEMCAM",
    "MAHLI",
    "MARDI",
    "NAVCAM"
  ],
  opportunity: [
    "FHAZ",
    "RHAZ",
    "NAVCAM",
    "PANCAM",
    "MINITES"
  ],
  spirit: [
    "FHAZ",
    "RHAZ",
    "NAVCAM",
    "PANCAM",
    "MINITES"
  ]
};

const App = () => {
  const [ dataRetrieved, setDataRetrieved ] = useState( [] );
  const [ rover, setRover ] = useState( 'curiosity' );
  const [ availableCameras, setAvailableCameras ] = useState( camerasByRoverList.curiosity );
  const [ latestSolByRover, setLatestSolByRover ] = useState();

  const [ error, setError ] = useState();

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
    console.log(dataFromAPI);
    
    if ( !!dataFromAPI.error ) {
      setError("Demo Api key has reached the limit. Please use a different key");
      return;
    }
   
    if ( query.query === "latest_photos" ) {
      setDataRetrieved(dataFromAPI.latest_photos);
      setLatestSolByRover(dataFromAPI.latest_photos[0].sol);
    } else {
      setDataRetrieved(dataFromAPI.photos);
    }
  }, [ rover, query ] );

  useEffect( () => {
    // Get api results
    fetchData();
  }, [ fetchData ] );

  useEffect( () => {
    // Change available cameras
    setAvailableCameras( camerasByRoverList[rover] );
  }, [ rover ] );

  const changeRover = ( new_rover ) => {
    setRover( new_rover );
    setQuery( {
      query: 'latest_photos',
      filters: ''
    } );
  };

  const changeQuery = ( new_query ) => {
    setQuery( new_query );
  };

  return (
    <div className="App">

      <header className="App-header">
        <h1>
          NASA API Challenge
        </h1>
      </header>

      <div className="btn-container">
        <h2>Choose a rover</h2>

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

      <div className="btn-container">
        <h2>Choose a camera</h2>
        
        {
          availableCameras.map(( item ) => {
            return (
              <Button
                handleClick={ () => changeQuery( {
                  query: 'photos',
                  filters: `sol=${latestSolByRover}&camera=${item}`
                } ) }
                text={ item }
              />
            );
          })
        }
      </div>

      <div className="query-info">
        <h2>Query Info</h2>
        {
          !!error &&
          (
            <div className="error">
              <p>{ error }</p>
            </div>
          )
        }
        Selected rover: { rover }
        {
          query.query === "latest_photos" 
          ? <p>You are looking at the latest photos of the rover.</p>
          : <p>You are looking at every photo that matches the query: {query.filters}</p>
        }
      </div>

      <div className="photos-by-rover">
        <h2>{ rover.charAt(0).toUpperCase() + rover.slice(1) }</h2>

        {
          ( !!dataRetrieved && dataRetrieved.length > 0 ) 
          ? dataRetrieved.map( ( item ) => {
              return (
                <RoverPhoto
                  key={ item.id }
                  item={ item }
                />
              );
            })
          : <p>There are no results available for this particular query.</p>
        }

      </div>

    </div>
  );
}

export default App;
