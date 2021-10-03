import Button from '../Button';

const PaginationButtons = ( { pagination, setPagination, totalPhotos } ) => (
    <div className="PaginationButtons">
        { pagination > 1 &&
        <Button
            handleClick={ () => setPagination( ( current ) => ( current - 1 ) ) }
            text="Previous page"
        />
        }
        { totalPhotos > (pagination*25) &&
        <Button
            handleClick={ () => setPagination( ( current ) => ( current + 1 ) ) }
            text="Next page"
        />
        }
    </div>
);

export default PaginationButtons;