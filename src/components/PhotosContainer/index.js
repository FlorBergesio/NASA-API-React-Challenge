import RoverPhoto from '../RoverPhoto';
import PaginationButtons from '../PaginationButtons';

const PhotosContainer = ( { dataRetrieved, pagination, setPagination } ) => {
    return (
        <div className="PhotosContainer">
            <PaginationButtons
                pagination={ pagination }
                setPagination={ setPagination }
                totalPhotos={ dataRetrieved.length }
            />

            <div className="photos-by-rover">
            {
                dataRetrieved.map( ( item, key ) => {
                if ( key < ( 25*pagination ) && key >= ( 25*(pagination - 1 ) )  ) {
                    return (
                    <RoverPhoto
                        key={ item.id }
                        item={ item }
                    />
                    );
                }
                return false;
                })
            }
            </div>

            <PaginationButtons
                pagination={ pagination }
                setPagination={ setPagination }
                totalPhotos={ dataRetrieved.length }
            />
        </div>
    );
};

export default PhotosContainer;