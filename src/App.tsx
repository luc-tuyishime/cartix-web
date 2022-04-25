import React from 'react';

function App() {
  return (
    <div className="App">
        <section className="flex items-center justify-center w-full h-screen bg-green-500 App">
      <div className="w-full max-w-md bg-gray-800" >
        <form action="" className="px-8 py-8 pt-8 bg-white rounded shadow-md ">
          <div className="px-4 pb-4">
            <label htmlFor="email" className="block pb-2 text-sm font-bold">EMAIL ADDRESS</label>
            <input type="email" name="email" id="" className="w-full px-3 py-2 leading-tight text-gray-700 border border-blue-300 rounded shadow appearance-none focus:outline-none focus:shadow-outline " placeholder="Johnbull@example.com" />
          </div>
          <div className="px-4 pb-4">
            <label htmlFor="password" className="block pb-2 text-sm font-bold">PASSWORD</label>
            <input type="password" name="email" id="" className="w-full px-3 py-2 leading-tight text-gray-700 border border-blue-300 rounded shadow appearance-none focus:outline-none focus:shadow-outline" placeholder="Enter your password" />
          </div>
          <div>
            <button className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline" type="button">Sign In</button>
          </div>
        </form>
      </div>
    </section>
    </div>
  );
}

export default App;
