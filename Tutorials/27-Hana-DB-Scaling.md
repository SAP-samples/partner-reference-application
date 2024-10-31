# Estimating the Required Size of the SAP HANA Cloud Database

The required size of the SAP HANA Cloud Database depends on the design and expected data volume for the entities of your data model. To estimate the size, you can start with a sample data set, determine the consumed size for this sample set and scale by the volume expected for productive usage.

There are two ways to determine the consumption of a database:
1. *SAP HANA Cloud Tools* provide a graphical interface allowing both managing and monitoring your database, including size information.
2. The *SQL-Console* allows in-depth analysis for the entities of your applications, including information per subscription.

## SAP HANA Cloud Tools

To access SAP HANA Cloud Tools:

1. Open the SAP BTP cockpit of your provider subaccount.
2. Select *Instances and Subscriptions*.
3. Open the application *SAP HANA Cloud*.

    > If this is missing, create a subscription for the service *SAP HANA Cloud*, plan *tools*, and assign the Role Collection *SAP HANA Cloud Instance Administrator* to your user. You may need to add the corresponding entitlement to the subaccount first.

4. In *SAP HANA Cloud Central*, select the database instance that you want to analyze.

On the overview page you can find various consumption information, including the storage volume.

## SQL Console

While SAP HANA Cloud Tools provides information on the total consumption, you can use SQL Console to get deeper insights. For example, the data for different subscriptions is stored in separate schemas. So, by analyzing data per schema, you can check the consumption per subscription.

### Mapping Schemas to Consumer Subaccounts

If you want to get the schema used for a consumer subaccount, follow the steps below.

1. Open the provider subaccount
2. Select *Instances and Subscriptions*
3. Under *Instances* expand *poetry-slams-service-manager*
4. After selecting one of the listed instances, you can find the consumer subaccount ID in the section *Labels*. In the section *Service Bindings*, choose the ID that is shown under *Name*. In the displayed credentials, you can find the schema name in the attribute *schema*.

### Accessing the SQL Console 

The SAP Help Portal articles [Open SAP HANA Cloud Central](https://help.sap.com/docs/hana-cloud/683a53aec4fc408783bbb2dd8e47afeb/98793b872315442c906080aebcf0bb44.html) and [Open the SQL Console in SAP HANA Cloud Central](https://help.sap.com/docs/hana-cloud/683a53aec4fc408783bbb2dd8e47afeb/a2b15cf9fbe24ef8a90ffb76cd0eaa5d.html) describe how to access the *SQL console*. To log on, use the database user and the password you defined during [*Create an SAP HANA Cloud Database*](/Tutorials/12-Prepare-Deployment.md#create-an-sap-hana-cloud-database). This logon allows you to select data from all schemas.

It is also possible to get access credentials for a single subscriber instance (that is, a specific database schema). To get these credentials, go to the BTP cockpit of the provider subaccount.

1. Select *Instances and Subscriptions*
2. Under *Instances* expand *poetry-slams-service-manager*
3. After selecting the listed instance belonging to the subscription subaccount you want to analyze, go to the section *Service Bindings* and choose the ID that is shown under *Name*. In the displayed credentials search for the attributes *user* and *password*.

Now the subscriber instance can be added to the *SQL Console*:
1. Open a new tab using the *+* button
2. Under *Connected to* choose *Select an Instance*
3. A new window opens where you can select the required *SAP HANA Cloud Database* 
4. Choose *Connect with Different User*
5. Enter the user and password from the subaccount. Under *Connected to* the instance name is now displayed and can be selected.

### Using the SQL-Console for Database Size Analysis

Depending on the required level of information, you can execute different SQL queries. Below are some examples that you can use as a basis and adjust according to your requirements.

1. Check the consumed storage per subaccount:

    ```sql
    SELECT
        schema_name, 
        SUM(disk_size)
    FROM
        m_table_persistence_statistics
    GROUP BY
        schema_name
    ```

2. Check the consumed storage per table and schema (subaccount):

    ```sql
    SELECT 
        rc.schema_name,
        rc.table_name,
        rc.record_count,
        ds.disk_size,
        ds.disk_size / rc.record_count AS average_record_size 
    FROM
        m_cs_tables AS rc 
    JOIN
        m_table_persistence_statistics AS ds 
        ON rc.schema_name = ds.schema_name AND rc.table_name = ds.table_name 
    WHERE
        rc.record_count > 0 
    ```

3. Check the consumed storage per table column (for a specific table):

    ```sql
    SELECT
        schema_name,
        table_name,
        column_name,
        main_physical_size
    FROM
        m_cs_columns_persistence
    WHERE
        table_name = 'SAP_SAMPLES_POETRYSLAMS_POETRYSLAMS';
    ```

## Differences between SAP HANA Cloud Tools and SQL Console

When comparing the output of the *SQL Console* and *SAP HANA Cloud Tools*, you will find that the totals in *SAP HANA Cloud Tools* are larger. This is expected since *SAP HANA Cloud Tools* additionally shows metadata and temporary data. To take this into account and ensure that there is enough storage available, it is recommended to go with a database memory that is twice the size of the data. Refer to [SAP Note 1999997 on (onPrem) SAP HANA Memory](https://me.sap.com/notes/1999997) for further information.

When choosing the memory size, the (minimum) disk size is calculated automatically together with the number of virtual CPUs (vCPU). The exact scaling factor depends on the chosen performance class (refer to [SAP Note 3397630](https://me.sap.com/notes/0003397630)). The disk size may also be increased in case of special requirements. To get a better understanding of the different configurations, make use of the [SAP HANA Capacity Unit Estimator](https://hcsizingestimator.cfapps.eu10.hana.ondemand.com/).

## Sample Figures for the Poetry Slam Manager

Using the above SQL statements, you can estimate the required database size. The table below shows sample measurements for a given set of data, including visitors, poetry slams, visits, and data that is deployed by reuse packages.

| Entity      | Number of Entries | Disk Size | Remark                                         |
| ----------- | ----------------: | --------: | ---------------------------------------------- |
| PoetrySlams |               900 |   0.17 MB | Several columns dominated by minimum page size |
| Visitors    |            90,000 |   3.95 MB |                                                |
| Visits      |           180,000 |  11.66 MB |                                                |
| Currencies  |               203 |   0.06 MB | Coming from packages @sap/common               |

> Note: The table *PoetrySlams* contains several columns, such as *MODIFIEDAT* or *CREATEDAT*, which are so small, that the default minimum page size per column is consumed. This means that the average size per poetry slam is overestimated. However, this only has negligible influence on the overall estimates.

The numbers above can be used to calculate the required database size volumes for estimated business volumes. Let's assume a typical data volume of two poetry slams per week (or 125 slams per year), each poetry slam with 200 visits. After three years, if you assume that, on average, a visitor books two different poetry slams, for 20 subscriptions (customers), this results in a volume of:
 - 7,500 poetry slam events
 - 750,000 visitors and artists
 - 1,500,000 visits

With the table above, this translates into roughly 100 MB for visits, 33 MB for visitors and less than 2 MB for poetry slams. Even for 100 subscriptions, including the volume of other tables, and adding the recommended additional factor of 2, the total data volume will not exceed a few GB. 

Using the [SAP HANA Capacity Unit Estimator](https://hcsizingestimator.cfapps.eu10.hana.ondemand.com/) and adding assumptions for other input variables like backup size and network volume, you can calculate the required capacity units (CU). For the Poetry Slam Manager the default size settings with the minimum values are sufficient.

This concludes this chapter. You can go back to the [Tutorial Overview Page](../README.md).