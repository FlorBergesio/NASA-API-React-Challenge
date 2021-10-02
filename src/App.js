import { useState, useEffect, useCallback } from 'react';
import './App.css';
import RoverPhoto from './components/RoverPhoto';
import Button from './components/Button';
import camerasByRoverList from './camerasByRoverList';

const App = () => {
  const [ dataRetrieved, setDataRetrieved ] = useState( [] );
  const [ rover, setRover ] = useState( 'curiosity' );
  const [ availableCameras, setAvailableCameras ] = useState( camerasByRoverList.curiosity );
  const [ latestSolByRover, setLatestSolByRover ] = useState();

  const [ error, setError ] = useState();

  const [ query, setQuery ] = useState({
    query: 'latest_photos',
    sol: '',
    camera: '',
    earth_date: ''
  });

  const fetchData = useCallback( async () => {
    const fetch_url = `${process.env.REACT_APP_NASA_API_URL}/${rover}/${query.query}?${query.sol !== "" ? ( 'sol=' + query.sol + '&' ) : "" }${query.earth_date !== "" ? ( 'earth_date=' + query.earth_date + '&' ) : "" }${query.camera !== "" ? ( 'camera=' + query.camera + '&' ) : "" }api_key=${process.env.REACT_APP_NASA_API_KEY}`;
    
    const response = await fetch( fetch_url );
    const dataFromAPI = await response.json();
    
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
      sol: '',
      camera: '',
      earth_date: ''
    } );
  };

  const changeQuery = ( new_query ) => {
    let modified_query = { ...new_query };
    // If there is no info on the date, default to latest sol
    if ( new_query.sol === undefined && query.sol === "" && new_query.earth_date === undefined && query.earth_date === "" ) {
      modified_query = {
        ...modified_query,
        sol: latestSolByRover
      };
    } else {
      // If there is info on the sol date, override every other date
      if ( new_query.sol !== undefined) {
        modified_query = {
          ...modified_query,
          sol: new_query.sol,
          earth_date: ""
        };
      } else {
        // If there is info on the earth date, override every other date
        if ( new_query.earth_date !== undefined) {
          modified_query = {
            ...modified_query,
            sol: "",
            earth_date: new_query.earth_date
          };
        }
      }
    }
    setQuery( ( current ) => ({ 
      ...current,
      ...modified_query,
      query: 'photos'
    }) ); 
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
                  camera: item
                } ) }
                text={ item }
              />
            );
          })
        }
      </div>

      <div className="date-input-container">
        <h2>Choose a date</h2>
        <p>Sol</p>
        <input
          type="number" name="sol" min="1"
          max={latestSolByRover}
          value={query.sol}
          onChange={ ( event ) => changeQuery( {
            sol: event.target.value
          } ) }
        />
        <p>Earth date</p>
        <input
          type="date" name="earth_date"
          value={query.earth_date}
          onChange={ ( event ) => changeQuery( {
            earth_date: event.target.value
          } ) }
        />
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
        Selected rover: { rover.charAt(0).toUpperCase() + rover.slice(1) }
        {
          query.query === "latest_photos" 
          ? <p>You are looking at the latest photos of the rover.</p>
          : (
              <>
                <p>You are looking at every photo that matches the query: </p>
                <p>Camera: { query.camera ? query.camera : "No info" }</p>
                <p>Sol: { query.sol ? query.sol : "No info" }</p>
                <p>Earth date: { query.earth_date ? query.earth_date : "No info" }</p>
              </>
            )
        }
      </div>

      <div className="photos-by-rover">
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
