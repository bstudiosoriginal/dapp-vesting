// app/Navigation.js

import Link from 'next/link';


const Navigation = () => {
  return (
    <nav className="bg-gray-200 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <a className="text-blue-500 hover:underline">Home</a>
        </Link>
        <Link href="/admin">
          <a className="text-blue-500 hover:underline">Admin Page</a>
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
