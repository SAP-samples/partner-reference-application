# A Guided Tour to Explore the Capabilities of the Sample Application

Put yourself in the shoes of a poetry slam manager: Imagine it's your job to organize and run poetry slams.

Don't worry. With Poetry Slam Manager, a partner application, it's quite simple to organize poetry slams as the app helps you publish them and register artists and guests.

Buckle up and let us take you on a guided tour through the sample solution:

1. Launch your SAP Build Work Zone site by opening the page URL you noted down during the [One-Off Deployment](./15b-One-Off-Deployment.md).
        
    > Note: SAP Build Work Zone delegates the user authentication to the Identity Authentication service, which acts as corporate identity provider in this example.

2. On the site, you find Poetry Slams and Visitors, the partner applications. To start the Poetry Slams app, click on the corresponding tile.
    
    > Note: The Partner Reference Application is embedded in SAP Build Work Zone. Additionally, you can launch other SAP BTP apps relevant for key users and administrators such as Identity Authentication service to manage user authentications and authorizations. To launch these apps, you don't need to log in again as they're linked to your corporate IdP and you can use single sign-on.

    <img src="./images/17_one_off_guided_tour_workzone.png" width="30%">

3. In the Poetry Slams app, you find multiple poetry slams: Some are still in preparation while others have already been published. 

    > Note: You see a metadata-driven UI in line with SAP style guides. Using the UI theme manager, you can choose your favorite theme. Furthermore, you can customize the table layout and adapt the filter area according to your personal preferences. The *Export to Spreadsheet* function allows you to download the poetry slam data into a spreadsheet application. All of these capabilities are provided out of the box without any development efforts.

    <img src="./images/17_one_off_guided_tour_list.png" width="100%">

4. Select one of the poetry slams that has the status *Published* to see its details.

5. Choose *Edit* and change the description of the poetry slam.

    > Note: In addition, you can also change the title, the event date, the price, and the maximum number of visitors.

6. In the *Bookings* table, choose *Create*. Select *nathalie.perrin@pra.ondemand.com* from the value help and set the *Artist* indicator. 

    > Note: A new instance of the visit entity is created.
    
7. Save your changes to publish them.

    > Note: Your changes are immediately saved to the database as *Draft*. Additionally, the system locks the poetry slam for other users to avoid concurrent changes. Only by clicking on *Save*, your changes become visible to all users and the edit lock gets released. This gives you sufficient time to make your changes.

    <img src="./images/17_one_off_guided_tour_poetryslamobjectpage.png" width="100%">

8. Click on *Nathalie Perrin* in the *Bookings* table to get an overview of the booking for *Nathalie Perrin*. 
    
    > Note: You navigated to the *Visits* Object Page of the Poetry Slams application.

    <img src="./images/17_one_off_guided_tour_visitsobjectpage.png" width="100%">

9. Click on the *Maintain Visitor* button to get an overview of all the bookings for *Nathalie Perrin*. 

    > Note: You navigated to the *Visitors* application of the Poetry Slam Manager solution.

    <img src="./images/17_one_off_guided_tour_visitorobjectpage.png" width="100%">

This concludes the guided tour... We hope you enjoyed the ride. 
