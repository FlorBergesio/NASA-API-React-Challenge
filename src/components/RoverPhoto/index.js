import './index.css';

const RoverPhoto = ( { item } ) => {
    return (
        <div className="RoverPhoto">
            <h2>{ item.id }</h2>
            <img className="RoverPhoto-img"
            src={ item.img_src }
            alt={ item.id }
            />
        </div>
    );
}

export default RoverPhoto;
