# AntiGravity Notes Website

A premium, responsive, and dynamic website for Class 8-12 Physics, Chemistry, and Biology notes.

## How to Run
Simply open `index.html` in any modern web browser. No installation required.

## How to Add Notes
1. Open `data.js` in a text editor.
2. Find the class and subject you want to update.
3. Add a new chapter object to the `chapters` array:
   ```javascript
   {
       id: 5, // Next number
       title: "Name of the Chapter",
       content: "Your detailed notes here..."
   }
   ```
4. Save the file and refresh the browser.

## Features
- **Dynamic Routing**: Single Page Application feel without complex setup.
- **Glassmorphism Design**: Modern UI with dark mode.
- **Responsive**: Works on mobile and desktop.
- **Easy Expansion**: Just edit `data.js`.
