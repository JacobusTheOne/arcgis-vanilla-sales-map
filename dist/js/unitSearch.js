const houseStatus = {
  Unreleased: [99, 97, 97], //dark grey

  Sold: [255, 0, 0], //red

  Available: [0, 255, 0], //green

  Other: [0, 0, 255], //blue

  Transferred: [249, 105, 14], //orange

  Reserved: [191, 85, 236], //purple
};

function ChangeUnitContent(
  housenumber,
  size,
  price,
  houseStatusString,
  bedrooms,
  bathrooms,
  garages,
  propertyType,
  housePhotos
) {
  let housePhotosArray = HousePhotosArray(housePhotos, preLoad);
  $(document).ready(function () {
    $("#unitDetails").append('<div id="gallery" class="house-images"></div>');
    for (let i = 0; i < housePhotosArray.length; i++) {
      if (i == 0) {
        $("#gallery").append(
          `<img id="a" src=${housePhotosArray[i]} alt="1M8A1727" >`
        );
      } else {
        $("#gallery").append(
          `<img id="a" style="display: none;"src=${housePhotosArray[i]} alt="1M8A1847" >`
        );
      }
    }
    /* $("#gallery").append(
      `<img id="a" src="https://i.ibb.co/Sxxg0SK/1M8A1727.jpg" alt="1M8A1727" >`,
      `<img id="a" style="display: none;"src="https://i.ibb.co/mS58Fd9/1M8A1847.jpg" alt="1M8A1847" >`,
      `<img  id="a"style="display: none;"src="https://i.ibb.co/6r4phXY/1M8A6060.jpg" alt="1M8A6060" >`
    ); */
    $("#unitDetails").append('<div class="some-class"></div>');
    for (let i = 0; i < housePhotosArray.length; i++) {
      $(".some-class").append(
        `<input
      type="radio"
      class="radio"
      name="x"
      value="y"
      id="a${i}"
      onClick="im('a${i}');"
      checked
    />`
      );
    }
    /* $(".some-class").append(
      `<input
    type="radio"
    class="radio"
    name="x"
    value="y"
    id="a1"
    onClick="im('a1');"
    checked
  />`,
      `
  <input
    type="radio"
    class="radio"
    name="x"
    value="y"
    id="a2"
    onClick="im('a2');"
  />`,
      `
  <input
    type="radio"
    class="radio"
    name="x"
    value="y"
    id="a3"
    onClick="im('a3');"
  />`
    ); */
    $("#unitDetails").after('<section id="unit-specification"></section>');
    $("#unit-specification").append(
      "<section id='unit-specification-sub'></section>"
    );
    $(`#unit-specification-sub`).append(
      `<div id="unit-specification-sub-a" class="grid-one-column-container"></div>`
    );
    /* $(`#unit-specification-sub-a`).append(
      `<div class="grid-item bathroom" ></div>`,
      `<div class="grid-item bedroom"  ></div>`,
      `<div class="grid-item garage" ></div>`
    ); */
    if (parseInt(bathrooms) > 0) {
      $(`#unit-specification-sub-a`).append(
        `<i class="fa fa-bath lg" aria-hidden="true">  ${bathrooms}</i>`
      );
    }
    if (parseInt(bedrooms) > 0) {
      $(`#unit-specification-sub-a`).append(
        `<i class="fa fa-bed lg" aria-hidden="true">  ${bedrooms}</i>`
      );
    }
    if (parseInt(garages) > 0) {
      $(`#unit-specification-sub-a`).append(
        `<i class="fa fa-car lg" aria-hidden="true">  ${garages}</i>`
      );
    }
    $("#unit-specification-sub").append(
      `<div id="unit-specification-sub-b" class="grid-two-column-container unit-detail"></div>`
    );
    $(`#unit-specification-sub-b`).append(
      `<div class="grid-item left">Unit</div>`,
      `<div class="grid-item right">${housenumber}</div>`,
      `<div class="grid-item left">Unit Type</div>`,
      `<div class="grid-item right">${propertyType}</div>`,
      `<div class="grid-item left">Floor</div>`,
      `<div class="grid-item right">Ground Floor</div>`
    );
    if (parseInt(price) > 0) {
      $(`#unit-specification-sub-b`).append(
        `<div class="grid-item left">Price</div>`,
        `<div class="grid-item right">R${price}</div>`
      );
    }
    $(`#unit-specification-sub`).append(
      `<div id="unit-specification-sub-c" class="grid-two-column-container unit-sale-status"></div>`
    );
    if (houseStatusString == "available") {
      $(`#unit-specification-sub-c`).append(
        `<div  id="unit-specification-sub-c-a" class="grid-item left available">Available</div>`
      );
    }
    if (houseStatusString == "sold") {
      $(`#unit-specification-sub-c`).append(
        `<div  id="unit-specification-sub-c-a " class="grid-item left sold">Sold</div>`
      );
    }
    if (houseStatusString == "unreleased") {
      $(`#unit-specification-sub-c`).append(
        `<div  id="unit-specification-sub-c-a " class="grid-item left unreleased">Unreleased</div>`
      );
    }
    if (houseStatusString == "reserved") {
      $(`#unit-specification-sub-c`).append(
        `<divid="unit-specification-sub-c-a " class="grid-item left reserved">Reserved</divid=>`
      );
    }
    if (houseStatusString == "other") {
      $(`#unit-specification-sub-c`).append(
        `<div id="unit-specification-sub-c-a " class="grid-item left other">Unavailable</div>`
      );
    }
    if (houseStatusString == "transferred") {
      $(`#unit-specification-sub-c`).append(
        `<div  id="unit-specification-sub-c-a " class="grid-item left transferred">Transferred</div>`
      );
    }
    $(`#unit-specification-sub-c`).append(
      `<div id="unit-specification-sub-c-b"  class="grid-item right"></div>`
    );
    $(`#unit-specification-sub-c-b`).append(
      `<a href="#unit-specification-sub4" class="btn btn-primary">Enquire</a>`
    );
    //FURTHER HOUSE SPECIFICATIONS
    $(`#unit-specification`).append(`<div id="unit-specification-sub2"></div>`);
    $(`#unit-specification-sub2`).append(
      `<div id="unit-specification-sub2-a" class="grid-two-column-container unit-detail"></div>`
    );
    if (parseInt(size) > 0) {
      $(`#unit-specification-sub2-a`).append(
        `<div class="grid-item left">Plan Size</div>`,
        `<div class="grid-item right">${size} sqm</div>`
      );
    }
    if (parseInt(bedrooms) > 0) {
      $(`#unit-specification-sub2-a`).append(
        `<div class="grid-item left">Bedrooms</div>`,
        `<div class="grid-item right">${bedrooms}</div>`
      );
    }
    if (parseInt(bathrooms) > 0) {
      $(`#unit-specification-sub2-a`).append(
        `<div class="grid-item left">Bathrooms</div>`,
        `<div class="grid-item right">${bathrooms}</div>`
      );
    }
    if (parseInt(garages) > 0) {
      $(`#unit-specification-sub2-a`).append(
        `<div class="grid-item left">Garages</div>`,
        `<div class="grid-item right">${garages}</div>`
      );
    }
    $(`#unit-specification-sub2`).append(
      `<div id="unit-specification-sub2-b" class="container-fluid"></div>`
    );
    $(`#unit-specification-sub2-b`).append(
      `<img src="https://i.ibb.co/FYJDCz3/F2-148sqm.png" alt="F2-148sqm" />`
    );
    $(`#unit-specification`).append(
      `<section id="unit-specification-sub3" class="container-fluid"></section>`
    );
    $(`#unit-specification-sub3`).append(
      `<h1>Description</h1>`,
      `<p>
          Enjoy a lifestyle focused on wellness. Val de Vie Evergreen’s latest
          release, The Sugarbush, consists of 60 completed homes for immediate
          occupation. Two and three-bedroom The Sugarbush homes range in size
          from 148m2 - 233m2 and are equipped with Daikin air conditioning, a
          high-speed fibre connection, double glazed windows and quality
          finishings. Landscaped, irrigated gardens that lead out to ponds and
          green areas, complete the picture. Val de Vie Evergreen residents have
          access to all world-class facilities at Val de Vie Estate, the natural
          beauty and the incredible lifestyle the Cape Winelands has to offer.
          Val de Vie Evergreen residents make the most of the luxury country
          lifestyle and explore 21 kilometres of walking, running and cycling
          routes. They exercise at The Yard’s 1000m2 state-of-the-art gym, taste
          wine at the L’Huguenot cellar, play around on the Pearl Valley Jack
          Nicklaus Signature golf course, meet for coffee at Fleet, savour the
          meals prepared at the estate’s six restaurants or pick up baked goods
          from the delis. They even harvest fresh produce from the Val de Vie
          Wellness Farm. Enjoy the best that life has to offer in South Africa's
          safest retirement village, Val de Vie Evergreen. Study: 1
        </p>`
    );
  });
}

function im(image) {
  document.getElementById(image[0]).src = eval(image + ".src");
}

function HousePhotosArray(houseString, PreLoad) {
  let photosSrcArray = houseString.split("|");
  console.log(photosSrcArray);
  PreLoad(photosSrcArray);
  return photosSrcArray;
}

function preLoad(housePhotosArray) {
  for (let i = 0; i < housePhotosArray.length; i++) {
    eval(`a${i}` + "= " + "new Image()");
    let temp = eval(`a${i}`);
    temp.src = housePhotosArray[i];
  }
}
