let currentLocation;
function DrawMap(
  longitudeUnit = 18.97111436,
  lattitudeUnit = -33.81043137,
  zoomUnit = 15
) {
  require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",

    "esri/Graphic",
    "esri/layers/GraphicsLayer",
    "esri/layers/FeatureLayer", //latest
    "esri/renderers/SimpleRenderer",
    "esri/symbols/SimpleFillSymbol",
    "esri/widgets/Legend",
    "esri/geometry/Point",
    "esri/symbols/CIMSymbol",
  ], function (
    esriConfig,
    Map,
    MapView,
    Graphic,
    GraphicsLayer,
    FeatureLayer,
    SimpleRenderer,
    SimpleFillSymbol,
    Legend,
    Point
  ) {
    const houseStatus = {
      Unreleased: [99, 97, 97], //dark grey

      Sold: [255, 0, 0], //red

      Available: [0, 255, 0], //green

      Other: [0, 0, 255], //blue

      Transferred: [249, 105, 14], //orange

      Reserved: [191, 85, 236], //purple
    };

    const map = new Map({
      basemap: "satellite", //Basemap layer service //"arcgis-imagery", "arcgis-topographic"
    });

    const view = new MapView({
      map: map,
      center: [longitudeUnit, lattitudeUnit], //Longitude, latitude
      zoom: zoomUnit,
      container: "viewDiv",
    });

    const legend = new Legend({
      view: view,
      container: "legendDiv",
    });

    view.ui.add("infoDiv", "bottom-left");
    //Create the Graphics Layer
    const graphicsLayer = new GraphicsLayer();
    graphicsLayer.opacity = 0.5;
    map.add(graphicsLayer);

    d3.csv("./dist/data/GreaterVDV_SIMS_Combined.csv", function (data) {
      let temp = "";
      let size = "0";
      let price = "0";
      let bathrooms = "0";
      let bedrooms = "0";
      let garages = "0";
      let propertyType = "House";
      let houseTempStatus;
      let houseStatusString = "";
      let housePhotos = "0";
      for (let i = 0; i < data.length; i++) {
        /* if (data[i].Label == "243") { */
        temp = data[i].Status;
        if (temp != "") {
          temp = temp.toUpperCase();
        }
        if (temp == "UNRELEASED") {
          houseTempStatus = houseStatus.Unreleased;
          houseStatusString = "unreleased";
        } else if (temp == "AVAILABLE") {
          houseTempStatus = houseStatus.Available;
          houseStatusString = "available";
        } else if (temp == "SOLD") {
          houseTempStatus = houseStatus.Sold;
          houseStatusString = "sold";
        } else if (temp == "TRANSFERRED") {
          houseTempStatus = houseStatus.Transferred;
          houseStatusString = "transferred";
        } else if (temp == "RESERVED") {
          houseTempStatus = houseStatus.Reserved;
          houseStatusString = "reserved";
        } else {
          houseTempStatus = houseStatus.Other;
          houseStatusString = "other";
        }
        if (data[i].Size != "") {
          size = data[i].Size;
        }
        if (data[i].PriceVAT != "") {
          price = data[i].PriceVAT;
        }
        if (data[i].Bathrooms != "") {
          bathrooms = data[i].Bathrooms;
        }
        if (data[i].Bedrooms != "") {
          bedrooms = data[i].Bedrooms;
        }
        if (data[i].Garages != "") {
          garages = data[i].Garages;
        }
        if (data[i].PropertyType != "") {
          propertyType = data[i].PropertyType;
        }
        if (data[i].Photos != "") {
          housePhotos = data[i].Photos;
        }
        let housenumber = data[i].Label;
        let title = data[i].Label;
        graphicsLayer.add(
          CreateHousePolygon(
            parseFloat(data[i].Longitude),
            parseFloat(data[i].Latitude),
            7,
            houseTempStatus,
            title,
            housenumber,
            size,
            price,
            bathrooms,
            bedrooms,
            garages,
            propertyType,
            houseStatusString,
            housePhotos
          )
        );
        /* } */
      }
    });
    //!!!!!!!!!!!!!!
    /* graphicsLayer.add(
      CreatePhotoPolygon(18.9666974, -33.80922, 7, houseStatus.Sold)
    ); */
    //graphicsSymbolLayer.add(SymbolMap(18.9666974, -33.80922));

    const streetLayer = new FeatureLayer({
      url: "https://services5.arcgis.com/WPkXI1mQdYLzFttB/arcgis/rest/services/Navigation_Barriers/FeatureServer/0",
    });

    const erfLayer = new FeatureLayer({
      url: "https://services5.arcgis.com/WPkXI1mQdYLzFttB/arcgis/rest/services/VdV_Cadastral/FeatureServer/0",
    });
    const valdevieLabels = {
      symbol: {
        type: "text",
        color: "#FFFFFF",
        haloColor: "#5E8D74",
        haloSize: "2px",
        font: {
          size: "12px",
          family: "Noto Sans",
          style: "italic",
          weight: "normal",
        },
      },

      labelPlacement: "center-center",
      labelExpressionInfo: {
        expression: "$feature.Label",
      },
    };
    const dotLyaer = new FeatureLayer({
      url: "https://services5.arcgis.com/WPkXI1mQdYLzFttB/arcgis/rest/services/Greater_VdV_Addresses/FeatureServer/0",

      labelingInfo: [], //[valdevieLabels], //!!!!!!!!!!!!!!!!!!!!IF YOU WANT NO LABELS!!!!!!!!!!!!
    });
    dotLyaer.opacity = 0;

    let symbol = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: [51, 51, 204, 0.9],
      style: "none",
      outline: {
        // autocasts as new SimpleLineSymbol()
        color: "black",
        width: 1,
      },
    };
    const erfLayerRenderer = {
      type: "simple",
      symbol: symbol,
    };
    erfLayer.renderer = erfLayerRenderer;
    const graphicsSymbolLayer = new GraphicsLayer();
    graphicsSymbolLayer.add(
      CIM_CameraSymbol(
        18.9666974,
        -33.80922,
        "https://i.ibb.co/djJFG1S/1M8A2478.jpg"
      )
    );
    //graphicsSymbolLayer.add(SymbolMap(18.9666974, -33.80922, "Jakes"));
    map.add(streetLayer);
    map.add(dotLyaer);
    map.add(erfLayer);
    map.add(graphicsSymbolLayer);
    //function to create the house polygon
    function CreateHousePolygon(
      x,
      y,
      size,
      status,
      title,
      housenumber = "300",
      housesize = "50",
      price,
      bathrooms,
      bedrooms,
      garages,
      propertyType,
      houseStatusString,
      housePhotos
    ) {
      const polygon2 = {
        type: "polygon",
        rings: convert([x, y], size, 20), //18.96529158, -33.80835267, 10
      };

      const simpleFillSymbol2 = {
        type: "simple-fill",
        color: status, // Orange, opacity 80%
        outline: {
          color: [255, 255, 255],
          width: 1,
        },
      };

      const popupTemplate2 = {
        outFields: ["*"],
        title: "", //title,
        content: function (feature) {
          //!!!!!!!!!!!!!!!!!!!!EDIT HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!

          const div = document.createElement("div");
          const h4HouseNumber = document.createElement("h4");
          const h4Price = document.createElement("h4");
          const buttonEnquire = document.createElement("button");
          const buttonDetails = document.createElement("button");
          const buttonAddToFavorites = document.createElement("button");
          buttonDetails.setAttribute(
            "onclick",
            `Enquire('${housenumber}','${housesize}','${price}','${houseStatusString}','${bedrooms}','${bathrooms}','${garages}','${propertyType}','${housePhotos}');`
          );
          buttonEnquire.setAttribute(
            "onclick",
            "changeSrc('./dist/pages/main/enquire.html')"
          );
          h4HouseNumber.innerText = `Unit: ${housenumber}`;
          h4Price.innerText = `Price: R${price}`;
          buttonEnquire.textContent = "ENQUIRE";
          buttonEnquire.classList.add("btn");
          buttonEnquire.classList.add("btn-primary");

          buttonDetails.textContent = "DETAILS";
          buttonDetails.classList.add("btn");
          buttonDetails.classList.add("btn-primary");

          buttonAddToFavorites.textContent = "ADD TO FAVORITES";
          buttonAddToFavorites.classList.add("btn");
          buttonAddToFavorites.classList.add("btn-primary");

          div.appendChild(h4HouseNumber);
          if (parseInt(price) > 0) {
            div.appendChild(h4Price);
          }
          div.appendChild(buttonEnquire);
          div.appendChild(buttonDetails);
          div.appendChild(buttonAddToFavorites);
          return div;
        },
      };

      const attributes2 = {
        Name: "Graphic",
        Description: "I am a polygon",
      };

      const polygonGraphic2 = new Graphic({
        geometry: polygon2,
        symbol: simpleFillSymbol2,
        attributes: attributes2,
        popupTemplate: popupTemplate2,
      });
      return polygonGraphic2;
    }
    //CREATE SYMBOL ON THE MAP
    function CIM_CameraSymbol(x, y, image) {
      function getCIMSymbolData() {
        return {
          type: "CIMSymbolReference",
          primitiveOverrides: [
            {
              type: "CIMPrimitiveOverride",
              primitiveName: "textGraphic",
              propertyName: "TextString",
              valueExpressionInfo: {
                type: "CIMExpressionInfo",
                title: "Custom",
                expression: "$feature.text",
                returnType: "Default",
              },
            },
          ],
          symbol: {
            type: "CIMPointSymbol",
            symbolLayers: [
              {
                type: "CIMVectorMarker",
                enable: true,
                anchorPointUnits: "Relative",
                dominantSizeAxis3D: "Y",
                size: 40,
                billboardMode3D: "FaceNearPlane",
                frame: {
                  xmin: 0,
                  ymin: 0,
                  xmax: 21,
                  ymax: 21,
                },
                markerGraphics: [
                  {
                    type: "CIMMarkerGraphic",
                    geometry: {
                      rings: [
                        [
                          [14, 17],
                          [15, 14],
                          [18, 14],
                          [18, 5],
                          [3, 5],
                          [3, 14],
                          [4, 14],
                          [4, 15],
                          [6, 15],
                          [6, 14],
                          [8, 14],
                          [9, 17],
                          [14, 17],
                        ],
                        [
                          [10, 16],
                          [10, 15],
                          [13, 15],
                          [13, 16],
                          [10, 16],
                        ],
                        [
                          [4, 13],
                          [4, 12],
                          [6, 12],
                          [6, 13],
                          [4, 13],
                        ],
                        [
                          [8.1, 9.5],
                          [8.16, 8.84],
                          [8.36, 8.2],
                          [8.67, 7.61],
                          [9.09, 7.09],
                          [9.61, 6.67],
                          [10.2, 6.36],
                          [10.84, 6.16],
                          [11.5, 6.1],
                          [12.16, 6.16],
                          [12.8, 6.36],
                          [13.39, 6.67],
                          [13.91, 7.09],
                          [14.33, 7.61],
                          [14.64, 8.2],
                          [14.84, 8.84],
                          [14.9, 9.5],
                          [14.84, 10.16],
                          [14.64, 10.8],
                          [14.33, 11.39],
                          [13.91, 11.91],
                          [13.39, 12.33],
                          [12.8, 12.64],
                          [12.16, 12.84],
                          [11.5, 12.9],
                          [10.84, 12.84],
                          [10.2, 12.64],
                          [9.61, 12.33],
                          [9.09, 11.91],
                          [8.67, 11.39],
                          [8.36, 10.8],
                          [8.16, 10.16],
                          [8.1, 9.5],
                        ],
                        [
                          [11.5, 7.15],
                          [10.6, 7.33],
                          [9.84, 7.84],
                          [9.33, 8.6],
                          [9.15, 9.5],
                          [9.33, 10.4],
                          [9.84, 11.16],
                          [10.6, 11.67],
                          [11.5, 11.85],
                          [12.4, 11.67],
                          [13.16, 11.16],
                          [13.67, 10.4],
                          [13.85, 9.5],
                          [13.67, 8.6],
                          [13.16, 7.84],
                          [12.4, 7.33],
                          [11.5, 7.15],
                        ],
                      ],
                    },
                    symbol: {
                      type: "CIMPolygonSymbol",
                      symbolLayers: [
                        {
                          type: "CIMSolidStroke",
                          enable: true,
                          capStyle: "Round",
                          joinStyle: "Round",
                          lineStyle3D: "Strip",
                          miterLimit: 10,
                          width: 0,
                          color: [110, 110, 110, 255],
                        },
                        {
                          type: "CIMSolidFill",
                          enable: true,
                          color: [0, 51, 255, 255],
                        },
                      ],
                    },
                  },
                ],
                scaleSymbolsProportionally: true,
                respectFrame: true,
              },
              {
                type: "CIMVectorMarker",
                enable: true,
                anchorPointUnits: "Relative",
                dominantSizeAxis3D: "Y",
                size: 17,
                billboardMode3D: "FaceNearPlane",
                frame: {
                  xmin: 0,
                  ymin: 0,
                  xmax: 28,
                  ymax: 17,
                },
                markerGraphics: [
                  {
                    type: "CIMMarkerGraphic",
                    geometry: {
                      rings: [
                        [
                          [25.36, 0],
                          [2.64, 0],
                          [1.63, 0.19],
                          [0.77, 0.74],
                          [0.2, 1.56],
                          [0, 2.52],
                          [0, 14.48],
                          [0.2, 15.44],
                          [0.77, 16.26],
                          [1.63, 16.81],
                          [2.64, 17],
                          [25.36, 17],
                          [26.37, 16.81],
                          [27.23, 16.26],
                          [27.8, 15.44],
                          [28, 14.48],
                          [28, 2.52],
                          [27.8, 1.56],
                          [27.23, 0.74],
                          [26.37, 0.19],
                          [25.36, 0],
                        ],
                      ],
                    },
                    symbol: {
                      type: "CIMPolygonSymbol",
                      symbolLayers: [
                        {
                          type: "CIMSolidStroke",
                          enable: true,
                          capStyle: "Round",
                          joinStyle: "Round",
                          lineStyle3D: "Strip",
                          miterLimit: 10,
                          width: 0,
                          color: [0, 0, 0, 255],
                        },
                        {
                          type: "CIMSolidFill",
                          enable: true,
                          color: [255, 255, 255, 255],
                        },
                      ],
                    },
                  },
                ],
                scaleSymbolsProportionally: true,
                respectFrame: true,
                offsetY: -2,
              },
            ],
          },
        };
      }

      const popupTemplate2 = {
        outFields: ["*"],
        defaultPopupTemplateEnabled: false,
        title: "", //title,
        content: function (feature) {
          const div = document.createElement("div");
          const img = document.createElement("img");
          img.src = image;
          img.classList.add("photo-image");
          div.appendChild(img);
          return div;
        },
      };
      const pointGraphic5 = new Graphic({
        geometry: {
          type: "point",
          latitude: y,
          longitude: x,
        },
        attributes: {},
        symbol: {
          type: "cim",
          data: getCIMSymbolData(),
        },
        popupTemplate: popupTemplate2,
      });

      return pointGraphic5;
    }

    /*    function SymbolMap(x, y, name) {
      const textSymbol = {
        type: "text", // autocasts as new TextSymbol()
        color: "#000",
        text: "\ue661", //esri-icon-media
        font: {
          // autocasts as new Font()
          size: 36,
          family: "CalciteWebCoreIcons",
        },
      };
      const point1 = new Point({
        longitude: x,
        latitude: y,
      });
      const popupTemplate2 = {
        outFields: ["*"],
        defaultPopupTemplateEnabled: true,
        title: "", //title,
        content: function (feature) {
          //const { OBJECTID } = feature.graphic.attributes;
          const div = document.createElement("div");
          const h1 = document.createElement("h1");
          const buttonEnquire = document.createElement("button");
          const buttonDetails = document.createElement("button");
          const buttonAddToFavorites = document.createElement("button");
          h1.textContent = `Unit: ${housenumber}`;
          buttonDetails.setAttribute("onclick", `Enquire('${name}');`);
          buttonEnquire.textContent = "ENQUIRE";
          buttonDetails.textContent = "DETAILS";
          buttonAddToFavorites.textContent = "ADD TO FAVORITES";
          div.appendChild(h1);
          div.appendChild(buttonEnquire);
          div.appendChild(buttonDetails);
          div.appendChild(buttonAddToFavorites);
          return div;
        },
      };
      const pointGraphic5 = new Graphic({
        geometry: point1,
        symbol: textSymbol,
        popupTemplate: popupTemplate2,
      });
      return pointGraphic5;
    }
     */
    //PHOTO POLYGON FUNCTION
    /*  function CreatePhotoPolygon(x, y, size, status) {
      const polygon2 = {
        type: "polygon",
        rings: convert([x, y], size, 20), //18.96529158, -33.80835267, 10
      };

      const simpleFillSymbol2 = {
        type: "simple-fill",
        color: status, // Orange, opacity 80%
        outline: {
          color: [255, 255, 255],
          width: 1,
        },
      };

      const popupTemplate2 = {
        outFields: ["*"],
        title: "", //title,
        content: function (feature) {
          //const { OBJECTID } = feature.graphic.attributes;
          const div = document.createElement("div");
          const img = document.createElement("img");
          img.src = "./dist/images/popup_photos/VdV-Logo-R.png";

          div.appendChild(img);
          return div;
        },
      };

      const attributes2 = {
        Name: "Graphic",
        Description: "I am a polygon",
      };

      const polygonGraphic2 = new Graphic({
        geometry: polygon2,
        symbol: simpleFillSymbol2,
        attributes: attributes2,
        popupTemplate: popupTemplate2,
      });
      return polygonGraphic2;
    }
     */
  });
  //return a polygon array square of the house
  //ADD PHOTO PHOTO TO MAP

  function convert(center, radius, numberOfSegments = 360) {
    let n = numberOfSegments;
    let flatCoordinates = [];
    let bearing;
    for (let i = 0; i < n; i++) {
      bearing = (2 * Math.PI * i) / n;
      flatCoordinates.push(offset(center, radius, bearing));
    }

    //flatCoordinates = flatCoordinates[0];
    //flatCoordinates.push(flatCoordinates[0]);

    return flatCoordinates;
  }

  function offset(c1, distance, bearing) {
    let lat1 = degrees_to_radians(c1[1]);
    let lon1 = degrees_to_radians(c1[0]);
    let dByR = distance / 6378137; // convert dist to angular distance in radians

    let lat = Math.asin(
      Math.sin(lat1) * Math.cos(dByR) +
        Math.cos(lat1) * Math.sin(dByR) * Math.cos(bearing)
    );
    let lon =
      lon1 +
      Math.atan2(
        Math.sin(bearing) * Math.sin(dByR) * Math.cos(lat1),
        Math.cos(dByR) - Math.sin(lat1) * Math.sin(lat)
      );
    lon = fmod(lon + 3 * Math.PI, 2 * Math.PI) - Math.PI;
    let lattitude = radians_to_degrees(lat);
    let Longitude = radians_to_degrees(lon);
    return [Longitude, lattitude];
  }
  function degrees_to_radians(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
  }
  function fmod(x, y) {
    let tmp;
    let tmp2;
    let p = 0;
    let pY = 0;
    let l = 0.0;
    let l2 = 0.0;
    tmp = x.toExponential().match(/^.\.?(.*)e(.+)$/);
    p = parseInt(tmp[2], 10) - (tmp[1] + "").length;
    tmp = y.toExponential().match(/^.\.?(.*)e(.+)$/);
    pY = parseInt(tmp[2], 10) - (tmp[1] + "").length;
    if (pY > p) {
      p = pY;
    }
    tmp2 = x % y;
    if (p < -100 || p > 20) {
      // toFixed will give an out of bound error so we fix it like this:
      l = Math.round(Math.log(tmp2) / Math.log(10));
      l2 = Math.pow(10, l);
      return (tmp2 / l2).toFixed(l - p) * l2;
    } else {
      return parseFloat(tmp2.toFixed(-p));
    }
  }
  function radians_to_degrees(radians) {
    var pi = Math.PI;
    return radians * (180 / pi);
  }
  function createForm() {
    hbspt.forms.create({
      region: "na1",
      portalId: "5623527",
      formId: "ce85dcbb-ced4-4ed4-9470-94a83100ba21",
    });
  }
}

