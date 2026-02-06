// Make sure global cache exists
if (!window.pandaJsonCache) {
    window.pandaJsonCache = {
      correct: null,
      incorrect: null,
    };
  }
  
  export async function loadPandaJson(type) {
    const urls = {
      correct: "https://d2jhdcglwxx007.cloudfront.net/lottie-json/Correct_panda.json",
      incorrect: "https://d2jhdcglwxx007.cloudfront.net/lottie-json/Wrong_Panda.json",
    };
  
    // Return from global cache
    if (window.pandaJsonCache[type]) {
      return window.pandaJsonCache[type];
    }
  
    try {
      const res = await fetch(urls[type]);
      const json = await res.json();
  
      // Save into global cache
      window.pandaJsonCache[type] = json;
  
      return json;
    } catch (err) {
      console.error("Error loading panda json:", err);
      return null;
    }
  }
  