# Tuya Adapter
Tuya Smart Life IoT devices adapter add-on for Mozilla WebThings Gateway.

# Setup
Install this addon through the addon list or clone it to `~/.mozilla-iot/addons/` using git. To add a device, you have to know its `id` and `key` values. Follow the setup instructions <a href='https://github.com/codetheweb/tuyapi/blob/master/docs/SETUP.md'>here</a> on how to obtain these.
To add a device using these values, go to `Settings > Add-ons > Tuya Smart Life > Configure`. Add a new entry in the devices section, put your `id` and `key` values in the according fields and select a device type. After applying, the new device should be available in the "new devices" list.

# Notes
This Add-On has been tested with <a href='https://www.amazon.de/dp/B07D5V139R/ref=pe_3044161_185740101_TE_item'>this plug</a> and <a href='https://www.amazon.de/dp/B07SPBMCC7/ref=pe_3044161_189395811_TE_SCE_dp_1'>this lightbulb</a>. If you have a tuya device that is not yet supported or does not work, feel free to contact me.
