//import libraries
const axios = require('axios');
//what is axios library?
//axios is a promise based HTTP client for the browser and node.js
//it is used to make HTTP requests from node.js

const cheerio = require('cheerio');
//what is cheerio library?
//cheerio is a library that allows us to use jQuery syntax to parse HTML
//it is used to parse and manipulate HTML

async function main(maxPages=50){
    console.log("Hello World!")
    //pageToVisit
    const pagesToVisit = ["https://scrapeme.live/shop/"];
    const visitedURLS=[];

    const productURLs = new Set();

    //iterate till maxPages or will queue is empty
    while(
        pagesToVisit.length > 0 &&
        visitedURLS.length <= maxPages
    ){
        //pop front of queue
        const pageURL=pagesToVisit.pop();

        //download HTML content from webpage
        const pageHTML = await axios.get(pageURL);
        
        //marks as visited
        visitedURLS.push(pageURL);

        //init cheerio
        const $ = cheerio.load(pageHTML.data);

        //retreiving pagination links
        $(".page-numbers a").each((index,element) => {
            const paginationURL= ($(element).attr('href'));
            if(!visitedURLS.includes(paginationURL) && !pagesToVisit.includes(paginationURL))
            {
                pagesToVisit.push(paginationURL);
            }
        });
        //we are using jQuery syntax to select all elements with class page-numbers a
        //then we are looping through each element
        //for each element we are printing the href attribute
        //the href attribute contains the link to the next page

        //product links
        $("li.product a.woocommerce-LoopProduct-link").each((index,element) => {
            const productURL=($(element).attr('href'));
            productURLs.add(productURL);
        });

        //log crawling results
        
    }
    console.log([...productURLs]);
}
main(10).then(() => {
    console.log("Crawling completed!");
    process.exit(0)
});



