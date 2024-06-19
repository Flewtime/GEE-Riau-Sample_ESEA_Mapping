![Riau-Mapping](https://github.com/Flewtime/GEE-Riau-Sample_ESEA_Mapping/assets/93987808/df918541-a239-4ae6-bc9f-569ae27d76c1)
1. The ESA WorldCover v200 dataset is imported.
2. Class 95 Processing: The binary and mask layers for class 95 are added using .eq(95) to identify pixels of this class and .mask to create a masked layer.
3. Sentinel-2 Processing: The existing steps to filter, median composite, clip, and add Sentinel-2 data to the map.
4. Export: The ESA and Sentinel-2 data are exported as tif file
