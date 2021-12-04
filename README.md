# GpsVis2

GpsVis2 is a tool for creating a visualization of GPS traces.

Example:
![Example](/example/ExampleOutput.png?raw=true)

# Usage
## Requirements 
 * Node 16 is required. May work with Node 14.
 * yarn (2)

## Install
 * Install the dependencies with
    ```
    yarn install
    ```
 * Put your `*.gpx` files int the input folder
 * Optionally tweak the `config.json`
 * Run the script with
    ```
    yarn start
    ```
## config.json
The default config is the following:
```
{
    mapWidth: 2500,
    padding: 40,
    backgroundColor: 'rgba(0, 0, 0 , 1)',
    strokeColor: 'rgba(216, 90, 0 , 0.4)',
    mode: 0,
    metaPixel: {
        width: 5,
        spacing: 1,
    }
}
```
You can override any of these parameters.

Following modes are supported:
 * `0`: Lines between each trackpoint are drawn
 * `1`: Only one pixel is drawn for each trackpoint. No connection between them are drawn
 * `2`: 'Metapixel', Only pixels are drawn, but they are clustered together to a raster. The configuration is given in `metaPixel`.