setTimeout(DrawMap(), 1000);

// DROPDOWN CODE STARTS
document.getElementById("legend-title").addEventListener("click", function () {
  const menuToggle = document.getElementById("legend-container-box");

  if (menuToggle.classList.contains("closed")) {
    document
      .getElementById("legend-arrow-dropdown")
      .classList.remove("fa-angle-double-up");
    document
      .getElementById("legend-arrow-dropdown")
      .classList.add("fa-angle-double-down");
    document.getElementById("legend-container-box").classList.remove("closed");
    document.getElementById("legend-container-box").classList.add("open");
    document.getElementById("menu-toggle").src =
      "dist/images/drop-down-close.png";
  } else {
    document
      .getElementById("legend-arrow-dropdown")
      .classList.remove("fa-angle-double-down");
    document
      .getElementById("legend-arrow-dropdown")
      .classList.add("fa-angle-double-up");
    document.getElementById("legend-container-box").classList.remove("open");
    document.getElementById("legend-container-box").classList.add("closed");
    document.getElementById("menu-toggle").src =
      "dist/images/drop-down-open.png";
  }
});
// DROPDOWN CODE ENDS
//OPEN DEFAULT HOME PAGE
document.getElementById("defaultOpen").click();

//SIDE MENU OPEN STARTS
function SideMenu() {
  const sideMenuIconToggle = document.getElementById("sideMenu");
  const iframePages = document.getElementById("pages");
  const map = document.getElementById("viewDiv");
  if (sideMenuIconToggle.classList.contains("fa-angle-double-right")) {
    sideMenuIconToggle.classList.remove("fa-angle-double-right");
    sideMenuIconToggle.classList.add("fa-angle-double-left");
    iframePages.style.display = "none";
    map.style.width = "96vw";
  } else {
    sideMenuIconToggle.classList.remove("fa-angle-double-left");
    sideMenuIconToggle.classList.add("fa-angle-double-right");
    iframePages.style.display = "block";
    map.style.width = "75vw";
  }
}
function changeSrc(loc) {
  currentLocation = loc;
  window.parent.document.getElementById("pages").src = loc; //change this
}

