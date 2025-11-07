'use strict';

// Include super class
const Connector = require('./connector');

const { convertToArray } = require('../../lib/entityCalculations');

// Include cds libraries and reuse files
const cds = require('@sap/cds');

class ConnectorB1 extends Connector {
  purchaseOrderRecord;

  // Constants Definition
  static DESTINATION = 'b1';
  static DESTINATION_URL = 'b1-url';
  static ERP_SYSTEM = 'B1';
  static PURCHASE_ORDER_SERVICE = 'b1_sbs_v2';

  // ----------------------------------------------------------------------------------------------------------------------------------
  // Purchase order data for SAP Business One; needs to be adopted according to SAP Business One configuration of the customer system
  // ----------------------------------------------------------------------------------------------------------------------------------

  static DOC_TYPE = 'dDocument_Service';
  static CARD_CODE = 'V10000';
  static ACCOUNT_CODE = '_SYS00000000001';

  // ----------------------------------------------------------------------------
  // SAP Business One specific reuse functions
  // ----------------------------------------------------------------------------

  constructor(data) {
    super(data);
  }

  // Return json-payload to create SAP Business One purchase order
  purchaseOrderDataRecord(
    poetrySlamIdentifier,
    poetrySlamTitle,
    poetrySlamDescription,
    dateTime,
    poetrySlamMaxVisitorsNumber,
    poetrySlamsVisitorsFeeAmount
  ) {
    try {
      const poetrySlamEventValue =
        poetrySlamMaxVisitorsNumber * poetrySlamsVisitorsFeeAmount;
      const poetrySlamEventExpense = poetrySlamEventValue * 0.5;
      const poetrySlamBuffetExpense = poetrySlamEventExpense * 0.5;
      const purchaseOrderItemAmount = poetrySlamBuffetExpense * 0.1;

      this.purchaseOrderRecord = {
        DocType: ConnectorB1.DOC_TYPE,
        DocDueDate: dateTime,
        CardCode: ConnectorB1.CARD_CODE,
        Comments: `Poet's Buffet for Poetry Slam ${poetrySlamIdentifier} - ${poetrySlamTitle}\n${poetrySlamDescription}`,
        DocumentLines: [
          {
            LineNum: 0,
            ItemDescription:
              'Appetizers: Crab Spring Rolls, Kimchi Potstickers, Pakoras',
            AccountCode: ConnectorB1.ACCOUNT_CODE,
            LineTotal: purchaseOrderItemAmount
          },
          {
            LineNum: 1,
            ItemDescription:
              'First Course: Bouillabaisse, Clam Chowder, Gazpacho',
            AccountCode: ConnectorB1.ACCOUNT_CODE,
            LineTotal: purchaseOrderItemAmount
          },
          {
            LineNum: 2,
            ItemDescription:
              'Main Course: Spaghetti Carbonara, Chicken Tikka Masala, Cheeseburger and Fries',
            AccountCode: ConnectorB1.ACCOUNT_CODE,
            LineTotal: purchaseOrderItemAmount
          },
          {
            LineNum: 3,
            ItemDescription: 'Dessert: Black Forest gateau, Falooda, Apple Pie',
            AccountCode: ConnectorB1.ACCOUNT_CODE,
            LineTotal: purchaseOrderItemAmount
          },
          {
            LineNum: 4,
            ItemDescription: 'All you can eat: Mousse au Chocolat',
            AccountCode: ConnectorB1.ACCOUNT_CODE,
            LineTotal: purchaseOrderItemAmount
          }
        ]
      };
    } catch (error) {
      console.error('ConnectorB1 - purchaseOrderDataRecord:', error);
    }
  }

  // Get the URL of SAP Business One Purchase Order overview screen for UI navigation
  determineDestinationURL(remotePurchaseOrderObjectID) {
    if (!this.systemURL || !remotePurchaseOrderObjectID) {
      console.warn(
        'No valid link to the SAP Business One Purchase Order is available.'
      );
      return '';
    }

    const b1RemotePurchaseOrderExternalURL =
      '/webx/index.html#webclient-OPOR&/Objects/OPOR/Detail?view=OPOR.detailView&id=OPOR%2C' +
      remotePurchaseOrderObjectID;
    return encodeURI(this.systemURL.concat(b1RemotePurchaseOrderExternalURL));
  }

  // Enhance poetry slam with data of remote purchase order
  async readPurchaseOrder(poetrySlams) {
    try {
      // Read PurchaseOrder ID's related to SAP Business One
      let purchaseOrderIDs = [];
      for (const poetrySlam of convertToArray(poetrySlams)) {
        // Check if the Purchase Order ID exists in the poetry slam record AND backend ERP is SAP Business One => read purchase order information from SAP Business One
        if (
          poetrySlam.purchaseOrderSystem == ConnectorB1.ERP_SYSTEM &&
          poetrySlam.purchaseOrderID
        ) {
          purchaseOrderIDs.push(poetrySlam.purchaseOrderID);
        }
      }

      if (!purchaseOrderIDs.length) {
        return poetrySlams;
      }

      // Read SAP Business One purchase order data
      const b1PurchaseOrderService = await cds.connect.to('b1_sbs_v2');

      // Request all associated purchase orders
      // Use the remote service but select from the projection as defined in the PoetrySlamService; CAP takes care of the attribute mapping
      const purchaseOrders = await b1PurchaseOrderService.run(
        SELECT.from('PoetrySlamService.B1PurchaseOrder').where({
          DocNum: purchaseOrderIDs
        })
      );

      // Assemble result
      for (const poetrySlam of convertToArray(poetrySlams)) {
        poetrySlam.toB1PurchaseOrder = purchaseOrders.find(
          (order) => order.docNum.toString() === poetrySlam.purchaseOrderID
        );
      }

      return poetrySlams;
    } catch (error) {
      // App reacts error tolerant in case of calling the remote service, mostly if the remote service is not available of if the destination is missing
      console.error(`ACTION_READ_PURCHASE_ORDER_CONNECTION; ${error}`);
    }
  }

  // POST request to create the purchase order via remote service
  // The request is executed with the remote service and the remote entity definition avoiding CDS data type assertions and a complete model copy of the remote entity and its composition associations
  async insertRemotePurchaseOrderData() {
    const b1PurchaseOrderService = await cds.connect.to('b1_sbs_v2');

    const remotePurchaseOrder = await b1PurchaseOrderService.run(
      INSERT.into(b1PurchaseOrderService.entities.PurchaseOrders).entries(
        this.purchaseOrderRecord
      )
    );

    // Determine purchase order ID and UUID and return it as object
    return {
      purchaseOrderID: remotePurchaseOrder?.DocNum?.toString(),
      purchaseOrderObjectID: remotePurchaseOrder?.DocEntry?.toString()
    };
  }

  // Created a connector instance with destinations
  static async createConnectorInstance(req) {
    const data = await Connector.createConnectorData(
      req,
      ConnectorB1.DESTINATION,
      ConnectorB1.DESTINATION_URL
    );
    const connector = new ConnectorB1(data);
    console.log(
      `SAP Business One connector created - connected: ${data.isConnectedIndicator}`
    );

    return connector;
  }
}

// Publish class
module.exports = ConnectorB1;
