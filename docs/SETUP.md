# Setup

You can install this addon through the addon list or clone it to `~/.webthings/addons/` using git. 

The setup process for your tuya devices is currently a little rough: You need to manually obtain the id and key values of your devices and pass these to the add-on config. If you want to contribute to improving this process, have a look at [#28](https://github.com/bewee/tuya-adapter/issues/28).

Here's a very detailed step-by step-guide on how to setup your devices:

1. Add your devices to your network by means of the proprietary app (Tuya, Smart Life, etc.) on your phone/tablet.
2. Create a Tuya developer account on the [iot.tuya.com](iot.tuya.com) website.
3. Create a new project on the website (give it any name, it is not important).
4. With the project you get an Access ID/Client ID and a Access Secret/Client Secret which you will need later in the process.
5. Click on "Link Devices" on the left side of the screen. This will bring you to the Link Devices screen.
6. Click on "Link devices by App Account" in the Link Devices screen.
7. Click on the blue "Add App Account" button on the right side of the screen. This will bring up a QR code to the screen.
8. In the Tuya (or similar) app on your phone, go to the "Me" screen of the app.
9. Click on the scanner icon in the top right corner of the screen. This will open the phone camera. Scan the QR code.
10. This will link your app user account to the project and it will connect the smart devices from your app to the project.
11. Click on "Device List" on the left side of the screen and this will bring up a screen with the smart devices known to your app.
          Attention: You may have to change the "Region" field on the screen from China to Europe to make the device list visible!
12. You will notice that the first column of the device list contains the Device name and the Device ID. You will need the ID's later in the process.
13. Install the Tuya CLI tool on your Raspberry: `npm i @tuyapi/cli -g` (use sudo in case of error messages).
14. Run the Tuya CLI tool (Tuya-CLI wizard). The wizard will prompt you for the following:
             API Key: <enter the Access ID/Client ID from the project you created on the iot.tuya.com website>
             API Secret Value: <give in the Secret/Client Secret from the project you created on the iot.tuya.com website>
             Virtual ID: <enter one of the smart device id's from the device list mentioned above. It does not matter which one>
15. The tool will respond with a list of all the (Tuya compatible) smart devices in your network, together with their ID's and local keys.
16. Go to `Settings > Add-ons > +` in the WebThings gateway and add the Tuya Smart Life add-on to the gateway.
16. Go to `Settings > Add-ons > Tuya Smart Life > Configure` and add an entry for each smart device.
         (enter the ID, the local key and the device type (light, switch, etc. from a drop list).
17. Go to the Things screen of the WebThings gateway and click on the "+" button to search for new devices on the network.
18. After scanning, you will be presented a list of newly found smart devices.
19. Click on the "Save" button of all the devices you want to show on the Things screen.

(Credit goes to @PaulvdL)

There are also some different ways to obtain the id and key values. For more information, have a look at the official tuyapi setup instructions [here](https://github.com/codetheweb/tuyapi/blob/master/docs/SETUP.md).
