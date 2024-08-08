using {VisitorService} from './visitorService';

// -------------------------------------------------------------------------------
// Annotations for data privacy of entity PoetrySlams
// -------------------------------------------------------------------------------

annotate VisitorService.Visitors with @PersonalData: {
  // Role of the data subjects in this set
  DataSubjectRole: 'Visitors',
  // Entities describing a data subject (an identified or identifiable natural person), e.g. customer, vendor, employee. These entities are relevant for audit logging.
  EntitySemantics: 'DataSubject'
} {
  ID         @PersonalData.FieldSemantics          : 'DataSubjectID';
  visits     @PersonalData.FieldSemantics          : 'DataSubjectID';
  // Property contains potentially sensitive personal data; Read and write access is logged for IsPotentiallySensitive
  email      @PersonalData.IsPotentiallySensitive;
  name       @PersonalData.IsPotentiallyPersonal;
  createdBy  @PersonalData.IsPotentiallyPersonal;
  modifiedBy @PersonalData.IsPotentiallyPersonal;
};
