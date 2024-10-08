import './Upload.css'; 
import { FaUpload } from "react-icons/fa6";

const Upload = () => {
    return (
        <div className="upload">
            <div>
                or upload .bib file
            </div>
            <button>
                <FaUpload />
            </button>

        </div>
    );
  };
  
  export default Upload;