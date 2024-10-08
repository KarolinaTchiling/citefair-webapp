import './Homepage.css';
import Textform from '../components/Textform';
import Circle from '../components//Circle'; 
import Upload from '../components/Upload';

const HomePage = () => {
    return (
        <div>
            <div className="header-with-circle">
                <Circle num={1} />
                <h1>Analyze your reference list</h1>
            </div>
            <div className="header-with-circle">
                <Circle num={2} />
                <h1>Diversify your research</h1>
            </div>
            <div className="header-with-circle">
                <Circle num={3} />
                <h1>Generate a Citation Diversity Statement</h1>
            </div>
            <br></br>

            <div className="input-div">
                <div className="textform">
                    <Textform />
                </div>
                <div className="upload">
                    <Upload />
                </div>
        </div>


        </div>
    );
};

export default HomePage;