function Enquire(
  housenumber,
  size,
  price,
  status,
  bedrooms,
  bathrooms,
  garages,
  propertyType,
  housePhotos
) {
  changeSrc("./dist/pages/main/unit.html");
  setTimeout(ChangePageContent, 1000);
  function ChangePageContent() {
    let iframe = document.getElementById("pages");
    let innerDoc = iframe.contentDocument || iframe.contentWindow.document;
    const section = innerDoc.getElementById("unitDetails");
    const script = document.createElement("script");
    script.innerHTML = `ChangeUnitContent('${housenumber}','${size}','${price}','${status}','${bedrooms}','${bathrooms}','${garages}','${propertyType}','${housePhotos}');`;
    section.appendChild(script);
  }
}
///////////////////////////FOR SALE SEARCH AND UNIT SEARCH START
var globalForSaleJsonObject;
function StartForSale() {
  $("#pages")
    .contents()
    .find("#for-sale")
    .submit(function (event) {
      globalForSaleJsonObject = $(this).serializeArray();
      changeSrc("../../dist/pages/areas/searchResults.html");
      //ForSale($(this).serializeArray());
      event.preventDefault();
    });
}
var globalUnitSearchJsonObject;
//unit search form submission
function StartUnitSearch() {
  $("#pages")
    .contents()
    .find("#unit-search")
    .submit(function (event) {
      globalUnitSearchJsonObject = $(this).serializeArray();
      changeSrc("../../dist/pages/areas/searchResults.html");
      event.preventDefault();
    });
}
function changeSrc(loc) {
  currentLocation = loc;
  window.parent.document.getElementById("pages").src = loc; //change this
}
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
  const TheEstates = {
    hoai: "VDV I: HOA I",
    "vdvi-phasei": "VDV I: Phase 1",
    "vdvii-river-club": "VDV II: River Club",
    "vdvii-gentleman-estate": "VDV II:Gentleman Est",
    "vdvii-la-vue": "VDV II: La Vue",
    "vdvii-la-vueii": "VDV II: La Vue II",
    "vdvii-le-domaine": "VDV II: Le Domaine",
    "vdvi-the-vines": "VDV I: The Vines",
    "vdvi-the-vinesii": "VDV I: The Vines II",
    "vdvii-the-acres": "VDV II: The Acres",
    "vdvii-pearl-valley-group": "VDV I: Pearl Valley Group",
    "vdvii-evergreen-retirement": "VDV I: Evergreen Retirement",
  };
  const TheEstatesReversed = {
    "VDV I: HOA I": "hoai",
    "VDV I: Phase 1": "vdvi-phasei",
    "VDV II: River Club": "vdvii-river-club",
    "VDV II:Gentleman Est": "vdvii-gentleman-estate",
    "VDV II: La Vue": "vdvii-la-vue",
    "VDV II: La Vue II": "vdvii-la-vueii",
    "VDV II: Le Domaine": "vdvii-le-domaine",
    "VDV I: The Vines": "vdvi-the-vines",
    "VDV I: The Vines II": "vdvi-the-vinesii",
    "VDV II: The Acres": "vdvii-the-acres",
    "VDV I: Pearl Valley Group": "vdvii-pearl-valley-group",
    "VDV I: Evergreen Retirement": "vdvii-evergreen-retirement",
  };
  //changeSrc("../../dist/pages/areas/searchResults.html");

  jsonObject.forEach((item) => {
    ForSaleObject[item.name] = item.value;
  });
  /* let iframe = document.getElementById("#pages");
  let iframeDoc = iframe.contentWindow.document; // iframe.contentDocument || */

  // Check if loading is complete
  $("#Pages")
    .contents()
    .ready(function () {
      setTimeout(() => {
        if (ForSaleObject.estates == "hoai" || ForSaleObject.estates == "any") {
          TableHead("hoai", "#hoai");
        }
        if (
          ForSaleObject.estates == "vdvii-la-vue" ||
          ForSaleObject.estates == "any"
        ) {
          TableHead("vdvii-la-vue", "#vdvii-la-vue");
        }
        if (
          ForSaleObject.estates == "vdvi-phasei" ||
          ForSaleObject.estates == "any"
        ) {
          TableHead("vdvi-phasei", "#vdvi-phasei");
        }
        if (
          ForSaleObject.estates == "vdvii-river-club" ||
          ForSaleObject.estates == "any"
        ) {
          TableHead("vdvii-river-club", "#vdvii-river-club");
        }
        if (
          ForSaleObject.estates == "vdvii-gentleman-estate" ||
          ForSaleObject.estates == "any"
        ) {
          TableHead("vdvii-gentleman-estate", "#vdvii-gentleman-estate");
        }
        if (
          ForSaleObject.estates == "vdvii-la-vueii" ||
          ForSaleObject.estates == "any"
        ) {
          TableHead("vdvii-la-vueii", "#vdvii-la-vueii");
        }
        if (
          ForSaleObject.estates == "vdvii-le-domaine" ||
          ForSaleObject.estates == "any"
        ) {
          TableHead("vdvii-le-domaine", "#vdvii-le-domaine");
        }
        if (
          ForSaleObject.estates == "vdvi-the-vines" ||
          ForSaleObject.estates == "any"
        ) {
          TableHead("vdvi-the-vines", "#vdvi-the-vines");
        }
        if (
          ForSaleObject.estates == "vdvi-the-vinesii" ||
          ForSaleObject.estates == "any"
        ) {
          TableHead("vdvi-the-vinesii", "#vdvi-the-vinesii");
        }
        if (
          ForSaleObject.estates == "vdvii-the-acres" ||
          ForSaleObject.estates == "any"
        ) {
          TableHead("vdvii-the-acres", "#vdvii-the-acres");
        }
        if (
          ForSaleObject.estates == "vdvii-pearl-valley-group" ||
          ForSaleObject.estates == "any"
        ) {
          TableHead("vdvii-pearl-valley-group", "#vdvii-pearl-valley-group");
        }
        if (
          ForSaleObject.estates == "vdvii-evergreen-retirement" ||
          ForSaleObject.estates == "any"
        ) {
          TableHead(
            "vdvii-evergreen-retirement",
            "#vdvii-evergreen-retirement"
          );
        }
        //console.log(ForSaleObject);
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
        d3.csv("./dist/data/GreaterVDV_SIMS_Combined.csv", function (data) {
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
              let precinct = ForSaleObject.estates;
              if (precinct == "any" && data[i].Precinct in TheEstatesReversed) {
                precinct = TheEstatesReversed[data[i].Precinct];
              }
              if (precinct != undefined && precinct != "any") {
                if (
                  (temp == "house" || temp == "stand" || temp == "building") &&
                  ForSaleObject["property-type-any"] != "0"
                ) {
                  TableRow(
                    precinct,
                    data[i].Label,
                    data[i].PropertyType,
                    data[i].Size,
                    data[i].PriceVAT
                  );
                } else if (
                  (temp == "house" || temp == "stand" || temp == "building") &&
                  ForSaleObject["property-type-house"] != "0"
                ) {
                  TableRow(
                    precinct,
                    data[i].Label,
                    data[i].PropertyType,
                    data[i].Size,
                    data[i].PriceVAT
                  );
                } else if (
                  temp == "apartment" &&
                  ForSaleObject["property-type-apartment"] != "0"
                ) {
                  TableRow(
                    precinct,
                    data[i].Label,
                    data[i].PropertyType,
                    data[i].Size,
                    data[i].PriceVAT
                  );
                } else if (
                  temp == "estate" &&
                  ForSaleObject["property-type-estate"] != "0"
                ) {
                  TableRow(
                    precinct,
                    data[i].Label,
                    data[i].PropertyType,
                    data[i].Size,
                    data[i].PriceVAT
                  );
                }
              }
            }
          }
        });
        RemoveEmptyTables();
      }, 1000);
    });
  function TableHead(value1, value2) {
    $("#pages")
      .contents()
      .find(`#main`)
      .append(`<div id="${value1 + "-main"}"></div>`);
    $("#pages")
      .contents()
      .find(`#${value1 + "-main"}`)
      .append(
        `<h4 class="h4">${TheEstates[value1]}</h4>`,
        `<button type="button" class="collapsible">Open Collapsible</button>`,
        `<table  id=${value1} class="contents"><tbody id='${value1}-body' class="units-table"></tbody></table>`
      );
    $("#pages").contents().find(`${value2}`).append("<tr></tr>");
    $("#pages")
      .contents()
      .find(`${value2}`)
      .find("tr")
      .append(
        "<th scope='column'>Unit</th>",
        "<th scope='column'>Type</th>",
        "<th scope='column'>Size sqm</th>",
        "<th scope='column'>Price</th>"
      );
  }
  function TableRow(precinct, label, propertytype, size, pricevat) {
    if (pricevat > 0) {
      $("#pages").contents().find(`#${precinct} > tbody:last-child`)
        .append(`<tr class="table-row-data">
      <td><button onclick="ChangeMapLocationToUnitLocation(
        ${label}
      )"  class="btn btn-info">${label}</button></td>
        <td>${propertytype}</td>
        <td>${size}</td>
        <td>${pricevat}</td>
      </tr>`);
    }
  }
}

