'use strict';

// Include cds libraries and reuse files
const cds = require('@sap/cds');

// Constants Definition
const B1_DESTINATION = 'b1';
const B1_DESTINATION_URL = 'b1-url';
const B1_PURCHASEORDER_SYSTEM = 'B1';

// ----------------------------------------------------------------------------
// SAP Business One specific reuse functions
// ----------------------------------------------------------------------------

// Delegate OData requests to remote SAP Business One purchase order entities
async function delegateODataRequests(req, remoteService) {
  try {
    const b1PurchaseOrder = await cds.connect.to(remoteService);
    return await b1PurchaseOrder.run(req.query);
  } catch (error) {
    console.log(error);
  }
}

// Return json-payload to create SAP Business One purchase order
async function purchaseOrderDataRecord(
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

    const purchaseOrderRecord = {
      DocType: 'dDocument_Service',
      DocDueDate: dateTime,
      CardCode: 'V10000',
      Comments: `Poet's Buffet for Poetry Slam ${poetrySlamIdentifier} - ${poetrySlamTitle}\n${poetrySlamDescription}`,
      DocumentLines: [
        {
          LineNum: 0,
          ItemDescription:
            'Appetizers: Crab Spring Rolls, Kimchi Potstickers, Pakoras',
          AccountCode: '_SYS00000000001',
          LineTotal: purchaseOrderItemAmount
        },
        {
          LineNum: 1,
          ItemDescription:
            'First Course: Bouillabaisse, Clam Chowder, Gazpacho',
          AccountCode: '_SYS00000000001',
          LineTotal: purchaseOrderItemAmount
        },
        {
          LineNum: 2,
          ItemDescription:
            'Main Course: Spaghetti Carbonara, Chicken Tikka Masala, Cheeseburger and Fries',
          AccountCode: '_SYS00000000001',
          LineTotal: purchaseOrderItemAmount
        },
        {
          LineNum: 3,
          ItemDescription: 'Dessert: Black Forest gateau, Falooda, Apple Pie',
          AccountCode: '_SYS00000000001',
          LineTotal: purchaseOrderItemAmount
        },
        {
          LineNum: 4,
          ItemDescription: 'All you can eat: Mousse au Chocolat',
          AccountCode: '_SYS00000000001',
          LineTotal: purchaseOrderItemAmount
        }
      ]
    };
    return purchaseOrderRecord;
  } catch (error) {
    console.log(error);
  }
}

// Expand poetryslams to remote purchase order
async function readPurchaseOrder(poetrySlams) {
  try {
    const b1PurchaseOrder = await cds.connect.to('b1_sbs_v2');
    let isPurchaseOrderIDs = false;
    const asArray = (x) => (Array.isArray(x) ? x : [x]);

    // Read PurchaseOrder ID's related to SAP Business One
    let purchaseOrderIDs = [];
    for (const poetrySlam of asArray(poetrySlams)) {
      // Check if the Purchase Order ID exists in the poetry slam record AND backend ERP is SAP Business One => read purchase order information from SAP Business One
      if (
        poetrySlam.purchaseOrderSystem == B1_PURCHASEORDER_SYSTEM &&
        poetrySlam.purchaseOrderID
      ) {
        purchaseOrderIDs.push(poetrySlam.purchaseOrderID);
        isPurchaseOrderIDs = true;
      }
    }

    // Read SAP Business One purchase order data
    if (!isPurchaseOrderIDs) {
      return poetrySlams;
    }

    // Request all associated purchase orders
    const purchaseOrders = await b1PurchaseOrder.run(
      SELECT.from('PoetrySlamManager.B1PurchaseOrder').where({
        DocNum: purchaseOrderIDs
      })
    );

    // Convert in a map for easier lookup
    const purchaseOrderMap = {};
    for (const purchaseOrder of purchaseOrders)
      purchaseOrderMap[purchaseOrder.DocNum] = purchaseOrder;

    // Assemble result
    for (const poetrySlam of asArray(poetrySlams))
      poetrySlam.toB1PurchaseOrder =
        purchaseOrderMap[poetrySlam.purchaseOrderID];

    return poetrySlams;
  } catch (error) {
    // App reacts error tolerant in case of calling the remote service, mostly if the remote service is not available of if the destination is missing
    console.log('ACTION_READ_PURCHASE_ORDER_CONNECTION' + '; ' + error);
  }
}

// Publish constants and functions
module.exports = {
  readPurchaseOrder,
  purchaseOrderDataRecord,
  delegateODataRequests,
  B1_DESTINATION,
  B1_DESTINATION_URL,
  B1_PURCHASEORDER_SYSTEM
};
