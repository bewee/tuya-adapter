# Contributing

## New/unsupported devices

We would be pleased to get informed about your devices which work well with this add-on! Just open a PR or issue to get your device added to the compatibility list in the `COMPATIBILITY.md`. This may help other people looking to buy devices confirmed to work well. Please also provide the config you used if the auto-generated one didn't work.

If your device is not (fully) supported, feel free to open an issue (or PR if you fixed it on your own). We are glad about every single new supported device.
If you open an issue, please try to execute the following steps and provide us with the information obtained this way:

- In `Gateway settings > Add-Ons > Tuya Smart Life > Configure`, change the device type to (empty) and log level to debug
- Make a screenshot of your device with all of its properties
- What happens to your device when playing around with each of the properties you see there a little?
- Share a portion of your log file (`Gateway settings > developer > internal protocols` or `~/.webthings/logs/run-app.log`) where the output of the tuya add-on during your changes of the properties as well as during the resulting reaction are observable

## Adding a new device type

Each tuya device has a set of dps channels (identified through numbers). To have a look at these, simply set the device type of one of your devices to (empty) in the add-on settings. Each such channel usually represent a single property, e.g. on/off or brightness. The very basic goal of a device js is to map the properties to the right dps channels.

In general, there are 3 places you have to make changes to in order to add a new device type: 

* Add an entry to line 51 of [`manifest.json`](https://github.com/Galveston01/tuya-adapter/blob/master/manifest.json) (required for the device type to show up in the gateway)
* Add a device js file to [`lib/devices`](https://github.com/Galveston01/tuya-adapter/tree/master/lib/devices) (have a look at [`lib/devices/switch-device.js`](https://github.com/Galveston01/tuya-adapter/blob/master/lib/devices/switch-device.js) for a very basic example)
* Add the constructor for your device to the switch/case starting in line 44 of [`lib/adapter.js`](https://github.com/Galveston01/tuya-adapter/blob/master/lib/adapter.js)

## Code Structure

#### lib/
Implementation of the adapter (mostly JavaScript)

##### lib/devices/
Definition of the different types of devices (e.g. colour light, switch, dimmer, ...). 
Each of these extends the base class `TuyaDevice` and makes use of the properties defined in `lib/properties`.

##### lib/properties/
Definition of the properties used by device type classes. They may be used by multiple device types or just by one (in the latter, they are placed in an own subfolder called like the device type class they belong to).
Each of these extends the base class `TuyaProperty` and has to define the following functions:

- `update(value)`: Called when the device notified about a change of the dps affiliated with this property. Should update the gateway UI according to the state of the device (maybe some conversion is necessary).
- `setValue(value)`: Called when the property was changed through the gateway UI. Should send the updated state to the device (the exactly reversed conversion may be necessary here). To do so, use the function `setTuyapi(value)`.

Also, the function `autodps(obj)` can be overwritten in order to allow for good automatic detection of the dps number associated with this property.

##### lib/adapter.js
Definition of the adapter, which interacts with the gateway.

##### lib/helpers.js
Some helper functions, e.g. for converting colour spaces or remapping numbers from one interval to another.
