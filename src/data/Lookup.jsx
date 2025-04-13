export default {

  SIGNIN_HEADING: "Continue With Bolt.New 2.0",

  SIGNIN_SUBHEADING: "To use Bolt you must log into an existing account.",

  SIGNIN_AGREEMENT_TEXT: "By using Bolt, you agree to the collection of data.",

  DEMO: {

    projectTitle: "React ToDo App",

    description: "A basic ToDo App in React with Tailwind CSS.",

    defaultFiles: {

      defaultFiles: {
        "/tailwind.config.js": {
          code: `
            /** @type {import('tailwindcss').Config} */
            module.exports = {
              content: [
                "./src/**/*.{js,jsx,ts,tsx}",
              ],
              theme: {
                extend: {},
              },
              plugins: [],
            };
          `
        },
      
        "/postcss.config.js": {
          code: `
            /** @type {import('postcss-load-config').Config} */
            const config = {
              plugins: {
                tailwindcss: {},
                autoprefixer: {},
              },
            };
      
            export default config;
          `
        }
      }
      
    },

    DEPENDENCY: {

      "postcss": "^8",
      "react": "^18.3.1",
      "react-dom": "^18.3.1",

      "tailwindcss": "^3.4.1",

      "autoprefixer": "^10.0.0",

      "tailwind-merge": "^2.4.0",

      "tailwindcss-animate": "^1.0.7",

      "lucide-react": "latest",
      "chess.js": "^1.2.0",

      "react-router-dom": "latest",

      "firebase": "^11.1.0",

      "@google/generative-ai": "^0.21.0"

    }

  },

};