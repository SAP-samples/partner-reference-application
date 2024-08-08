using {sap.samples.poetryslams as poetrySlamManagerModel} from '../../db/poetrySlamManagerModel';
using sap from '@sap/cds/common';

//Service for Visitors Application for role PoetrySlamManager
service VisitorService @(path: 'visitorservice') {

  // ----------------------------------------------------------------------------
  // Entity inclusions


  // Visitors
  @odata.draft.enabled
  @Common.SemanticObject: 'visitors'
  @Common.SemanticKey   : [ID]
  entity Visitors    as
                       // Selects all fields of the Visitors database model
                         projection on poetrySlamManagerModel.Visitors {
    *
  };

  @readonly
  @Common.SemanticObject: 'visits'
  @Common.SemanticKey   : [ID]
  entity Visits      as
                       // Only select visits with status booked
                         select * from poetrySlamManagerModel.Visits
  where
    status.code = 1;

  @readonly
  @Common.SemanticObject: 'poetryslams'
  @Common.SemanticKey   : [ID]
  entity PoetrySlams as
                       // Selects specific fields of the PoetrySlams database model
                         select from poetrySlamManagerModel.PoetrySlams {
    ID,
    title,
    dateTime
  };

}
