import { Filter, Search, User } from "lucide-react";
import { useState } from "react";

function Navbar() {
  const [categories] = useState(["Technology", "Sports", "Health", "Business"]); // Example categories

  return (
    <header className="bg-red-400 h-16 items-center px-4">
      <div className="flex">
        <input className="" type="text" name="" id="" />
        <Search />
      </div> 
    </header>
  );
}

export default Navbar;
