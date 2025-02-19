//Domain Models of the Poetry Slam Manager App

namespace sap.samples.poetryslams;

using {
  sap,
  managed,
  cuid
} from '@sap/cds/common';
using from '@sap/cds-common-content';

//Poetry Slams table
//Enforces uniqueness checks on all CREATE and UPDATE operations for the specified fields
@assert.unique: {identifier: [number]}
entity PoetrySlams : cuid, managed {
  number              : String(255);
  title               : String(255);
  description         : String(1000);
  dateTime            : DateTime;
  maxVisitorsNumber   : Integer;
  freeVisitorSeats    : Integer;
  visitorsFeeAmount   : Decimal(6, 2);
  visitorsFeeCurrency : Association to one sap.common.Currencies;
  status              : Association to one PoetrySlamStatusCodes @assert.integrity;
  visits              : Composition of many Visits
                          on visits.parent = $self;
}

//Enforces uniqueness checks on all CREATE and UPDATE operations for the specified fields
@assert.unique: {visitorVisit: [
  parent,
  visitor
]}

//Visits table. Creates relationship between visitors who may be registered for one or many Poetry Slams
//Be aware: the assert.integrity needs to be enabled in the feature section of cds properties in the package.json ("assert_integrity": "db") to take effect
entity Visits : cuid, managed {
  parent          : Association to one PoetrySlams      @assert.integrity;
  visitor         : Association to one Visitors         @assert.integrity;
  artistIndicator : Boolean default false;
  status          : Association to one VisitStatusCodes @assert.integrity;
}

//Visitors table
entity Visitors : cuid, managed {
  name   : String;
  // Regex annotation to validate the input of the email
  email  : String @assert.format: '^[\w\-\.]+@([\w-]+\.)+[\w-]{2,4}$';
  visits : Association to many Visits
             on visits.visitor = $self;
}

entity PoetrySlamStatusCodes : sap.common.CodeList {
      // Set the default status code to 1 (in preparation)
  key code : Integer default 1
      @Common.Text                    : name
      @Common.Text.@UI.TextArrangement: #TextOnly;
}

entity VisitStatusCodes : sap.common.CodeList {
      // No default as status is set as soon as visitor is added
  key code : Integer
      @Common.Text                    : name
      @Common.Text.@UI.TextArrangement: #TextOnly;
}

//i18n annotations for entities
annotate PoetrySlams with @fiori.draft.enabled {
  ID                  @title: '{i18n>uuid}'               @Core.Computed;
  number              @title: '{i18n>number}'             @readonly;
  title               @title: '{i18n>title}'              @mandatory;
  description         @title: '{i18n>description}';
  dateTime            @title: '{i18n>dateTime}'           @mandatory;
  maxVisitorsNumber   @title: '{i18n>maxVisitorsNumber}'  @mandatory;
  freeVisitorSeats    @title: '{i18n>freeVisitorSeats}'   @readonly;
  visitorsFeeAmount   @title: '{i18n>visitorsFeeAmount}'  @Measures.ISOCurrency: visitorsFeeCurrency_code;
  visitorsFeeCurrency @title: '{i18n>visitorsFeeCurrency}';
  status              @title: '{i18n>status}'             @readonly;
  visits              @title: '{i18n>visits}';
}

annotate Visits with {
  ID              @title: '{i18n>uuid}'         @Core.Computed;
  parent          @title: '{i18n>poetrySlamUUID}';
  visitor         @title: '{i18n>visitorUUID}'  @mandatory;
  artistIndicator @title: '{i18n>artistIndicator}';
  status          @title: '{i18n>status}';
}

annotate Visitors with {
  ID     @title: '{i18n>uuid}'   @Core.Computed;
  name   @title: '{i18n>name}'   @mandatory;
  email  @title: '{i18n>email}'  @Communication.IsEmailAddress;
  visits @title: '{i18n>visits}';
}

annotate PoetrySlamStatusCodes with {
  code @title: '{i18n>status}';
}

annotate VisitStatusCodes with {
  code @title: '{i18n>status}';
}
