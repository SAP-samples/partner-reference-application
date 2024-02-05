using {PoetrySlamManager} from './poetrySlamManagerService';

// -------------------------------------------------------------------------------
// Annotations for data privacy of entity PoetrySlams
// -------------------------------------------------------------------------------
annotate PoetrySlamManager.PoetrySlams with @PersonalData: {
    // Role of the data subjects in this set
    DataSubjectRole: 'PoetrySlams',
    // Entities containing personal data or references to data subjects but not representing data subjects or data subject details by themselves
    EntitySemantics: 'DataSubject'
} {
    ID         @PersonalData.FieldSemantics              : 'DataSubjectID';
    // Property contains potentially personal data; Personal data is information relating to an identified or identifiable natural person
    createdBy  @PersonalData.IsPotentiallyPersonal; // Only write access is logged for IsPotentiallyPersonal
    modifiedBy @PersonalData.IsPotentiallyPersonal;
};

annotate PoetrySlamManager.Visitors with @PersonalData: {
    // Role of the data subjects in this set
    DataSubjectRole: 'Visitors',
    // Entities describing a data subject (an identified or identifiable natural person), e.g. customer, vendor, employee. These entities are relevant for audit logging.
    EntitySemantics: 'DataSubject'
} {
    ID         @PersonalData.FieldSemantics           : 'DataSubjectID';
    visits     @PersonalData.FieldSemantics           : 'DataSubjectID';
    // Property contains potentially sensitive personal data; Read and write access is logged for IsPotentiallySensitive
    email      @PersonalData.IsPotentiallySensitive;
    name       @PersonalData.IsPotentiallyPersonal;
    createdBy  @PersonalData.IsPotentiallyPersonal;
    modifiedBy @PersonalData.IsPotentiallyPersonal;
};

annotate PoetrySlamManager.Visits with @PersonalData: {
    // Role of the data subjects in this set
    DataSubjectRole: 'Visits',
    // Entities containing details to a data subject but not representing data subjects by themselves, e.g. street addresses, email addresses, phone numbers
    EntitySemantics: 'DataSubjectDetails'
} {
    ID         @PersonalData.FieldSemantics         : 'DataSubjectID';
    visitor    @PersonalData.FieldSemantics         : 'DataSubjectID';
    parent     @PersonalData.FieldSemantics         : 'DataSubjectID';
    createdBy  @PersonalData.IsPotentiallyPersonal;
    modifiedBy @PersonalData.IsPotentiallyPersonal;
};
