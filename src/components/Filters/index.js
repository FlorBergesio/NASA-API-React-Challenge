import './index.css';
import { useState, useEffect, useCallback } from 'react';
import camerasByRoverList from '../../camerasByRoverList';

const Filters = ( { dataRetrieved, setDataRetrieved, setPagination } ) => {
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
    }, [ rover, query, setDataRetrieved ] );

    useEffect( () => {
        // Get api results
        fetchData();
    }, [ fetchData ] );

    useEffect( () => {
        // Reset parameters on rover change
        // Change available cameras
        setAvailableCameras( camerasByRoverList[rover] );
        // Reset query
        setQuery( {
            query: 'latest_photos',
            sol: '',
            camera: '',
            earth_date: ''
        } );
    }, [ rover ] );

    useEffect( () => {
        // Reset pagination on query change
        setPagination(1);
    }, [ query, setPagination ] );

    const changeRover = ( new_rover ) => {
        setRover( new_rover );
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
        <div className="Filters">

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

                <p>Selected rover: { rover.charAt(0).toUpperCase() + rover.slice(1) }</p>

                {
                    query.query === "latest_photos" 
                    ? (
                        <>
                            <p>You are looking at the latest photos of the rover.</p>

                            <table>
                                <tr>
                                    <th>Sol</th>
                                    <th>Results</th>
                                </tr>
                                <tr>
                                    <td>{ latestSolByRover ? latestSolByRover : "N/A" }</td>
                                    <td>{ dataRetrieved ? dataRetrieved.length : "0" }</td>
                                </tr>
                            </table>
                        </>
                    )
                    : (
                        <>
                            <p>You are looking at every photo that matches the query: </p>

                            <table>
                                <tr>
                                    <th>Cam</th>
                                    <th>Sol</th>
                                    <th>Date</th>
                                    <th>Results</th>
                                </tr>
                                <tr>
                                    <td>{ query.camera ? query.camera : "N/A" }</td>
                                    <td>{ query.sol ? query.sol : "N/A" }</td>
                                    <td>{ query.earth_date ? query.earth_date : "N/A" }</td>
                                    <td>{ dataRetrieved ? dataRetrieved.length : "0" }</td>
                                </tr>
                            </table>
                        </>
                    )
                }
            </div>

            <h2>Filters</h2>
            <div>
                <p><strong>Choose a rover</strong></p>
                
                <select name="rover" id="rover"
                    onChange={ ( event ) => changeRover( event.target.value ) }
                >
                    <option value="curiosity">Curiosity</option>
                    <option value="opportunity">Opportunity</option>
                    <option value="spirit">Spirit</option>
                </select>
            </div>

            <div>
                <p><strong>Choose a camera</strong></p>

                <select name="camera" id="camera"
                    onChange={ ( event ) => changeQuery( {
                        camera: event.target.value
                    } ) }
                >
                    {
                        availableCameras.map(( item ) => {
                            return ( <option value={ item }>{ item }</option> );
                        })
                    }
                </select>
            </div>

            <div className="date-input-container">
                <p><strong>Choose a date</strong></p>

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
        </div>
    );
};

export default Filters;