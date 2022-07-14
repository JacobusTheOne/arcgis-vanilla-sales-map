function ChangeUnitContent(housenumber, size, price) {
  $(document).ready(function () {
    console.log("Search Unit", housenumber);
    $("#unitDetails").append(
      '<img id="a" src="../../images/houseImages/1M8A1727.jpg" alt="gallery-photo" />'
    );
    $("#a").wrap('<div class="house-images"></div>');
    $("#unitDetails").append('<div class="some-class"></div>');
    $(".some-class").append(
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
    );
    $("#unitDetails").after('<section id="unit-specification"></section>');
    $("#unit-specification").append(
      "<section id='unit-specification-sub'></section>"
    );
    $(`#unit-specification-sub`).append(
      `<div id="unit-specification-sub-a" class="grid-three-column-container"></div>`
    );
    $(`#unit-specification-sub-a`).append(
      `<div class="grid-item" style="float: left">bathrooms</div>`,
      `<div class="grid-item" style="text-align: center" >bedrooms</div>`,
      `<div class="grid-item" style="float: right">garages</div>`
    );
    $("#unit-specification-sub").append(
      `<div id="unit-specification-sub-b" class="grid-two-column-container unit-detail"></div>`
    );
    $(`#unit-specification-sub-b`).append(
      `<div class="grid-item left">Unit</div>`,
      `<div class="grid-item right">${housenumber}</div>`,
      `<div class="grid-item left">Unit Type</div>`,
      `<div class="grid-item right">House</div>`,
      `<div class="grid-item left">Floor</div>`,
      `<div class="grid-item right">Ground Floor</div>`,
      `<div class="grid-item left">Price</div>`,
      `<div class="grid-item right">R${price}</div>`
    );
    $(`#unit-specification-sub`).append(
      `<div id="unit-specification-sub-c" class="grid-two-column-container unit-sale-status"></div>`
    );
    $(`#unit-specification-sub-c`).append(
      `<div id="unit-specification-sub-c-a" class="grid-item left available">Available</div>`
    );
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
    $(`#unit-specification-sub2-a`).append(
      `<div class="grid-item left">Plan Size</div>`,
      `<div class="grid-item right">${size} sqm</div>`,
      `<div class="grid-item left">Bedrooms</div>`,
      `<div class="grid-item right">2</div>`,
      `<div class="grid-item left">Bathrooms</div>`,
      `<div class="grid-item right">2</div>`,
      `<div class="grid-item left">Garages</div>`,
      `<div class="grid-item right">1</div>`
    );
    $(`#unit-specification-sub2`).append(
      `<div id="unit-specification-sub2-b" class="container-fluid"></div>`
    );
    $(`#unit-specification-sub2-b`).append(
      `<img src="" alt="architect-plan" />`
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

function preLoad() {
  a1 = new Image();
  a1.src = "../../images/houseImages/1M8A1727.jpg";
  a2 = new Image();
  a2.src = "../../images/houseImages/1M8A6060.jpg";
  a3 = new Image();
  a3.src = "../../images/houseImages/1M8A1847.jpg";
}
function im(image) {
  document.getElementById(image[0]).src = eval(image + ".src");
}
