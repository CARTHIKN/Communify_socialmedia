import React from 'react'

function TextInput() {
  return (
    <div className="flex">
  <input
    className="w-full bg-gray-300 py-3 px-3 rounded-xl mr-4"
    type="text"
    placeholder="Type your message here..."
  />
  <button
    type="button"
    className="text-white bg-blue-400  hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-3 me-2 mr-5  dark:bg-blue-400 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
  >
    Send
  </button>
</div>
  )
}

export default TextInput
