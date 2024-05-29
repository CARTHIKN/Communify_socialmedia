import React from 'react'

function LoginNavbar() {
  return (
    <div className="">
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end">
            <a href="/" className="flex ms-2 md:me-24">
              {/* <img
                src="https://flowbite.com/docs/images/logo.svg"
                className="h-8 me-3"
                alt="FlowBite Logo"
              /> */}
              <span className="self-center text-xl ml-7 font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                Communify
              </span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  </div>
  )
}

export default LoginNavbar
