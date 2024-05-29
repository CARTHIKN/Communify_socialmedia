/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      height: {
        'custom': '765px',
        'custom2': '750px', 
        'custom3' : '500px',
        'custom4' : '20px',
        'custom5' :"600px",
        'custom6' : "450px",
        'custom7' :"800px",
        


      },
      fontSize: {
        'smaller': '0.6rem', // Customize the size as needed
      },
      margin: {
        'custom': '42rem', 
        'custom1': '48rem',
        'custom2': '47rem', 


      },
    },
  },
  plugins: [],
}

