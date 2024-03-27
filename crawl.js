const getdata = require("./getdata");

async function main() {
  const dividends = await getdata();



  console.log("\n");
  console.log("\n");
  console.log("\n");
  console.log(`${new Date().getFullYear()} Dividends`);
  console.table(dividends);
  console.log("\n");
  console.log("\n");
  console.log("\n");
}

main()
  .then(() => {
    // successful ending
    process.exit(0);
  })
  .catch((e) => {
    // logging the error message
    console.error(e);

    // unsuccessful ending
    process.exit(1);
  });
