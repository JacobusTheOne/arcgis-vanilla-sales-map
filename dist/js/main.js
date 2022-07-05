function DrawMap() {
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
  ], function (
    esriConfig,
    Map,
    MapView,
    Graphic,
    GraphicsLayer,
    FeatureLayer,
    SimpleRenderer,
    SimpleFillSymbol,
    Legend
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
      center: [18.9660638, -33.8071444], //Longitude, latitude
      zoom: 15,
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
      for (let i = 0; i < data.length; i++) {
        temp = data[i].Status;
        if (temp != undefined) {
          temp = temp.toUpperCase();
        }
        if (temp == "UNRELEASED") {
          houseTempStatus = houseStatus.Unreleased;
        } else if (temp == "AVAILABLE") {
          houseTempStatus = houseStatus.Available;
        } else if (temp == "SOLD") {
          houseTempStatus = houseStatus.Sold;
        } else if (temp == "TRANSFERRED") {
          houseTempStatus = houseStatus.Transferred;
        } else if (temp == "RESERVED") {
          houseTempStatus = houseStatus.Reserved;
        } else {
          houseTempStatus = houseStatus.Other;
        }
        if (data[i] !== null) {
          graphicsLayer.add(
            CreateHousePolygon(
              parseFloat(data[i].Longitude),
              parseFloat(data[i].Latitude),
              7,
              houseTempStatus,
              data[i].Label,
              data[i].Label,
              data[i].Size
            )
          );
        }
      }
    });
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

      labelingInfo: [valdevieLabels],
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
    map.add(streetLayer);
    map.add(dotLyaer);
    map.add(erfLayer);

    //function to create the house polygon
    function CreateHousePolygon(
      x,
      y,
      size,
      status,
      title,
      housenumber = "300",
      housesize = "50"
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
          //const { OBJECTID } = feature.graphic.attributes;
          const div = document.createElement("div");
          const script = document.createElement("script");
          //script.setAttribute("src", "./dist/js/PopupSrc.js");
          script.innerHTML = `hbspt.forms.create({
            region: "na1",
            portalId: "5623527",
            formId: "f915a1a7-8a5e-46f5-bf3d-ba0267c50f65",
            onFormReady: ($form) => {
              $form.find(
                'input[name = "size"]'
              ).val(${housesize}).change();
              $form.find(
                'input[name = "unit_number_interested"]'
              ).val(${housenumber}).change();
            },
          })`;
          //div.innerHTML = `<input type='button' onclick=runCode(${OBJECTID}) value='Click Me'></input>`;
          //return div; https://share.hsforms.com/1-RWhp4peRvW_PboCZ8UPZQ3cj53
          return script;
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
  });
  //return a polygon array square of the house

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
    document.getElementById("legend-container-box").classList.remove("closed");
    document.getElementById("legend-container-box").classList.add("open");
    document.getElementById("menu-toggle").src =
      "dist/images/drop-down-close.png";
  } else {
    document.getElementById("legend-container-box").classList.remove("open");
    document.getElementById("legend-container-box").classList.add("closed");
    document.getElementById("menu-toggle").src =
      "dist/images/drop-down-open.png";
  }
});
// DROPDOWN CODE ENDS
