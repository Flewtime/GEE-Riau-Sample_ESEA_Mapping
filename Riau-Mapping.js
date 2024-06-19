var riau = 
    /* color: #98ff00 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[101.38992361681903, 1.6156520916465094],
          [101.38992361681903, 0.9291800097608628],
          [102.23037771838153, 0.9291800097608628],
          [102.23037771838153, 1.6156520916465094]]], null, false);


var esa = ee.ImageCollection("ESA/WorldCover/v200").first();
var visualization = {bands: ['Map']};
Map.addLayer(esa, visualization, 'ESA Land Cover');
Map.centerObject(esa);


var countries = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017');
var indonesia = countries.filter(ee.Filter.eq('country_na', 'Indonesia'));

var esa_processed = esa.select('Map');

Map.addLayer(esa_processed.eq(95).clip(riau), {}, 'Binary Mangroves');
Map.addLayer(esa_processed.mask(esa_processed.eq(95)).clip(riau), {}, 'Masked Mangroves');


var collection = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
.filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 50))
.filterDate('2023-01-01', '2023-12-31')
.filterBounds(riau);

print(collection);

var medianpixels = collection.median();
var medianpixelsclipped = medianpixels.clip(riau).divide(10000);
Map.addLayer(medianpixelsclipped, {bands: ['B12', 'B11', 'B4'], min: 0, max: 1, gamma: 1.5}, 'Sentinel-2 mosaic');
print(medianpixelsclipped);


var esa_clip = esa.clip(riau);
Map.addLayer(esa_clip, visualization, 'Riau ESA Land Cover');
Map.centerObject(esa_clip);

var bands = ['B12', 'B11', 'B4'];
bands.forEach(function(band) {
  Export.image.toDrive({
    image: medianpixelsclipped.select(band),
    description: 'Sentinel2_' + band + '_Riau',
    scale: 10,
    region: riau,
    maxPixels: 1e13
  });
});

Export.image.toDrive({
  image: esa_clip,
  description: "ESA_LULC_Riau",
  scale: 10,
  region: riau,
  maxPixels: 1e13
});