function UnitSearch(jsonObject) {
  const UnitSearchObject = {
    estates: "0",
    "unit-number": 0,
    "only-exact-matches": "0",
  };
  const TheEstates = {
    hoai: "VDV I: HOA I",
    "vdvi-phasei": "VDV I: Phase 1",
    "vdvii-river-club": "VDV II: River Club",
    "vdvii-gentleman-estate": "VDV II:Gentleman Est",
    "vdvii-la-vue": "VDV II: La Vue",
    "vdvii-la-vueii": "VDV II: La Vue II",
    "vdvii-le-domaine": "VDV II: Le Domaine",
    "vdvi-the-vines": "VDV I: The Vines",
    "vdvi-the-vinesii": "VDV I: The Vines II",
    "vdvii-the-acres": "VDV II: The Acres",
    "vdvii-pearl-valley-group": "VDV I: Pearl Valley Group",
    "vdvii-evergreen-retirement": "VDV I: Evergreen Retirement",
  };
  const TheEstatesReversed = {
    "VDV I: HOA I": "hoai",
    "VDV I: Phase 1": "vdvi-phasei",
    "VDV II: River Club": "vdvii-river-club",
    "VDV II:Gentleman Est": "vdvii-gentleman-estate",
    "VDV II: La Vue": "vdvii-la-vue",
    "VDV II: La Vue II": "vdvii-la-vueii",
    "VDV II: Le Domaine": "vdvii-le-domaine",
    "VDV I: The Vines": "vdvi-the-vines",
    "VDV I: The Vines II": "vdvi-the-vinesii",
    "VDV II: The Acres": "vdvii-the-acres",
    "VDV I: Pearl Valley Group": "vdvii-pearl-valley-group",
    "VDV I: Evergreen Retirement": "vdvii-evergreen-retirement",
  };
  changeSrc("../../dist/pages/areas/searchResults.html");
  jsonObject.forEach((item) => {
    UnitSearchObject[item.name] = item.value;
  });
  /*  let iframe = document.getElementById("#pages");
  let iframeDoc = iframe.contentWindow.document; //iframe.contentDocument || */

  // Check if loading is complete

  $("#Pages")
    .contents()
    .ready(function () {
      setTimeout(() => {
        if (
          UnitSearchObject.estates == "hoai" ||
          UnitSearchObject.estates == "any"
        ) {
          TableHead("hoai", "#hoai");
        }
        if (
          UnitSearchObject.estates == "vdvii-la-vue" ||
          UnitSearchObject.estates == "any"
        ) {
          TableHead("vdvii-la-vue", "#vdvii-la-vue");
        }
        if (
          UnitSearchObject.estates == "vdvi-phasei" ||
          UnitSearchObject.estates == "any"
        ) {
          TableHead("vdvi-phasei", "#vdvi-phasei");
        }
        if (
          UnitSearchObject.estates == "vdvii-river-club" ||
          UnitSearchObject.estates == "any"
        ) {
          TableHead("vdvii-river-club", "#vdvii-river-club");
        }
        if (
          UnitSearchObject.estates == "vdvii-gentleman-estate" ||
          UnitSearchObject.estates == "any"
        ) {
          TableHead("vdvii-gentleman-estate", "#vdvii-gentleman-estate");
        }
        if (
          UnitSearchObject.estates == "vdvii-la-vueii" ||
          UnitSearchObject.estates == "any"
        ) {
          TableHead("vdvii-la-vueii", "#vdvii-la-vueii");
        }
        if (
          UnitSearchObject.estates == "vdvii-le-domaine" ||
          UnitSearchObject.estates == "any"
        ) {
          TableHead("vdvii-le-domaine", "#vdvii-le-domaine");
        }
        if (
          UnitSearchObject.estates == "vdvi-the-vines" ||
          UnitSearchObject.estates == "any"
        ) {
          TableHead("vdvi-the-vines", "#vdvi-the-vines");
        }
        if (
          UnitSearchObject.estates == "vdvi-the-vinesii" ||
          UnitSearchObject.estates == "any"
        ) {
          TableHead("vdvi-the-vinesii", "#vdvi-the-vinesii");
        }
        if (
          UnitSearchObject.estates == "vdvii-the-acres" ||
          UnitSearchObject.estates == "any"
        ) {
          TableHead("vdvii-the-acres", "#vdvii-the-acres");
        }
        if (
          UnitSearchObject.estates == "vdvii-pearl-valley-group" ||
          UnitSearchObject.estates == "any"
        ) {
          TableHead("vdvii-pearl-valley-group", "#vdvii-pearl-valley-group");
        }
        if (
          UnitSearchObject.estates == "vdvii-evergreen-retirement" ||
          UnitSearchObject.estates == "any"
        ) {
          TableHead(
            "vdvii-evergreen-retirement",
            "#vdvii-evergreen-retirement"
          );
        }

        d3.csv("./dist/data/GreaterVDV_SIMS_Combined.csv", function (data) {
          for (let i = 0; i < data.length; i++) {
            let precinct = UnitSearchObject.estates;
            if (precinct == "any" && data[i].Precinct in TheEstatesReversed) {
              precinct = TheEstatesReversed[data[i].Precinct];
            }
            if (UnitSearchObject["unit-number"] == data[i].Label) {
              console.log(precinct);
              TableRow(
                precinct,
                data[i].Label,
                data[i].PropertyType,
                data[i].Size,
                data[i].PriceVAT
              );
            }
          }
        });
        RemoveEmptyTables();
      }, 1000);
    });
  function TableHead(value1, value2) {
    $("#pages")
      .contents()
      .find(`#main`)
      .append(`<div id="${value1 + "-main"}"></div>`);
    $("#pages")
      .contents()
      .find(`#${value1 + "-main"}`)
      .append(
        `<h4 class="h4">${TheEstates[value1]}</h4>`,
        `<button type="button" class="collapsible">Open Collapsible</button>`,
        `<table  id=${value1} class="contents"><tbody id='${value1}-body' class="units-table"></tbody></table>`
      );
    $("#pages").contents().find(`${value2}`).append("<tr></tr>");
    $("#pages")
      .contents()
      .find(`${value2}`)
      .find("tr")
      .append(
        "<th scope='column'>Unit</th>",
        "<th scope='column'>Type</th>",
        "<th scope='column'>Size sqm</th>",
        "<th scope='column'>Price</th>"
      );
  }
  function TableRow(precinct, label, propertytype, size, pricevat) {
    if (pricevat != "") {
      $("#pages").contents().find(`#${precinct} > tbody:last-child`)
        .append(`<tr class="table-row-data">
    <td><button onclick="ChangeMapLocationToUnitLocation(${label})" class="btn btn-info">${label}</button></td>
      <td>${propertytype}</td>
      <td>${size}</td>
      <td>${pricevat}</td>
    </tr>`);
    }
  }
}

