const cheerio = require("cheerio");
const axios = require("axios");


async function getPages(maxPages = 2) {
    const paginationURLsToVisit = "https://strefainwestorow.pl/dane/dywidendy/lista-dywidend";
    const pageHTML = await axios.get(paginationURLsToVisit);
    const $ = cheerio.load(String(pageHTML.data));
    const links = []

    $(".nav-pills li a").each((index, element) => {
        const paginationURL = $(element).attr("href");
        links.push(`https://strefainwestorow.pl${paginationURL}`)
    })
    return [...links]
}



module.exports = getPages;