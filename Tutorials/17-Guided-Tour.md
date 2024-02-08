# A Guided Tour to Explore the Capabilities of the Sample Application

Put yourself in the shoes of a poetry slam manager: Imagine it's your job to organize and run poetry slams.

Don't worry. With Poetry Slam Manager, a partner application, it's quite simple to organize poetry slams as the app helps you publish them and register artists and guests.

Buckle up and let us take you on a guided tour through the sample solution:

1. Launch your SAP Build Work Zone site by opening the page URL you noted down during the [One-Off Deployment](./15-One-Off-Deployment.md).
        
    > Note: SAP Build Work Zone delegates the user authentication to the Identity Authentication service, which acts as corporate identity provider in this example.

2. On the site, you find Poetry Slam Manager, the partner application. To start the app, click on the tile.
    
    > Note: The Partner Reference Application is embedded in SAP Build Work Zone. Additionally, you can launch other SAP BTP apps relevant for key users and administrators such as Identity Authentication service to manage user authentications and authorizations. To launch these apps, you don't need to log in again as they're linked to your corporate IdP and you can use single sign-on.
    
    <img src="./images/one_off_guided_tour_workzone.png" width="30%">

3. In the Poetry Slam Manager app, you find multiple poetry slams: Some are still in preparation, others have already been published. 

    > Note: You see a metadata-driven UI in line with SAP style guides. Using the UI theme manager, you can choose your favorite theme. Furthermore, you can customize the table layout and adapt the filter area according to your personal preferences. The *Export to Spreadsheet* function allows you to download the poetry slam data into a spreadsheet application. All of these capabilities are provided out of the box without any development efforts.

    <img src="./images/one_off_guided_tour_list.png" width="100%">

4. Select one of the poetry slams that has the status *Published* to see its details.

5. Choose *Edit*, change the description of the poetry slam, and save your changes to publish them.

    > Note: Your changes are immediately saved to the database as *Draft*. Additionally, the system locks the poetry slam for other users to avoid concurrent changes. Only by clicking on *Save*, your changes become visible to all users and the edit-lock gets released. This gives you sufficient time to make your changes.

    <img src="./images/one_off_guided_tour_detail.png" width="100%">

This concludes the guided tour... We hope you enjoyed the ride. 