function RemoveEmptyTables() {
  const TheEstatesReversed = {
    "VDV I: HOA I": "hoai",
    "VDV I: Phase 1": "vdvi-phasei",
    "VDV II: River Club": "vdvii-river-club",
    "VDV II:Gentleman Est": "vdvii-gentleman-estate",
    "VDV II: La Vue": "vdvii-la-vue",
    "VDV II: La Vue II": "vdvii-la-vueii",
    "VDV II: Le Domaine": "vdvii-le-domaine",
    "VDV I: The Vines": "vdvi-the-vines",
    "VDV I: The Vines II": "vdvi-the-vinesii",
    "VDV II: The Acres": "vdvii-the-acres",
    "VDV I: Pearl Valley Group": "vdvii-pearl-valley-group",
    "VDV I: Evergreen Retirement": "vdvii-evergreen-retirement",
  };
  $("#pages")
    .contents()
    .ready(function () {
      setTimeout(() => {
        try {
          let number;
          for (const key in TheEstatesReversed) {
            /* let iframe = document.getElementById("pages");
            let innerDoc =
              iframe.contentDocument || iframe.contentWindow.document; */
            number = $("#pages")
              .contents()
              .find(`#${TheEstatesReversed[key]}-body`)
              .children().length;
            console.log(number);
            if (number <= 1) {
              $("#pages")
                .contents()
                .find(`#${TheEstatesReversed[key]}-main`)
                .remove();
            }
          }
        } catch (e) {
          console.log(e);
        }
      }, 2000);
    });
  CloseTables();
}

function CloseTables() {
  setTimeout(() => {
    var coll = $("#pages").contents().find(".collapsible");
    var i;

    for (i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
          content.style.display = "none";
        } else {
          content.style.display = "block";
        }
      });
      coll[i].click();
      coll[i].click();
    }
  }, 3000);
}
