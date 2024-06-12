export default function Header() {

  const username = 'User'; // TO DO: AppSync connection fix

  return (
    <header className='bg-neutral py-2 sticky top-0 z-50'>
      <div className='container'>
        <div className="navbar px-0">
          <div className="navbar-start">
            <a href='/'>
              <img src="/ticketsaver-logo.svg" className="max-h-12"/>
            </a>
          </div>
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal p-0 font-medium">
              <li><a href="/events">Events</a></li>
              <li><a href="#!">Venues</a></li>
              <li><a href="#!">About</a></li>
            </ul>
          </div>
          <div className="navbar-end">
            {username?(
              <div className='dropdown dropdown-end'>
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    <img alt="Tailwind CSS Navbar component" src='/user.png' />
                  </div>
                </div>
                <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                  <li>
                    <a className="justify-between">
                      {username}
                      <span className="badge">user</span>
                    </a>
                  </li>
                  <li><a >My tickets</a></li>
                  <li><a >Logout</a></li>
                </ul>
              </div>
            ):(
              <></>
              // TO DO: AppSync connection fix
              // <a href="/login">
              //   <button className="btn btn-primary btn-outline mr-100">Log In</button>
              // </a>
              )
            }
            <div className="dropdown">
              <label tabIndex={0} className="btn btn-circle btn-primary lg:hidden mr-1">
                <i className='bi bi-list text-2xl'></i>
              </label>
              <ul tabIndex={0} className="dropdown-content mt-1 w-52 menu menu-compact p-2 bg-base-200 shadow rounded-box right-0 left-auto origin-top-right absolute">
                <li><a href="#!">Home</a></li>
                <li><a href="#!">Services</a></li>
                <li><a href="#!">About</a></li>
                <li><a href="#!">Work</a></li>
                <li><a href="#!">Case Study</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
