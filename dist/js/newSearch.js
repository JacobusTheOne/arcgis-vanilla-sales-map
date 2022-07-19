/* //for Sale form submission
$("#for-sale").submit(function (event) {
  ForSale($(this).serializeArray());
  event.preventDefault();
});
//unit search form submission
$("#unit-search").submit(function (event) {
  console.log($(this).serializeArray());
  event.preventDefault();
});
const priceRange = {
  min: 0,
  max: 0,
};
const bedroomRange = {
  min: 0,
  max: 0,
};
const bathroomRange = {
  min: 0,
  max: 0,
};
function changeSrc(loc) {
  currentLocation = loc;
  window.parent.document.getElementById("pages").src = loc; //change this
}
function ForSale(jsonObject) {
  const ForSaleObject = {
    estates: "0",
    "property-type-any": "0",
    "property-type-house": "0",
    "property-type-apartment": "0",
    "property-type-estate": "0",
    "price-range-value": "0",
    "bedroom-range-value": "0",
    "bathroom-range-value": "0",
  };
  changeSrc("../../dist/pages/areas/searchResults.html");
  $(document).ready(function () {
    const div = document.createElement("div");
  });
  $("body").append('<table id="main-table"></table>');
  $("main-table").append("<tbody></tbody>");
  $("tbody").append("<tr></tr>");
  $("tr").append(
    "<th>Unit</th>",
    "<th>Type</th>",
    "<th>Size sqm</th>",
    "<th>Price</th>"
  );
  jsonObject.forEach((item) => {
    ForSaleObject[item.name] = item.value;
  });
  console.log(ForSaleObject);
  priceRange.min = parseInt(
    ForSaleObject["price-range-value"].split(" - ").at(0).slice(1)
  );
  priceRange.max = parseInt(
    ForSaleObject["price-range-value"].split(" - ").at(1).slice(1)
  );
  bedroomRange.min = parseInt(
    ForSaleObject["bedroom-range-value"].split(" - ").at(0)
  );
  bedroomRange.max = parseInt(
    ForSaleObject["bedroom-range-value"].split(" - ").at(1)
  );
  bathroomRange.min = parseInt(
    ForSaleObject["bathroom-range-value"].split(" - ").at(0)
  );
  bathroomRange.max = parseInt(
    ForSaleObject["bathroom-range-value"].split(" - ").at(1)
  );

  d3.csv("../../data/GreaterVDV_SIMS_Combined.csv", function (data) {
    let temp;
    for (let i = 0; i < data.length; i++) {
      temp = data[i].PropertyType.toLowerCase();
      if (
        priceRange.min <= parseInt(data[i].PriceVAT) &&
        priceRange.max >= parseInt(data[i].PriceVAT) &&
        bedroomRange.min <= parseInt(data[i].Bedrooms) &&
        bedroomRange.max >= parseInt(data[i].Bedrooms) &&
        bathroomRange.min <= parseInt(data[i].Bathrooms) &&
        bathroomRange.max >= parseInt(data[i].Bathrooms)
      ) {
        if (temp == "any" && estates["property-type-any"] != "0") {
          $("#main-table")
            .find("tbody")
            .append("<tr></tr>")
            .append(
              `<td>${data[i].Label}</td>`,
              `<td>${data[i].PropertyType}</td>`,
              `<td>${data[i].Size}</td>`,
              `<td>${data[i].PriceVAT}</td>`
            );
        } else if (
          (temp == "house" || temp == "stand" || temp == "building") &&
          estates["property-type-house"] != "0"
        ) {
          $("#main-table")
            .find("tbody")
            .append("<tr></tr>")
            .append(
              `<td>${data[i].Label}</td>`,
              `<td>${data[i].PropertyType}</td>`,
              `<td>${data[i].Size}</td>`,
              `<td>${data[i].PriceVAT}</td>`
            );
        } else if (
          temp == "apartment" &&
          estates["property-type-apartment"] != "0"
        ) {
          $("#main-table")
            .find("tbody")
            .append("<tr></tr>")
            .append(
              `<td>${data[i].Label}</td>`,
              `<td>${data[i].PropertyType}</td>`,
              `<td>${data[i].Size}</td>`,
              `<td>${data[i].PriceVAT}</td>`
            );
        } else if (temp == "estate" && estates["property-type-estate"] != "0") {
          $("#main-table")
            .find("tbody")
            .append("<tr></tr>")
            .append(
              `<td>${data[i].Label}</td>`,
              `<td>${data[i].PropertyType}</td>`,
              `<td>${data[i].Size}</td>`,
              `<td>${data[i].PriceVAT}</td>`
            );
        }
      }
    }
  });
}
 */
