import '../App.css';
import Textform from '../components/Textform';
import Circle from '../components//Circle'; 

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

            <Textform />
        </div>
    );
};

export default HomePage;