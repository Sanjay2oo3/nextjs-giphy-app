  export const searchGifs = async (query) => {
    const apiKey = process.env.NEXT_PUBLIC_GIPHY_API_KEY || GlVGYHkr3WSBnllca54iNt0yFbjz7L65;
    const url = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${query}&limit=25&offset=0&rating=g&lang=en`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.data; 
    } catch (error) {
      console.error('Error fetching GIFs:', error);
      return [];
    }
  };
  
  export const searchGifsById = async (id) => {
    const apiKey = process.env.NEXT_PUBLIC_GIPHY_API_KEY || GlVGYHkr3WSBnllca54iNt0yFbjz7L65;
    const url = `https://api.giphy.com/v1/gifs/${id}?api_key=${apiKey}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.data; 
    } catch (error) {
      console.error('Error fetching GIF by ID:', error);
      return null; 
    }
  };
  
  