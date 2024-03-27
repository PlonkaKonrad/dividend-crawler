const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs");

async function getData() {
  const paginationURLsToVisit = [
    "https://strefainwestorow.pl/dane/dywidendy/lista-dywidend/2024",
  ];

  const dividendsList = [];

  while (paginationURLsToVisit.length !== 0) {
    const paginationURL = paginationURLsToVisit.pop();
    const pageHTML = await axios.get(paginationURL);
    const $ = cheerio.load(String(pageHTML.data));

    $("tbody tr").each((index, element) => {
      const a = $(element).attr("href");
      let dividend = {
        shortName: "",
        symbol: "",
        name: "",
        dividendDay: "",
        dividendRate: "",
        payoutDate: "",
        dividendPerAction: "",
        stockPrice: "",
      };

      $(element)
        .find(".views-field-field-instrument-short-name")
        .each((index, e) => {
          dividend.shortName = $(e).text();
        });
      $(element)
        .find(".views-field-symbol")
        .each((index, e) => {
          dividend.symbol = $(e).text();
        });
      $(element)
        .find(".views-field-field-instrument-name")
        .each((index, e) => {
          dividend.name = $(e).text();
        });
      $(element)
        .find(".views-field-last-day")
        .each((index, e) => {
          dividend.dividendDay = $(e).text();
        });
      $(element)
        .find(".views-field-yeld")
        .each((index, e) => {
          dividend.dividendRate = $(e).text();
        });
      $(element)
        .find(".views-field-dividend")
        .each((index, e) => {
          dividend.dividendPerAction = $(e).text();
        });
      $(element)
        .find(".views-field-payout-day-to-show")
        .each((index, e) => {
          dividend.payoutDate = $(e).text();
        });

      if (
        dividend.shortName &&
        dividend.symbol &&
        dividend.name &&
        dividend.dividendDay &&
        dividend.dividendRate &&
        dividend.payoutDate &&
        dividend.dividendPerAction
      ) {
        const numDividendRate = parseFloat(
          dividend.dividendRate.replace(",", ".")
        );
        const numDividendPerAction = parseFloat(
          dividend.dividendPerAction.replace(",", ".")
        );
        const divi = dividend;
        divi.stockPrice = Number(
          (numDividendPerAction / numDividendRate) * 100
        ).toFixed(2);


        dividendsList.sort((a, b) => { return new Date(a.dividendDay) - new Date(b.dividendDay); });

        dividendsList.push(divi);
      }
    });
  }

  return dividendsList;
}



module.exports = getData;
