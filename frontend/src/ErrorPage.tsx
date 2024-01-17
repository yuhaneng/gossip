import { Link } from "react-router-dom";

export default function ErrorPage() {
    return (
        <div>
            <h1>Error</h1>
            <h1>404: Not Found</h1>
            <Link to="/posts"><p>Return to Posts</p></Link>
        </div>
    )
}