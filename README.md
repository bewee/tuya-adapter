# Tuya Adapter
Tuya Smart Life IoT devices adapter add-on for Mozilla WebThings Gateway.

# Setup
Install this addon through the addon list or clone it to `~/.mozilla-iot/addons/` using git. To add a device, you have to know its `id` and `key` values. Follow the setup instructions <a href='https://github.com/codetheweb/tuyapi/blob/master/docs/SETUP.md'>here</a> on how to obtain these.
To add a device using these values, go to `Settings > Add-ons > Tuya Smart Life > Configure`. Add a new entry in the devices section, put your `id` and `key` values in the according fields and select a device type. After applying, the new device should be available in the "new devices" list.

# Compatible devices
If you happen to own a device that is not on this list, feel free to open an issue or a pull request. The config field can usually be left empty, but needs to be filled manually for some devices.

## Colour light bulbs
- <a href='https://www.amazon.com/dp/B07SPZ8MBD'>Bakibo / SLINTINTO</a> (config: `{"minbrightness":10}`)
- <a href='https://www.amazon.com/dp/B07XYXY5QR'>LUMIMAN</a> (config: `{"minbrightness":11,"maxbrightness":255,"maxlighttemperature":255,"format":"HEXHLS"}`)
- <a href='https://www.amazon.com/gp/product/B07R9LKWWJ'>Godotek</a>
- <a href='https://www.amazon.com/gp/product/B07PFS7RY5'>Luntak</a>
- <a href='https://www.amazon.com/gp/product/B07H36GG8L'>Nephalae</a>
- <a href='https://www.amazon.com/gp/product/B07HHYK14L'>Manzoku</a>
- <a href='https://www.amazon.de/gp/product/B07S4C4488/'>AISIRER</a>
- <a href='https://www.amazon.co.uk/gp/product/B07W6Z6KPG/'>avatar controls E14</a> (config: `{"minbrightness":25,"maxbrightness":255,"minlighttemperature":0,"maxlighttemperature":255"}`)

## Dimmers
- <a href='https://www.amazon.com/dp/B07RBQX7BR'>Lumary Dimmer Switch L-DS100</a> (config: `{"maxlevel":100}`)

## Fireplace Heaters
- <a href='https://stoves.stovesguide.biz/uenjoy-embedded-electric-fireplace-insert-heater.html'>Uenjoy Embedded 28.5" Electric Fireplace Insert Heater Log Flame</a> (config: `{"minlevel":0,"maxlevel":2,"minbrightness":0,"maxbrightness":5}`)

## Light bulbs

## Plugs
For plugs with n>1 sockets, use config `{"sockets":n}`
- <a href='https://www.amazon.com/dp/B07MNH3BMS'>Oukitel P1 dual smart plug</a>
- <a href='https://www.amazon.com/dp/B079GT5JFS'>CooWoo AW01 smart plug</a>
- <a href='https://www.amazon.com/dp/B076VRH9WP'>Pinlo Smart strip</a>
- <a href='https://www.amazon.com/dp/B083Z4HPJX'>XS-SSA01 mini smart socket</a>
- <a href='https://www.amazon.com/dp/B077S69421'>W-US002 smart socket</a>
- <a href='https://www.amazon.de/gp/product/B079L6GVNF/'>Yuntong Smart relay</a>

## Plugs with Energy Monitoring
- <a href='https://www.amazon.de/gp/product/B0777BWS1P/'>Gosund Smart Plug / Socket WiFi</a>
- <a href='https://www.amazon.de/dp/B07CWQGP9C'>TECKIN SP22</a>

## Plugs with night light
- <a href='https://aracky.com/products/wifi-smart-plug-in-night-light-led-jackyled-wi-fi-smart-alexa-plug-double-outlet-extender-adjustable-brightest-or-dim-light-for-hallways-kids-dogs-work-with-echo-google-home-assistant-and-ifttt-2-pack'>JACKYLED plug with 2 sockets and night light</a> (config: `{"dps":{"brightness":103},"sockets":2,"minbrightness":1,"maxbrightness":255}`)

## Switches
For n-gang switches (n>1), use config `{"gangs":n}`
- <a href='https://www.amazon.com/dp/B07RWDQBWQ'>AICLIV KS-602</a>
- <a href='https://www.amazon.com.au/dp/B07GSTJ8TV'>Martin Jerry / Tessan wall switch</a>
- <a href='https://www.amazon.com.au/dp/B07GN8PGC3'>Jinvoo SM-SW102-2</a> (config: `{"gangs":2}`)
- <a href='https://www.amazon.com/dp/B07WWYQJFR'>Treatlife Smart Light Switch Single Pole</a>
