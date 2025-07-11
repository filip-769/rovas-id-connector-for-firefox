### **ROVAS Connector for OpenStreetMap iD Editor**

This Chrome extension is designed to seamlessly integrate with the OpenStreetMap (OSM) iD editor, automatically tracking your mapping time and submitting work reports to the [ROVAS App](https://rovas.app/). It simplifies the process of reporting your contributions to the OSM project on Rovas, ensuring accurate and effortless time logging.

________________________________________


**Features**

- Automatic Time Tracking: Records time spent actively editing in the OSM iD editor.
- ROVAS Integration: Automatically submits detailed work reports to the ROVAS App upon changeset upload.
- User-Configurable Credentials: Securely store your ROVAS API Key and Token via the extension's popup.
- Session Control: Start, pause, and stop your mapping sessions directly from a convenient on-screen timer.
- Changeset Data Inclusion: Captures your OSM changeset ID and comment for richer ROVAS reports.
- Shareholder Verification: Automatically checks and registers your participation in the [OpenStreetMap project](https://rovas.app/openstreetmap) within Rovas.

________________________________________


**Installation**

Please note that this extension is currently released in developer mode and is not yet packaged. To install it, you will need to load it as an "unpacked" extension in Chrome.
Prerequisites
- Google Chrome (or Chrome based Openstreetmap App)
- ROVAS Account: You must be a registered user in the [ROVAS App](https://www.google.com/search?q=https://neofund.sk/rovas-api%23) and have your API KEY and TOKEN (available on your account page).
- OSM Project Shareholder: You need to be recognized as a shareholder of the [OpenStreetMap project in Rovas](https://rovas.app/openstreetmap) for reports to be valid. The extension attempts to verify/add this automatically.


**Steps to Install**

1.	Prepare the Extension Files:
    - Create a new folder on your computer (e.g., ROVAS_Connector_Extension).
    - Download all files from this GitHub repository (the manifest.json, content.js, background.js, popup.html, popup.js, and the icon16.png, icon48.png images) and place them directly inside this new folder. Make sure manifest.json is at the very top level of this folder, not inside a subfolder.

2.	Open Chrome Extensions Page:
    - Type chrome://extensions in your Chrome address bar and press Enter.
    <img width="476" height="84" alt="Image" src="https://github.com/user-attachments/assets/6f403442-c08e-49ec-8b5c-c63f03579759" />

    - Alternatively, click the three dots (⋮) in the top right corner of Chrome, go to "More tools," and then select "Extensions."

3.	Enable Developer Mode:
    - Locate the "Developer mode" toggle switch, usually in the top right corner of the extensions page, and turn it ON.
    <img width="707" height="138" alt="Image" src="https://github.com/user-attachments/assets/3b2cac32-e2c7-45a7-817c-2ef684a7e8b5" />

4.	Load Unpacked Extension:
    - Click the "Load unpacked" button that appears after enabling Developer Mode.

5.	Select Extension Folder:
    - Navigate to and select the root folder where you placed the extension files (e.g., ROVAS_Connector_Extension/).
    - Click "Select Folder" (or "Open" on some systems) to load the extension.

6.	Verify Installation:
    - The "ROVAS Connector for iD Editor" extension should now appear in your list of installed extensions.
      <img width="321" height="167" alt="Image" src="https://github.com/user-attachments/assets/697fbb21-957d-416d-98a1-da1fbe7f34a7" />

    - It's recommended to reboot Chrome for the extension to fully initialize after installation.


________________________________________


**Configuration**

After installation, you need to configure your ROVAS API credentials:
1.	Open the Extension Popup: Click on the "ROVAS Connector for iD Editor" icon in your Chrome toolbar.
   <img width="597" height="72" alt="Image" src="https://github.com/user-attachments/assets/6a9b1b4c-4d17-47cc-9408-99d5641b2f03" />

2.	Enter Credentials: In the popup window, you'll find fields for your "API KEY" and "TOKEN."
3.	Save Credentials: Enter your respective API Key and Token from your ROVAS account page, then click the "Save Credentials" button. A confirmation message will appear.
   <img width="394" height="482" alt="Image" src="https://github.com/user-attachments/assets/d30d8c32-d4a8-4247-9e35-f98057ff0289" />

________________________________________


**Usage**

1.	Start Mapping: Navigate to the OpenStreetMap iD editor (https://www.openstreetmap.org/edit).
2.	Timer Badge: You should see a small timer badge appear in the bottom-right corner of the iD editor. The timer will automatically start when the page loads.
    - Use the "Pause" button to temporarily stop tracking time.
    - Use the "Start" button to resume a paused session or begin a new one if it was manually stopped.
    - Use the "Stop" button to manually end the current mapping session. (Note: Manually stopping will not generate a ROVAS report.)
    <img width="610" height="377" alt="Image" src="https://github.com/user-attachments/assets/51ecd970-0364-4b8b-a82f-9af148cb45d5" />

3.	Upload Changeset: When you are finished with your edits in iD, upload your changeset as usual.
4.	Confirmation: Upon successful changeset upload, the extension will automatically attempt to submit a work report to ROVAS. You should see a confirmation message appear from the extension.
   
  	<img width="477" height="283" alt="Image" src="https://github.com/user-attachments/assets/594ebbc1-4b25-4a7f-bd3d-1d78301ea6cf" />
    

________________________________________


**Contributing**

Contributions are welcome! If you have suggestions for improvements, bug reports, or would like to contribute code, please feel free to:
1.	Open an issue on this GitHub repository.
2.	Fork the repository and submit a pull request with your changes.

________________________________________


**License**

This project is licensed under the MIT License. See the [LICENSE](https://www.google.com/search?q=LICENSE) file for details.

________________________________________


**Contact**

For questions or feedback, please open an issue on this GitHub repository.
