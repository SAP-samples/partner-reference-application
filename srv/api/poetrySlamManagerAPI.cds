using {sap.samples.poetryslams as poetrySlamManagerModel} from '../../db/poetrySlamManagerModel';

//Service for Poetry Slam Applications for role PoetrySlamManager
service PoetrySlamManagerAPIService @(path: 'poetryslammanagerapi') {

  // ----------------------------------------------------------------------------
  // Entity inclusions

  // Poetry Slams without draft handling
  entity PoetrySlams as
    projection on poetrySlamManagerModel.PoetrySlams {
      // Selects specific fields of the PoetrySlams domain model
      ID,
      number,
      title,
      description,
      dateTime,
      visitorsFeeAmount,
      visitorsFeeCurrency,
      status,
      visits
    };

  // Extend service entity with SalesOrderID for S/4HANA integration scenario
  extend PoetrySlams with columns {
    salesOrderID
  };

  // Visitors
  entity Visitors    as
    projection on poetrySlamManagerModel.Visitors {
      * // Selects all fields of the Visitors database model
    };

  // Visits
  entity Visits      as
    projection on poetrySlamManagerModel.Visits {
      *
    };
}
