using {sap.samples.poetryslams as poetrySlamManagerModel} from '../../db/poetrySlamManagerModel';

//Service for Visitors Application for role PoetrySlamManager
service VisitorService @(path: 'visitorservice') {

  // ----------------------------------------------------------------------------
  // Entity inclusions


  // Select all fields of the Visitors database model
  @odata.draft.enabled
  @Common.SemanticObject: 'visitors'
  @Common.SemanticKey   : [ID]
  entity Visitors    as
    projection on poetrySlamManagerModel.Visitors {
      *
    };

  // Select all fields of the Visits database model with status 'booked'
  @readonly
  @Common.SemanticObject: 'visits'
  @Common.SemanticKey   : [ID]
  entity Visits      as
    select * from poetrySlamManagerModel.Visits
    where
      status.code = 1;

  // Select specific fields of the PoetrySlams database model
  @readonly
  @Common.SemanticObject: 'poetryslams'
  @Common.SemanticKey   : [ID]
  entity PoetrySlams as
    select from poetrySlamManagerModel.PoetrySlams {
      ID,
      title,
      dateTime
    };

}
