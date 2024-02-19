import{ Link } from 'react-router-dom';

export default function Home() {
    return (
        <div>
            <h1>Choose your role</h1>
            <Link to="/staff">Staff</Link>
            <p>Hello this is  a test</p>
        </div>
    );
};