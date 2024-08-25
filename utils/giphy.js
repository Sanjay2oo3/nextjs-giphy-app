// export const searchGifs = async (query) => {
//     const API_KEY = process.env.NEXT_PUBLIC_GIPHY_API_KEY; // Store the API key in your .env file
//     const response = await fetch(
//       `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${query}&limit=25&offset=0&rating=g&lang=en`
//     );
//     const data = await response.json();
//     return data.data;
//   };
  // utils/giphy.js

  export const searchGifs = async (query) => {
    const apiKey = process.env.NEXT_PUBLIC_GIPHY_API_KEY;
    const url = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${query}&limit=25&offset=0&rating=g&lang=en`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.data; // Return the GIFs array
    } catch (error) {
      console.error('Error fetching GIFs:', error);
      return [];
    }
  };
  
  // If you have another function, export it here as well
  export const searchGifsById = async (id) => {
    const apiKey = process.env.NEXT_PUBLIC_GIPHY_API_KEY;
    const url = `https://api.giphy.com/v1/gifs/${id}?api_key=${apiKey}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.data; // Return the single GIF object
    } catch (error) {
      console.error('Error fetching GIF by ID:', error);
      return null; // Return null in case of error
    }
  };
  
  