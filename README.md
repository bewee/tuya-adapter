# Tuya Adapter
Tuya Smart Life IoT devices adapter add-on for Mozilla WebThings Gateway.

# Setup
Install this addon through the addon list or clone it to `~/.mozilla-iot/addons/` using git. To add a device, you have to know its `id` and `key` values. Follow the setup instructions <a href='https://github.com/codetheweb/tuyapi/blob/master/docs/SETUP.md'>here</a> on how to obtain these.
To add a device using these values, go to `Settings > Add-ons > Tuya Smart Life > Configure`. Add a new entry in the devices section, put your `id` and `key` values in the according fields and select a device type. After applying, the new device should be available in the "new devices" list.

# Compatible devices
If you happen to own a device that is not on this list, feel free to open an issue or a pull request.

## Plugs
- <a href='https://www.amazon.de/dp/B07CWQGP9C'>TECKIN SP22</a>

## Switches 
(switches with more than one gang have to be added as empty device type right now)
- <a href='https://www.amazon.com/dp/B07RWDQBWQ'>AICLIV KS-602</a>
- <a href='https://www.amazon.com.au/dp/B07GSTJ8TV'>Martin Jerry</a>
- <a href='https://www.amazon.com.au/dp/B07GN8PGC3'>Jinvoo SM-SW102-2</a>

## Colour light bulbs
- <a href='https://www.amazon.com/dp/B07SPZ8MBD'>Bakibo / SLINTINTO</a>
- <a href='https://www.amazon.com/dp/B07XYXY5QR'>LUMIMAN</a> (no colour functionality yet)
