import Users from "./Users";
import { Link } from "react-router-dom";

function admin() {
  console;
  return (
    <section>
      <h1>Admin Page</h1>
      <br />
      <Users />
      <br />
      <div className="flexGrow">
        <Link to="/">Home</Link>
      </div>
    </section>
  );
}

export default admin;
