/* checksum : b8585897e6488ab4ed35a29438c83570 */
@cds.external : true
@m.IsDefaultEntityContainer : 'true'
@sap.message.scope.supported : 'true'
@sap.supported.formats : 'atom json xlsx'
service S4HC_API_BUSINESS_PARTNER {
  @cds.external : true
  @cds.persistence.skip : true
  @sap.content.version : '1'
  @sap.label : 'Email Address'
  entity A_AddressEmailAddress {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Address Number'
    key AddressID : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Person Number'
    key Person : String(10) not null;
    @sap.display.format : 'NonNegative'
    @sap.label : 'Sequence Number'
    key OrdinalNumber : String(3) not null;
    @sap.label : 'Standard addr.'
    @sap.quickinfo : 'Flag: this address is the default address'
    IsDefaultEmailAddress : Boolean;
    @sap.label : 'Email Address'
    EmailAddress : String(241);
    @sap.display.format : 'UpperCase'
    @sap.label : 'E-Mail Address'
    @sap.quickinfo : 'E-Mail Address Search Field'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    SearchEmailAddress : String(20);
    @sap.label : 'Notes'
    @sap.quickinfo : 'Communication link notes'
    AddressCommunicationRemarkText : String(50);
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.content.version : '1'
  @sap.label : 'Fax Number'
  entity A_AddressFaxNumber {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Address Number'
    key AddressID : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Person Number'
    key Person : String(10) not null;
    @sap.display.format : 'NonNegative'
    @sap.label : 'Sequence Number'
    key OrdinalNumber : String(3) not null;
    @sap.label : 'Standard No.'
    @sap.quickinfo : 'Standard Sender Address in this Communication Type'
    IsDefaultFaxNumber : Boolean;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Country/Region'
    @sap.quickinfo : 'Country/Region for Telephone/Fax Number'
    FaxCountry : String(3);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Fax'
    @sap.quickinfo : 'Fax Number: Dialing Code and Number'
    FaxNumber : String(30);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Extension'
    @sap.quickinfo : 'Fax no.: Extension'
    FaxNumberExtension : String(10);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Fax Number'
    @sap.quickinfo : 'Complete Number: Dialing Code+Number+Extension'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    InternationalFaxNumber : String(30);
    @sap.label : 'Notes'
    @sap.quickinfo : 'Communication link notes'
    AddressCommunicationRemarkText : String(50);
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.content.version : '1'
  @sap.label : 'Home Page URL'
  entity A_AddressHomePageURL {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Address Number'
    key AddressID : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Person Number'
    key Person : String(10) not null;
    @sap.display.format : 'NonNegative'
    @sap.label : 'Sequence Number'
    key OrdinalNumber : String(3) not null;
    @sap.display.format : 'Date'
    @sap.label : 'from'
    @sap.quickinfo : 'Valid-from date - in current Release only 00010101 possible'
    key ValidityStartDate : Date not null;
    @sap.label : 'Standard addr.'
    @sap.quickinfo : 'Flag: this address is the default address'
    key IsDefaultURLAddress : Boolean not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'URI address'
    @sap.quickinfo : 'URI address search field'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    SearchURLAddress : String(50);
    @sap.label : 'Notes'
    @sap.quickinfo : 'Communication link notes'
    AddressCommunicationRemarkText : String(50);
    @sap.label : 'URI length'
    @sap.quickinfo : 'URI field length'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    URLFieldLength : Integer;
    @sap.label : 'URI'
    @sap.quickinfo : 'Universal Resource Identifier (URI)'
    WebsiteURL : String(2048);
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.content.version : '1'
  @sap.label : 'Phone Number'
  entity A_AddressPhoneNumber {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Address Number'
    key AddressID : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Person Number'
    key Person : String(10) not null;
    @sap.display.format : 'NonNegative'
    @sap.label : 'Sequence Number'
    key OrdinalNumber : String(3) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Country/Region'
    @sap.quickinfo : 'Country/Region for Telephone/Fax Number'
    DestinationLocationCountry : String(3);
    @sap.label : 'Standard No.'
    @sap.quickinfo : 'Standard Sender Address in this Communication Type'
    IsDefaultPhoneNumber : Boolean;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Telephone'
    @sap.quickinfo : 'Telephone No.: Dialing Code and Number'
    PhoneNumber : String(30);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Extension'
    @sap.quickinfo : 'Telephone no.: Extension'
    PhoneNumberExtension : String(10);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Telephone Number'
    @sap.quickinfo : 'Complete Number: Dialing Code+Number+Extension'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    InternationalPhoneNumber : String(30);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Mobile phone'
    @sap.quickinfo : 'Indicator: Telephone is a Mobile Telephone'
    PhoneNumberType : String(1);
    @sap.label : 'Notes'
    @sap.quickinfo : 'Communication link notes'
    AddressCommunicationRemarkText : String(50);
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.content.version : '1'
  @sap.label : 'Business Partner Address-Dependent ILN'
  entity A_BPAddrDepdntIntlLocNumber {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Business Partner'
    @sap.quickinfo : 'Business Partner Number'
    key BusinessPartner : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Address Number'
    key AddressID : String(10) not null;
    @sap.display.format : 'NonNegative'
    @sap.label : 'Int. location no. 1'
    @sap.quickinfo : 'International location number (part 1)'
    InternationalLocationNumber1 : String(7);
    @sap.display.format : 'NonNegative'
    @sap.label : 'Int. location no. 2'
    @sap.quickinfo : 'International location number (Part 2)'
    InternationalLocationNumber2 : String(5);
    @sap.display.format : 'NonNegative'
    @sap.label : 'Check digit'
    @sap.quickinfo : 'Check digit for the international location number'
    InternationalLocationNumber3 : String(1);
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.content.version : '1'
  @sap.label : 'Address Independent Email Address'
  entity A_BPAddressIndependentEmail {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Business Partner'
    @sap.quickinfo : 'Business Partner Number'
    key BusinessPartner : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Address Number'
    key AddressID : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Person Number'
    key Person : String(10) not null;
    @sap.display.format : 'NonNegative'
    @sap.label : 'Sequence Number'
    key OrdinalNumber : String(3) not null;
    @sap.label : 'Email Address'
    EmailAddress : String(241);
    @sap.label : 'Email is Cur Dflt'
    @sap.quickinfo : 'Indicator : Current Default Email Address'
    IsDefaultEmailAddress : Boolean;
    @sap.display.format : 'Date'
    ValidityStartDate : Date;
    @sap.display.format : 'Date'
    ValidityEndDate : Date;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.content.version : '1'
  @sap.label : 'Address Independent Fax Number'
  entity A_BPAddressIndependentFax {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Business Partner'
    @sap.quickinfo : 'Business Partner Number'
    key BusinessPartner : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Address Number'
    key AddressID : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Person Number'
    key Person : String(10) not null;
    @sap.display.format : 'NonNegative'
    @sap.label : 'Sequence Number'
    key OrdinalNumber : String(3) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Country/Region'
    @sap.quickinfo : 'Country/Region for Telephone/Fax Number'
    FaxCountry : String(3);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Fax'
    @sap.quickinfo : 'Fax Number: Dialing Code and Number'
    FaxAreaCodeSubscriberNumber : String(30);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Extension'
    @sap.quickinfo : 'Fax no.: Extension'
    FaxNumberExtension : String(10);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Fax Number'
    @sap.quickinfo : 'Complete Number: Dialing Code+Number+Extension'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    InternationalFaxNumber : String(30);
    @sap.label : 'Fax is Cur Dflt'
    @sap.quickinfo : 'Indicator : Current Default Fax Number'
    IsDefaultFaxNumber : Boolean;
    @sap.display.format : 'Date'
    ValidityEndDate : Date;
    @sap.display.format : 'Date'
    ValidityStartDate : Date;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.content.version : '1'
  @sap.label : 'Address Independent Mobile Number'
  entity A_BPAddressIndependentMobile {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Business Partner'
    @sap.quickinfo : 'Business Partner Number'
    key BusinessPartner : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Address Number'
    key AddressID : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Person Number'
    key Person : String(10) not null;
    @sap.display.format : 'NonNegative'
    @sap.label : 'Sequence Number'
    key OrdinalNumber : String(3) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Telephone Number'
    @sap.quickinfo : 'Complete Number: Dialing Code+Number+Extension'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    InternationalPhoneNumber : String(30);
    @sap.label : 'TRUE'
    @sap.quickinfo : 'Data element for domain BOOLE: TRUE (=''X'') and FALSE (='' '')'
    IsDefaultPhoneNumber : Boolean;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Country/Region'
    @sap.quickinfo : 'Country/Region for Telephone/Fax Number'
    MobilePhoneCountry : String(3);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Telephone'
    @sap.quickinfo : 'Telephone No.: Dialing Code and Number'
    MobilePhoneNumber : String(30);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Extension'
    @sap.quickinfo : 'Telephone no.: Extension'
    PhoneNumberExtension : String(10);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Phone number type'
    @sap.quickinfo : 'Phone Number Type'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    PhoneNumberType : String(1);
    @sap.display.format : 'Date'
    ValidityStartDate : Date;
    @sap.display.format : 'Date'
    ValidityEndDate : Date;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.content.version : '1'
  @sap.label : 'Address Independent Phone Number'
  entity A_BPAddressIndependentPhone {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Business Partner'
    @sap.quickinfo : 'Business Partner Number'
    key BusinessPartner : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Address Number'
    key AddressID : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Person Number'
    key Person : String(10) not null;
    @sap.display.format : 'NonNegative'
    @sap.label : 'Sequence Number'
    key OrdinalNumber : String(3) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Country/Region'
    @sap.quickinfo : 'Country/Region for Telephone/Fax Number'
    DestinationLocationCountry : String(3);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Telephone Number'
    @sap.quickinfo : 'Complete Number: Dialing Code+Number+Extension'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    InternationalPhoneNumber : String(30);
    @sap.label : 'TRUE'
    @sap.quickinfo : 'Data element for domain BOOLE: TRUE (=''X'') and FALSE (='' '')'
    IsDefaultPhoneNumber : Boolean;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Telephone'
    @sap.quickinfo : 'Telephone No.: Dialing Code and Number'
    PhoneNumber : String(30);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Extension'
    @sap.quickinfo : 'Telephone no.: Extension'
    PhoneNumberExtension : String(10);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Phone number type'
    @sap.quickinfo : 'Phone Number Type'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    PhoneNumberType : String(1);
    @sap.display.format : 'Date'
    ValidityStartDate : Date;
    @sap.display.format : 'Date'
    ValidityEndDate : Date;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.content.version : '1'
  @sap.label : 'Address Independent Website'
  entity A_BPAddressIndependentWebsite {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Business Partner'
    @sap.quickinfo : 'Business Partner Number'
    key BusinessPartner : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Address Number'
    key AddressID : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Person Number'
    key Person : String(10) not null;
    @sap.display.format : 'NonNegative'
    @sap.label : 'Sequence Number'
    key OrdinalNumber : String(3) not null;
    @sap.label : 'Standard addr.'
    @sap.quickinfo : 'Flag: this address is the default address'
    IsDefaultURLAddress : Boolean;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    URLFieldLength : Integer;
    WebsiteURL : String(2048);
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.deletable : 'false'
  @sap.content.version : '1'
  @sap.label : 'Contact Person Address'
  entity A_BPContactToAddress {
    @sap.display.format : 'UpperCase'
    @sap.label : 'BP Relationship No.'
    @sap.quickinfo : 'BP Relationship Number'
    key RelationshipNumber : String(12) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Business Partner'
    @sap.quickinfo : 'Business Partner Number'
    key BusinessPartnerCompany : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Business Partner'
    @sap.quickinfo : 'Business Partner Number'
    key BusinessPartnerPerson : String(10) not null;
    @sap.display.format : 'Date'
    @sap.label : 'Valid To'
    @sap.quickinfo : 'Validity Date (Valid To)'
    key ValidityEndDate : Date not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Address Number'
    key AddressID : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Address Number'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    AddressNumber : String(10);
    @sap.label : 'Street 3'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    AdditionalStreetPrefixName : String(40);
    @sap.label : 'Street 5'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    AdditionalStreetSuffixName : String(40);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Time Zone'
    @sap.quickinfo : 'Address Time Zone'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    AddressTimeZone : String(6);
    @sap.label : 'c/o'
    @sap.quickinfo : 'c/o name'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    CareOfName : String(40);
    @sap.display.format : 'UpperCase'
    @sap.label : 'City Code'
    @sap.quickinfo : 'City code for city/street file'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    CityCode : String(12);
    @sap.label : 'City'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    CityName : String(40);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Company Postal Code'
    @sap.quickinfo : 'Company Postal Code (for Large Customers)'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    CompanyPostalCode : String(10);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Country/Region Key'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    Country : String(3);
    @sap.label : 'County'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    County : String(40);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Delivery Service No.'
    @sap.quickinfo : 'Number of Delivery Service'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    DeliveryServiceNumber : String(10);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Delvry Serv Type'
    @sap.quickinfo : 'Type of Delivery Service'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    DeliveryServiceTypeCode : String(4);
    @sap.label : 'District'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    District : String(40);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Title Key'
    @sap.quickinfo : 'Form-of-Address Key'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    FormOfAddress : String(4);
    @sap.label : 'Full Name'
    @sap.quickinfo : 'Full name of a party (Bus. Partner, Org. Unit, Doc. address)'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    FullName : String(80);
    @sap.label : 'Different City'
    @sap.quickinfo : 'City (different from postal city)'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    HomeCityName : String(40);
    @sap.label : 'House Number'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    HouseNumber : String(10);
    @sap.label : 'Supplement'
    @sap.quickinfo : 'House number supplement'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    HouseNumberSupplementText : String(10);
    @sap.label : 'Language Key'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    Language : String(2);
    @sap.display.format : 'UpperCase'
    @sap.label : 'PO Box'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    POBox : String(10);
    @sap.label : 'PO Box City'
    @sap.quickinfo : 'PO Box city'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    POBoxDeviatingCityName : String(40);
    @sap.display.format : 'UpperCase'
    @sap.label : 'PO Box Ctry/Region'
    @sap.quickinfo : 'PO Box of Country/Region'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    POBoxDeviatingCountry : String(3);
    @sap.display.format : 'UpperCase'
    @sap.label : 'PO Box Region'
    @sap.quickinfo : 'Region for PO Box (Country/Region, State, Province, ...)'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    POBoxDeviatingRegion : String(3);
    @sap.label : 'PO Box w/o No.'
    @sap.quickinfo : 'Flag: PO Box Without Number'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    POBoxIsWithoutNumber : Boolean;
    @sap.label : 'PO Box Lobby'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    POBoxLobbyName : String(40);
    @sap.display.format : 'UpperCase'
    @sap.label : 'PO Box Postal Code'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    POBoxPostalCode : String(10);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Person Number'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    Person : String(10);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Postal Code'
    @sap.quickinfo : 'City Postal Code'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    PostalCode : String(10);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Comm. Method'
    @sap.quickinfo : 'Communication Method (Key) (Business Address Services)'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    PrfrdCommMediumType : String(3);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Region'
    @sap.quickinfo : 'Region (State, Province, County)'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    Region : String(3);
    @sap.label : 'Street'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    StreetName : String(60);
    @sap.label : 'Street 2'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    StreetPrefixName : String(40);
    @sap.label : 'Street 4'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    StreetSuffixName : String(40);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Tax Jurisdiction'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    TaxJurisdiction : String(15);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Transportation Zone'
    @sap.quickinfo : 'Transportation zone to or from which the goods are delivered'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    TransportZone : String(10);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Address Version'
    @sap.quickinfo : 'Version ID for International Addresses'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    AddressRepresentationCode : String(1);
    @sap.label : 'Building code'
    @sap.quickinfo : 'Building (number or code)'
    ContactPersonBuilding : String(10);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Comm. Method'
    @sap.quickinfo : 'Communication Method (Key) (Business Address Services)'
    ContactPersonPrfrdCommMedium : String(3);
    @sap.label : 'Department'
    ContactRelationshipDepartment : String(40);
    @sap.label : 'Function'
    ContactRelationshipFunction : String(40);
    @sap.label : 'Short name'
    @sap.quickinfo : 'Short name for correspondence'
    CorrespondenceShortName : String(10);
    @sap.label : 'Floor'
    @sap.quickinfo : 'Floor in building'
    Floor : String(10);
    @sap.label : 'Internal mail'
    @sap.quickinfo : 'Internal Mail Postal Code'
    InhouseMail : String(10);
    @sap.label : 'Stand. address'
    @sap.quickinfo : 'Indicator: Address is standard address'
    IsDefaultAddress : Boolean;
    @sap.label : 'Room Number'
    @sap.quickinfo : 'Room or Apartment Number'
    RoomNumber : String(10);
    to_EmailAddress : Association to many A_AddressEmailAddress {  };
    to_FaxNumber : Association to many A_AddressFaxNumber {  };
    to_MobilePhoneNumber : Association to many A_AddressPhoneNumber {  };
    to_PhoneNumber : Association to many A_AddressPhoneNumber {  };
    to_URLAddress : Association to many A_AddressHomePageURL {  };
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'false'
  @sap.deletable : 'false'
  @sap.content.version : '1'
  @sap.label : 'Function and Department'
  entity A_BPContactToFuncAndDept {
    @sap.display.format : 'UpperCase'
    @sap.label : 'BP Relationship No.'
    @sap.quickinfo : 'BP Relationship Number'
    key RelationshipNumber : String(12) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Business Partner'
    @sap.quickinfo : 'Business Partner Number'
    key BusinessPartnerCompany : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Business Partner'
    @sap.quickinfo : 'Business Partner Number'
    key BusinessPartnerPerson : String(10) not null;
    @sap.display.format : 'Date'
    @sap.label : 'Valid To'
    @sap.quickinfo : 'Validity Date (Valid To)'
    key ValidityEndDate : Date not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Authority'
    @sap.quickinfo : 'Partner''s Authority'
    ContactPersonAuthorityType : String(1);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Department'
    ContactPersonDepartment : String(4);
    @sap.label : 'Company department'
    @sap.quickinfo : 'Department at business partner'
    ContactPersonDepartmentName : String(40);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Function'
    @sap.quickinfo : 'Function of partner'
    ContactPersonFunction : String(4);
    @sap.label : 'Function name'
    @sap.quickinfo : 'Function name of partner'
    ContactPersonFunctionName : String(40);
    @sap.label : 'Note'
    @sap.quickinfo : 'Notes for Partner'
    ContactPersonRemarkText : String(40);
    @sap.display.format : 'UpperCase'
    @sap.label : 'VIP'
    @sap.quickinfo : 'VIP Partner'
    ContactPersonVIPType : String(1);
    @sap.label : 'Email Address'
    EmailAddress : String(241);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Fax'
    @sap.quickinfo : 'Fax Number: Dialing Code and Number'
    FaxNumber : String(30);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Extension'
    @sap.quickinfo : 'Fax no.: Extension'
    FaxNumberExtension : String(10);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Telephone'
    @sap.quickinfo : 'Telephone No.: Dialing Code and Number'
    PhoneNumber : String(30);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Extension'
    @sap.quickinfo : 'Telephone no.: Extension'
    PhoneNumberExtension : String(10);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Relationship Cat.'
    @sap.quickinfo : 'Business Partner Relationship Category'
    RelationshipCategory : String(6);
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.deletable : 'false'
  @sap.content.version : '1'
  @sap.label : 'Credit Worthiness'
  entity A_BPCreditWorthiness {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Business Partner'
    @sap.quickinfo : 'Business Partner Number'
    key BusinessPartner : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Credit Standing'
    BusPartCreditStanding : String(1);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Stat.Cred.Stndg Info'
    @sap.quickinfo : 'Status of Credit Standing Information'
    BPCreditStandingStatus : String(1);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Cred.Stndg Inst'
    @sap.quickinfo : 'Institute Providing Credit Standing Information'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    CreditRatingAgency : String(4);
    @sap.label : 'Credit Standing Text'
    @sap.quickinfo : 'Additional Credit Standing Information'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    BPCreditStandingComment : String(50);
    @sap.display.format : 'Date'
    @sap.label : 'Dt.Cred. Stndg Info.'
    @sap.quickinfo : 'Date of Credit Standing Information'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    BPCreditStandingDate : Date;
    @sap.label : 'Rating'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    BPCreditStandingRating : String(3);
    @sap.display.format : 'NonNegative'
    @sap.label : 'Status of Leg. Proc.'
    @sap.quickinfo : 'Status of Legal Proceedings'
    BPLegalProceedingStatus : String(2);
    @sap.display.format : 'Date'
    @sap.label : 'Date of Legal Proc.'
    @sap.quickinfo : 'Date of Initiation of Legal Proceedings'
    BPLglProceedingInitiationDate : Date;
    @sap.label : 'Affidavit'
    BusinessPartnerIsUnderOath : Boolean;
    @sap.display.format : 'Date'
    @sap.label : 'Date of affidavit'
    BusinessPartnerOathDate : Date;
    @sap.label : 'Bankruptcy Proceed.'
    @sap.quickinfo : 'Launch Bankruptcy Proceedings'
    BusinessPartnerIsBankrupt : Boolean;
    @sap.display.format : 'Date'
    @sap.label : 'Bankruptcy Pr. Date'
    @sap.quickinfo : 'Commencement Date of Bankruptcy Proceedings'
    BusinessPartnerBankruptcyDate : Date;
    @sap.label : 'Foreclosure'
    BPForeclosureIsInitiated : Boolean;
    @sap.display.format : 'Date'
    @sap.label : 'Date of foreclosure'
    BPForeclosureDate : Date;
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    BPCrdtWrthnssAccessChkIsActive : String(1);
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.deletable : 'false'
  @sap.content.version : '1'
  @sap.label : 'Business Partner Data Controller'
  entity A_BPDataController {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Business Partner'
    @sap.quickinfo : 'Business Partner Number'
    key BusinessPartner : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Data Controller'
    @sap.quickinfo : 'BP: Data Controller'
    key DataController : String(30) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Purpose'
    @sap.quickinfo : 'BP: Purpose'
    key PurposeForPersonalData : String(30) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Asgmt. Status'
    @sap.quickinfo : 'BP: Data Controller Purpose Assignment Status'
    DataControlAssignmentStatus : String(1);
    @sap.display.format : 'UpperCase'
    @sap.label : 'DC Derv. Ind.'
    @sap.quickinfo : 'BP: Derivation Indicator for Data Controller (DC)'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    BPDataControllerIsDerived : String(1);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Pur. Derv. Ind.'
    @sap.quickinfo : 'BP: Derivation Indicator for Purpose'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    PurposeDerived : String(1);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Purpose Type'
    @sap.quickinfo : 'BP: Purpose Type'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    PurposeType : String(1);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Purpose Completed'
    @sap.quickinfo : 'Business Purpose Completed Flag'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    BusinessPurposeFlag : String(1);
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.content.version : '1'
  @sap.label : 'Employment Overview'
  entity A_BPEmployment {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Business Partner'
    @sap.quickinfo : 'Business Partner Number'
    key BusinessPartner : String(10) not null;
    @sap.display.format : 'Date'
    @sap.label : 'Employed from'
    key BPEmploymentStartDate : Date not null;
    @sap.display.format : 'Date'
    @sap.label : 'Employed Until'
    BPEmploymentEndDate : Date;
    @sap.display.format : 'NonNegative'
    @sap.label : 'Employment Status'
    BPEmploymentStatus : String(2);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Industry'
    BusPartEmplrIndstryCode : String(10);
    @sap.label : 'Employer'
    @sap.quickinfo : 'Name of Employer of a Natural Person'
    BusinessPartnerEmployerName : String(35);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Occupation'
    @sap.quickinfo : 'Occupation/group'
    BusinessPartnerOccupationGroup : String(4);
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.deletable : 'false'
  @sap.content.version : '1'
  @sap.label : 'Financial Services Details'
  entity A_BPFinancialServicesExtn {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Business Partner'
    @sap.quickinfo : 'Business Partner Number'
    key BusinessPartner : String(10) not null;
    @sap.label : 'VIP Business Partner'
    @sap.quickinfo : 'Business Partner Is VIP'
    BusinessPartnerIsVIP : Boolean;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Trading Partner No.'
    @sap.quickinfo : 'Company ID of Trading Partner'
    TradingPartner : String(6);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Factory calendar'
    FactoryCalendar : String(2);
    @sap.display.format : 'UpperCase'
    @sap.label : 'C/R of Reg. Office'
    @sap.quickinfo : 'Country/Region of Registered Office'
    BusinessPartnerOfficeCountry : String(3);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Region'
    @sap.quickinfo : 'Region of Registered Office'
    BusinessPartnerOfficeRegion : String(3);
    @sap.label : 'Registered Office'
    BPRegisteredOfficeName : String(35);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Bal. Sheet Currency'
    @sap.quickinfo : 'Balance Sheet Currency'
    @sap.semantics : 'currency-code'
    BPBalanceSheetCurrency : String(5);
    @sap.unit : 'BPBalanceSheetCurrency'
    @sap.label : 'Capital increase'
    @sap.quickinfo : 'Amount of last capital increase'
    BPLastCptlIncrAmtInBalShtCrcy : Decimal(16, 3);
    @sap.display.format : 'NonNegative'
    @sap.label : 'Year'
    @sap.quickinfo : 'Year of Last Capital Increase'
    BPLastCapitalIncreaseYear : String(4);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Bal.Sheet Disp.'
    @sap.quickinfo : 'Balance Sheet Display'
    BPBalanceSheetDisplayType : String(1);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Citizenship'
    BusinessPartnerCitizenship : String(3);
    @sap.display.format : 'NonNegative'
    @sap.label : 'Marital prop. regime'
    @sap.quickinfo : 'Marital property regime'
    BPMaritalPropertyRegime : String(2);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Currency'
    @sap.quickinfo : 'Currency of Net Income'
    @sap.semantics : 'currency-code'
    BusinessPartnerIncomeCurrency : String(5);
    @sap.label : 'Children'
    @sap.quickinfo : 'Number of Children Belonging to the Business Partner'
    BPNumberOfChildren : Decimal(2, 0);
    @sap.label : 'Household Members'
    @sap.quickinfo : 'Number of People Living in the Household'
    BPNumberOfHouseholdMembers : Decimal(2, 0);
    @sap.unit : 'BusinessPartnerIncomeCurrency'
    @sap.label : 'Net Annual Income'
    BPAnnualNetIncAmtInIncomeCrcy : Decimal(16, 3);
    @sap.unit : 'BusinessPartnerIncomeCurrency'
    @sap.label : 'Monthly Net Income'
    @sap.quickinfo : 'Monthly Net Income of Business Partner'
    BPMonthlyNetIncAmtInIncomeCrcy : Decimal(16, 3);
    @sap.display.format : 'NonNegative'
    @sap.label : 'Year'
    @sap.quickinfo : 'Year of Net Annual Income'
    BPAnnualNetIncomeYear : String(4);
    @sap.display.format : 'NonNegative'
    @sap.label : 'Month'
    @sap.quickinfo : 'Calendar Month of Monthly Net Income'
    BPMonthlyNetIncomeMonth : String(2);
    @sap.display.format : 'NonNegative'
    @sap.label : 'Year'
    @sap.quickinfo : 'Year of Monthly Net Income'
    BPMonthlyNetIncomeYear : String(4);
    @sap.label : 'Place of Death'
    @sap.quickinfo : 'Name of Place of Death of Natural Person'
    BPPlaceOfDeathName : String(40);
    @sap.label : 'Undesirable Customer'
    CustomerIsUnwanted : Boolean;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Reason Undes.'
    @sap.quickinfo : 'Reason for Undesirability'
    UndesirabilityReason : String(2);
    @sap.label : 'Comment'
    @sap.quickinfo : 'Comment on Undesirability'
    UndesirabilityComment : String(35);
    @sap.display.format : 'Date'
    @sap.label : 'Last Cust. Contact'
    @sap.quickinfo : 'Date of Last Customer Contact'
    LastCustomerContactDate : Date;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Grouping Charact.'
    @sap.quickinfo : 'Grouping Characteristic'
    BPGroupingCharacter : String(10);
    @sap.display.format : 'NonNegative'
    @sap.label : 'Salutation'
    BPLetterSalutation : String(2);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Target Group'
    BusinessPartnerTargetGroup : String(4);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Employee Group'
    BusinessPartnerEmployeeGroup : String(4);
    @sap.label : 'Employee'
    BusinessPartnerIsEmployee : Boolean;
    @sap.display.format : 'Date'
    @sap.label : 'End Date'
    @sap.quickinfo : 'Termination Date for Business Relations with the Bank'
    BPTermnBusRelationsBankDate : Date;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.deletable : 'false'
  @sap.content.version : '1'
  @sap.label : 'Financial Services Reporting'
  entity A_BPFinancialServicesReporting {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Business Partner'
    @sap.quickinfo : 'Business Partner Number'
    key BusinessPartner : String(10) not null;
    @sap.label : 'Non-Resident'
    @sap.quickinfo : 'Non-Resident According to Paragraph 4 AWG'
    BPIsNonResident : Boolean;
    @sap.display.format : 'Date'
    @sap.label : 'Non-Resident Since'
    @sap.quickinfo : 'Start of Non-Residency According to Paragraph 4 AWG'
    BPNonResidencyStartDate : Date;
    @sap.label : 'Multimillion Loan'
    @sap.quickinfo : 'Recipient of Multimillion Loan According to Paragraph 14 GBA'
    BPIsMultimillionLoanRecipient : Boolean;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Borrower Number'
    @sap.quickinfo : 'Borrower Number for Reporting a Loan According to GBA'
    BPLoanReportingBorrowerNumber : String(8);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Borr. Entity No.'
    @sap.quickinfo : 'Borrower Entity Number Used to Report Loan acc. to GBA'
    BPLoanRptgBorrowerEntityNumber : String(8);
    @sap.display.format : 'NonNegative'
    @sap.label : 'GBA Information'
    @sap.quickinfo : 'Credit Standing Review According to Paragraph 18 GBA'
    BPCreditStandingReview : String(2);
    @sap.display.format : 'Date'
    @sap.label : 'Cred.Stand.Rev.Dat'
    @sap.quickinfo : 'Date of Credit Standing Review According to Paragraph 18 GBA'
    BPCreditStandingReviewDate : Date;
    @sap.display.format : 'NonNegative'
    @sap.label : 'Manag.Loan Recipient'
    @sap.quickinfo : 'Loan to Manager According to Paragraph 15 German Banking Act'
    BusinessPartnerLoanToManager : String(2);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Org. Relation.'
    @sap.quickinfo : 'Organization Relationship'
    BPCompanyRelationship : String(1);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Creditor Number'
    @sap.quickinfo : 'Creditor Number for Reporting a Loan According to GBA'
    BPLoanReportingCreditorNumber : String(8);
    @sap.display.format : 'UpperCase'
    @sap.label : '(OeNB) Ident Number'
    BPOeNBIdentNumber : String(11);
    @sap.display.format : 'UpperCase'
    @sap.label : 'OeNB Target Grp'
    @sap.quickinfo : 'Target Group According to OeNB'
    BPOeNBTargetGroup : String(2);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Assign Ident Number'
    @sap.quickinfo : 'Assign (OeNB) Ident Number'
    BPOeNBIdentNumberAssigned : String(1);
    @sap.display.format : 'UpperCase'
    @sap.label : 'OeNB Inst. No.'
    @sap.quickinfo : 'Institute Number According to OeNB'
    BPOeNBInstituteNumber : String(7);
    @sap.label : 'OeNB Rep.Instit.'
    @sap.quickinfo : 'Institute Subject to Austrian Reg. Reporting Requirements'
    BusinessPartnerIsOeNBInstitute : Boolean;
    @sap.label : 'Group ID'
    BusinessPartnerGroup : String(15);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Grp Assignment Cat.'
    @sap.quickinfo : 'Group Assignment Category'
    BPGroupAssignmentCategory : String(1);
    @sap.label : 'Group Name'
    BusinessPartnerGroupName : String(50);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Legal Entity'
    @sap.quickinfo : 'Legal Entity for Business Partner'
    BusinessPartnerLegalEntity : String(2);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Par.4/2 AR'
    @sap.quickinfo : 'Business Partner Acc. to Para. 4, Sec. 2 of Asset Regulation'
    BPGerAstRglnRestrictedAstQuota : String(1);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Debtor Group'
    @sap.quickinfo : 'Debtor Group According to German Law (BerVersV, Template 5)'
    BusinessPartnerDebtorGroup : String(1);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Business Purpose'
    @sap.quickinfo : 'Category of Business Purpose'
    BusinessPartnerBusinessPurpose : String(2);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Risk Group'
    BusinessPartnerRiskGroup : String(1);
    @sap.display.format : 'Date'
    @sap.label : 'Grouping Date'
    @sap.quickinfo : 'Date of Risk Grouping'
    BPRiskGroupingDate : Date;
    @sap.label : 'Group Affiliation'
    @sap.quickinfo : 'Group Affiliation Exists'
    BPHasGroupAffiliation : Boolean;
    @sap.label : 'Mon. Fin. Instit.'
    @sap.quickinfo : 'Monetary Financial Institution'
    BPIsMonetaryFinInstitution : Boolean;
    @sap.label : 'GBA Para.18 Relevant'
    @sap.quickinfo : 'Obligation to Submit to Credit Standing Review - Para.18 GBA'
    BPCrdtStandingReviewIsRequired : Boolean;
    @sap.label : 'Lge-Scale Loan Mon.'
    @sap.quickinfo : 'Large-Scale Loan Monitoring According to Paragraph 13b GBA'
    BPLoanMonitoringIsRequired : Boolean;
    @sap.label : 'Crediting Relief'
    @sap.quickinfo : 'Crediting Relief in Accordance with Paragraph 13/3 GBA'
    BPHasCreditingRelief : Boolean;
    @sap.label : 'Para. 2(1)18b GAR'
    @sap.quickinfo : 'Authorized Acc. to Para. 2(1)18b of German Asset Regulation'
    BPInvestInRstrcdAstIsAuthzd : Boolean;
    @sap.display.format : 'UpperCase'
    @sap.label : 'SCB Cntry/Reg. Ind.'
    @sap.quickinfo : 'Numeric Code for State Central Bank Country/Region Indicator'
    BPCentralBankCountryRegion : String(4);
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.content.version : '1'
  @sap.label : 'Fiscal Year Information'
  entity A_BPFiscalYearInformation {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Business Partner'
    @sap.quickinfo : 'Business Partner Number'
    key BusinessPartner : String(10) not null;
    @sap.display.format : 'NonNegative'
    @sap.label : 'Fiscal year'
    key BusinessPartnerFiscalYear : String(4) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Bal. Sheet Currency'
    @sap.quickinfo : 'Balance Sheet Currency'
    @sap.semantics : 'currency-code'
    BPBalanceSheetCurrency : String(5);
    @sap.display.format : 'Date'
    @sap.label : 'Ann.Stckhold.Meeting'
    @sap.quickinfo : 'Date of Annual Stockholders Meeting'
    BPAnnualStockholderMeetingDate : Date;
    @sap.display.format : 'Date'
    @sap.label : 'Fisc.Year Start Date'
    @sap.quickinfo : 'Fiscal Year Start Date'
    BPFiscalYearStartDate : Date;
    @sap.display.format : 'Date'
    @sap.label : 'Fiscal Year End'
    @sap.quickinfo : 'Fiscal Year End Date'
    BPFiscalYearEndDate : Date;
    @sap.label : 'Year-End Closing'
    BPFiscalYearIsClosed : Boolean;
    @sap.display.format : 'Date'
    @sap.label : 'Year-End Closing'
    @sap.quickinfo : 'Year-End Closing Date for Fiscal Year'
    BPFiscalYearClosingDate : Date;
    @sap.display.format : 'Date'
    @sap.label : 'Cons.Fin.Statements'
    @sap.quickinfo : 'Date of Consolidated Financial Statements of Group Company'
    BPFsclYrCnsldtdFinStatementDte : Date;
    @sap.unit : 'BPBalanceSheetCurrency'
    @sap.label : 'Capital Stock'
    @sap.quickinfo : 'Amount of Authorized Capital Stock for Company'
    BPCapitalStockAmtInBalShtCrcy : Decimal(16, 3);
    @sap.unit : 'BPBalanceSheetCurrency'
    @sap.label : 'Issued Stock Capital'
    @sap.quickinfo : 'Amount of Issued Stock Capital for Company'
    BPIssdStockCptlAmtInBalShtCrcy : Decimal(16, 3);
    @sap.unit : 'BPBalanceSheetCurrency'
    @sap.label : 'Part.Certs Outstand.'
    @sap.quickinfo : 'Amount of Participation Certificates Outstanding for Company'
    BPPartcipnCertAmtInBalShtCrcy : Decimal(16, 3);
    @sap.unit : 'BPBalanceSheetCurrency'
    @sap.label : 'Equity capital'
    @sap.quickinfo : 'Amount of Equity Capital for Company'
    BPEquityCapitalAmtInBalShtCrcy : Decimal(16, 3);
    @sap.unit : 'BPBalanceSheetCurrency'
    @sap.label : 'Gross Premium'
    BPGrossPremiumAmtInBalShtCrcy : Decimal(16, 3);
    @sap.unit : 'BPBalanceSheetCurrency'
    @sap.label : 'Net Premium'
    BPNetPremiumAmtInBalShtCrcy : Decimal(16, 3);
    @sap.unit : 'BPBalanceSheetCurrency'
    @sap.label : 'Annual sales'
    @sap.quickinfo : 'Amount of Annual Sales for Company'
    BPAnnualSalesAmtInBalShtCrcy : Decimal(16, 3);
    @sap.unit : 'BPBalanceSheetCurrency'
    @sap.label : 'Annual Net Income'
    @sap.quickinfo : 'Amount of Annual Net Income/Net Loss for Company'
    BPAnnualNetIncAmtInBalShtCrcy : Decimal(16, 3);
    @sap.unit : 'BPBalanceSheetCurrency'
    @sap.label : 'Dividend'
    @sap.quickinfo : 'Dividend/Profit Distribution Amount for Company'
    BPDividendDistrAmtInBalShtCrcy : Decimal(16, 3);
    @sap.label : 'Debt ratio'
    @sap.quickinfo : 'Debt Ratio in Years'
    BPDebtRatioInYears : Decimal(6, 3);
    @sap.unit : 'BPBalanceSheetCurrency'
    @sap.label : 'Reported Profit'
    @sap.quickinfo : 'Amount of Annual Profit/Loss for Organization'
    BPAnnualPnLAmtInBalShtCrcy : Decimal(16, 3);
    @sap.unit : 'BPBalanceSheetCurrency'
    @sap.label : 'Balance Sheet Total'
    @sap.quickinfo : 'Amount of Balance Sheet Total for Company'
    BPBalSheetTotalAmtInBalShtCrcy : Decimal(16, 3);
    @sap.display.format : 'NonNegative'
    @sap.label : 'Number of Employees'
    @sap.quickinfo : 'Number of Employees in Company'
    BPNumberOfEmployees : String(7);
    @sap.unit : 'BPBalanceSheetCurrency'
    @sap.label : 'Capital Reserve'
    @sap.quickinfo : 'Amount of Capital Reserve for Company'
    BPCptlReserveAmtInBalShtCrcy : Decimal(16, 3);
    @sap.unit : 'BPBalanceSheetCurrency'
    @sap.label : 'Legal Revenue Res.'
    @sap.quickinfo : 'Amount of Legal Revenue Reserves for Company'
    BPLglRevnRsrvAmtInBalShtCrcy : Decimal(16, 3);
    @sap.unit : 'BPBalanceSheetCurrency'
    @sap.label : 'Rev.Reserves.OwnSt.'
    @sap.quickinfo : 'Revenue Reserves for Own Stock'
    RevnRsrvOwnStkAmtInBalShtCrcy : Decimal(16, 3);
    @sap.unit : 'BPBalanceSheetCurrency'
    @sap.label : 'Statutory Reserve'
    @sap.quickinfo : 'Amount of Statutory Revenue Reserve for Company'
    BPStatryReserveAmtInBalShtCrcy : Decimal(16, 3);
    @sap.unit : 'BPBalanceSheetCurrency'
    @sap.label : 'Other Revenue Res.'
    @sap.quickinfo : 'Amount of Other Revenue Reserves for Company'
    BPOthRevnRsrvAmtInBalShtCrcy : Decimal(16, 3);
    @sap.unit : 'BPBalanceSheetCurrency'
    @sap.label : 'P/L Carried Fwd'
    @sap.quickinfo : 'Amount of Profit/Loss Carried Forward for Company'
    BPPnLCarryfwdAmtInBalShtCrcy : Decimal(16, 3);
    @sap.unit : 'BPBalanceSheetCurrency'
    @sap.label : 'Subord. Liabilities'
    @sap.quickinfo : 'Amount of Subordinated Liabilities for Company'
    BPSuborddLbltyAmtInBalShtCrcy : Decimal(16, 3);
    @sap.label : 'Return on Tot.Cap.'
    @sap.quickinfo : 'Return on Total Capital Employed for Company in Percent'
    BPRetOnTotalCptlEmpldInPercent : Decimal(5, 2);
    @sap.label : 'Debt Clearance Per.'
    @sap.quickinfo : 'Debt Clearance Period in Years'
    BPDebtClearancePeriodInYears : Decimal(5, 2);
    @sap.label : 'Financing Coeff.'
    @sap.quickinfo : 'Financing Coefficient for Company in Percent'
    BPFinancingCoeffInPercent : Decimal(5, 2);
    @sap.label : 'Equity Ratio'
    @sap.quickinfo : 'Equity Ratio of Company in Percent'
    BPEquityRatioInPercent : Decimal(5, 2);
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.content.version : '1'
  @sap.label : 'BP International Address Version'
  entity A_BPIntlAddressVersion {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Business Partner'
    @sap.quickinfo : 'Business Partner Number'
    key BusinessPartner : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Address Number'
    key AddressID : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Address Version'
    @sap.quickinfo : 'Version ID for International Addresses'
    key AddressRepresentationCode : String(1) not null;
    @sap.label : 'Full Name'
    @sap.quickinfo : 'Full Name of Person'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    AddresseeFullName : String(80);
    @sap.display.format : 'UpperCase'
    @sap.label : 'External Address No.'
    @sap.quickinfo : 'Address number in external system'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    AddressIDByExternalSystem : String(20);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Person Number'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    AddressPersonID : String(10);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Search Term 1'
    AddressSearchTerm1 : String(20);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Search Term 2'
    AddressSearchTerm2 : String(20);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Time Zone'
    @sap.quickinfo : 'Address Time Zone'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    AddressTimeZone : String(6);
    @sap.label : 'c/o'
    @sap.quickinfo : 'c/o name'
    CareOfName : String(40);
    @sap.label : 'City'
    CityName : String(40);
    @sap.display.format : 'UpperCase'
    @sap.label : 'City Code'
    @sap.quickinfo : 'City code for city/street file'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    CityNumber : String(12);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Company Postal Code'
    @sap.quickinfo : 'Company Postal Code (for Large Customers)'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    CompanyPostalCode : String(10);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Country/Region Key'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    Country : String(3);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Delivery Service No.'
    @sap.quickinfo : 'Number of Delivery Service'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    DeliveryServiceNumber : String(10);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Delvry Serv Type'
    @sap.quickinfo : 'Type of Delivery Service'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    DeliveryServiceTypeCode : String(4);
    @sap.label : 'District'
    DistrictName : String(40);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Title Key'
    @sap.quickinfo : 'Form-of-Address Key'
    FormOfAddress : String(4);
    @sap.label : 'House Number'
    HouseNumber : String(10);
    @sap.label : 'Supplement'
    @sap.quickinfo : 'House number supplement'
    HouseNumberSupplementText : String(10);
    @sap.label : 'Language Key'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    Language : String(2);
    @sap.label : 'Name'
    @sap.quickinfo : 'Name 1'
    OrganizationName1 : String(40);
    @sap.label : 'Name 2'
    OrganizationName2 : String(40);
    @sap.label : 'Name 3'
    OrganizationName3 : String(40);
    @sap.label : 'Name 4'
    OrganizationName4 : String(40);
    @sap.label : 'Last Name'
    PersonFamilyName : String(40);
    @sap.label : 'First Name'
    PersonGivenName : String(40);
    @sap.display.format : 'UpperCase'
    @sap.label : 'PO Box'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    POBox : String(10);
    @sap.label : 'PO Box City'
    @sap.quickinfo : 'PO Box city'
    POBoxDeviatingCityName : String(40);
    @sap.display.format : 'UpperCase'
    @sap.label : 'PO Box Ctry/Region'
    @sap.quickinfo : 'PO Box of Country/Region'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    POBoxDeviatingCountry : String(3);
    @sap.display.format : 'UpperCase'
    @sap.label : 'PO Box Region'
    @sap.quickinfo : 'Region for PO Box (Country/Region, State, Province, ...)'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    POBoxDeviatingRegion : String(3);
    @sap.label : 'PO Box w/o No.'
    @sap.quickinfo : 'Flag: PO Box Without Number'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    POBoxIsWithoutNumber : Boolean;
    @sap.label : 'PO Box Lobby'
    POBoxLobbyName : String(40);
    @sap.display.format : 'UpperCase'
    @sap.label : 'PO Box Postal Code'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    POBoxPostalCode : String(10);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Postal Code'
    @sap.quickinfo : 'City Postal Code'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    PostalCode : String(10);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Comm. Method'
    @sap.quickinfo : 'Communication Method (Key) (Business Address Services)'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    PrfrdCommMediumType : String(3);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Region'
    @sap.quickinfo : 'Region (State, Province, County)'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    Region : String(3);
    @sap.display.format : 'UpperCase'
    @sap.label : 'County code'
    @sap.quickinfo : 'County code for county'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    SecondaryRegion : String(8);
    @sap.label : 'County'
    SecondaryRegionName : String(40);
    @sap.label : 'Street'
    StreetName : String(60);
    @sap.label : 'Street 2'
    StreetPrefixName1 : String(40);
    @sap.label : 'Street 3'
    StreetPrefixName2 : String(40);
    @sap.label : 'Street 4'
    StreetSuffixName1 : String(40);
    @sap.label : 'Street 5'
    StreetSuffixName2 : String(40);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Tax Jurisdiction'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    TaxJurisdiction : String(15);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Township code'
    @sap.quickinfo : 'Township code for Township'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    TertiaryRegion : String(8);
    @sap.label : 'Township'
    TertiaryRegionName : String(40);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Transportation Zone'
    @sap.quickinfo : 'Transportation zone to or from which the goods are delivered'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    TransportZone : String(10);
    @sap.label : 'Different City'
    @sap.quickinfo : 'City (different from postal city)'
    VillageName : String(40);
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.content.version : '1'
  @sap.label : 'Business Partner Relationship'
  entity A_BPRelationship {
    @sap.display.format : 'UpperCase'
    @sap.label : 'BP Relationship No.'
    @sap.quickinfo : 'BP Relationship Number'
    key RelationshipNumber : String(12) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Business Partner'
    @sap.quickinfo : 'Business Partner Number'
    key BusinessPartner1 : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Business Partner'
    @sap.quickinfo : 'Business Partner Number'
    key BusinessPartner2 : String(10) not null;
    @sap.display.format : 'Date'
    @sap.label : 'Valid To'
    @sap.quickinfo : 'Validity Date (Valid To)'
    key ValidityEndDate : Date not null;
    @sap.display.format : 'Date'
    @sap.label : 'Valid From'
    @sap.quickinfo : 'Validity Date (Valid From)'
    ValidityStartDate : Date;
    @sap.label : 'Standard'
    @sap.quickinfo : 'Standard Relationship'
    IsStandardRelationship : Boolean;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Relationship Cat.'
    @sap.quickinfo : 'Business Partner Relationship Category'
    RelationshipCategory : String(6);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Relationship type'
    @sap.quickinfo : 'Business partner relationship type'
    BPRelationshipType : String(4);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Created By'
    @sap.quickinfo : 'User who created the object'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    CreatedByUser : String(12);
    @sap.display.format : 'Date'
    @sap.label : 'Created On'
    @sap.quickinfo : 'Date on which the object was created'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    CreationDate : Date;
    @sap.label : 'Created at'
    @sap.quickinfo : 'Time at which the object was created'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    CreationTime : Time;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Changed by'
    @sap.quickinfo : 'Last user to change object'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    LastChangedByUser : String(12);
    @sap.display.format : 'Date'
    @sap.label : 'Changed on'
    @sap.quickinfo : 'Date when object was last changed'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    LastChangeDate : Date;
    @sap.label : 'Changed at'
    @sap.quickinfo : 'Time at which object was last changed'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    LastChangeTime : Time;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.content.version : '1'
  @sap.label : 'Address Usage'
  entity A_BuPaAddressUsage {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Business Partner'
    @sap.quickinfo : 'Business Partner Number'
    key BusinessPartner : String(10) not null;
    @odata.Type : 'Edm.DateTimeOffset'
    @sap.label : 'Valid To'
    @sap.quickinfo : 'Validity End of a Business Partner Address Usage'
    key ValidityEndDate : DateTime not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Address Type'
    key AddressUsage : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Address Number'
    key AddressID : String(10) not null;
    @odata.Type : 'Edm.DateTimeOffset'
    @sap.label : 'Valid From'
    @sap.quickinfo : 'Validity Start of a Business Partner Address Usage'
    ValidityStartDate : DateTime;
    @sap.label : 'Standard Usage'
    @sap.quickinfo : 'Indicator: Standard Address Usage'
    StandardUsage : Boolean;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Authorization Group'
    AuthorizationGroup : String(4);
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.content.version : '1'
  @sap.label : 'Identification'
  entity A_BuPaIdentification {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Business Partner'
    @sap.quickinfo : 'Business Partner Number'
    key BusinessPartner : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Identification Type'
    key BPIdentificationType : String(6) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'ID Number'
    @sap.quickinfo : 'Identification Number'
    key BPIdentificationNumber : String(60) not null;
    @sap.label : 'Responsible Institn'
    @sap.quickinfo : 'Responsible Institution for ID Number'
    BPIdnNmbrIssuingInstitute : String(40);
    @sap.display.format : 'Date'
    @sap.label : 'Entry date'
    @sap.quickinfo : 'Date of Entry for ID Number'
    BPIdentificationEntryDate : Date;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Country/Region'
    @sap.quickinfo : 'Country/Region in Which ID Number is Valid or Was Assigned'
    Country : String(3);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Region'
    @sap.quickinfo : 'Region (State, Province, County)'
    Region : String(3);
    @sap.display.format : 'Date'
    @sap.label : 'Valid from'
    @sap.quickinfo : 'Validity Start for ID Number'
    ValidityStartDate : Date;
    @sap.display.format : 'Date'
    @sap.label : 'Valid To'
    @sap.quickinfo : 'Validity End for ID Number'
    ValidityEndDate : Date;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Authorization Group'
    AuthorizationGroup : String(4);
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.content.version : '1'
  @sap.label : 'Industry'
  entity A_BuPaIndustry {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Industry'
    key IndustrySector : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Industry System'
    key IndustrySystemType : String(4) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Business Partner'
    @sap.quickinfo : 'Business Partner Number'
    key BusinessPartner : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Standard Industry'
    @sap.quickinfo : 'Industry is Standard for BP in Industry System'
    IsStandardIndustry : String(1);
    @sap.label : 'Description'
    IndustryKeyDescription : String(100);
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.deletable : 'false'
  @sap.content.version : '1'
  @sap.label : 'Business Partner'
  entity A_BusinessPartner {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Business Partner'
    @sap.quickinfo : 'Business Partner Number'
    key BusinessPartner : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Customer'
    @sap.quickinfo : 'Customer Number'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    Customer : String(10);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Supplier'
    @sap.quickinfo : 'Account Number of Supplier'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    Supplier : String(10);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Academic Title 1'
    @sap.quickinfo : 'Academic Title: Key'
    AcademicTitle : String(4);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Authorization Group'
    AuthorizationGroup : String(4);
    @sap.display.format : 'UpperCase'
    @sap.label : 'BP Category'
    @sap.quickinfo : 'Business Partner Category'
    BusinessPartnerCategory : String(1);
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    BusinessPartnerFullName : String(81);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Grouping'
    @sap.quickinfo : 'Business Partner Grouping'
    BusinessPartnerGrouping : String(4);
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    BusinessPartnerName : String(81);
    @sap.label : 'BP GUID'
    @sap.quickinfo : 'Business Partner GUID'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    BusinessPartnerUUID : UUID;
    @sap.label : 'Correspondence Lang.'
    @sap.quickinfo : 'Business Partner: Correspondence Language'
    CorrespondenceLanguage : String(2);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Created By'
    @sap.quickinfo : 'User who created the object'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    CreatedByUser : String(12);
    @sap.display.format : 'Date'
    @sap.label : 'Created On'
    @sap.quickinfo : 'Date on which the object was created'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    CreationDate : Date;
    @sap.label : 'Created at'
    @sap.quickinfo : 'Time at which the object was created'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    CreationTime : Time;
    @sap.label : 'First Name'
    @sap.quickinfo : 'First Name of Business Partner (Person)'
    FirstName : String(40);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Title Key'
    @sap.quickinfo : 'Form-of-Address Key'
    FormOfAddress : String(4);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Industry sector'
    Industry : String(10);
    @sap.display.format : 'NonNegative'
    @sap.label : 'Int. location no. 1'
    @sap.quickinfo : 'International location number (part 1)'
    InternationalLocationNumber1 : String(7);
    @sap.display.format : 'NonNegative'
    @sap.label : 'Int. location no. 2'
    @sap.quickinfo : 'International location number (Part 2)'
    InternationalLocationNumber2 : String(5);
    @sap.label : 'Female'
    @sap.quickinfo : 'Selection: Business partner is female'
    IsFemale : Boolean;
    @sap.label : 'Male'
    @sap.quickinfo : 'Selection: Business partner is male'
    IsMale : Boolean;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Natural Person'
    @sap.quickinfo : 'Business Partner Is a Natural Person Under the Tax Laws'
    IsNaturalPerson : String(1);
    @sap.label : 'Unknown'
    @sap.quickinfo : 'Selection: Sex of business partner is not known'
    IsSexUnknown : Boolean;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Gender'
    @sap.quickinfo : 'Gender of Business Partner (Person)'
    GenderCodeName : String(1);
    @sap.label : 'Language'
    @sap.quickinfo : 'Business partner: Language'
    Language : String(2);
    @sap.display.format : 'Date'
    @sap.label : 'Changed on'
    @sap.quickinfo : 'Date when object was last changed'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    LastChangeDate : Date;
    @sap.label : 'Changed at'
    @sap.quickinfo : 'Time at which object was last changed'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    LastChangeTime : Time;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Changed by'
    @sap.quickinfo : 'Last user to change object'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    LastChangedByUser : String(12);
    @sap.label : 'Last Name'
    @sap.quickinfo : 'Last Name of Business Partner (Person)'
    LastName : String(40);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Legal form'
    @sap.quickinfo : 'BP: Legal form of organization'
    LegalForm : String(2);
    @sap.label : 'Name 1'
    @sap.quickinfo : 'Name 1 of organization'
    OrganizationBPName1 : String(40);
    @sap.label : 'Name 2'
    @sap.quickinfo : 'Name 2 of organization'
    OrganizationBPName2 : String(40);
    @sap.label : 'Name 3'
    @sap.quickinfo : 'Name 3 of organization'
    OrganizationBPName3 : String(40);
    @sap.label : 'Name 4'
    @sap.quickinfo : 'Name 4 of organization'
    OrganizationBPName4 : String(40);
    @sap.display.format : 'Date'
    @sap.label : 'Date founded'
    @sap.quickinfo : 'Date organization founded'
    OrganizationFoundationDate : Date;
    @sap.display.format : 'Date'
    @sap.label : 'Liquidation date'
    @sap.quickinfo : 'Liquidation date of organization'
    OrganizationLiquidationDate : Date;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Search Term 1'
    @sap.quickinfo : 'Search Term 1 for Business Partner'
    SearchTerm1 : String(20);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Search Term 2'
    @sap.quickinfo : 'Search Term 2 for Business Partner'
    SearchTerm2 : String(20);
    @sap.label : 'Other Last Name'
    @sap.quickinfo : 'Other Last Name of a Person'
    AdditionalLastName : String(40);
    @sap.display.format : 'Date'
    @sap.label : 'Date of Birth'
    @sap.quickinfo : 'Date of Birth of Business Partner'
    BirthDate : Date;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Birth Date Status'
    @sap.quickinfo : 'Date of Birth: Status'
    BusinessPartnerBirthDateStatus : String(1);
    @sap.label : 'Birthplace'
    @sap.quickinfo : 'Birthplace of business partner'
    BusinessPartnerBirthplaceName : String(40);
    @sap.display.format : 'Date'
    @sap.label : 'Death date'
    @sap.quickinfo : 'Date of death of business partner'
    BusinessPartnerDeathDate : Date;
    @sap.label : 'Central Block'
    @sap.quickinfo : 'Central Block for Business Partner'
    BusinessPartnerIsBlocked : Boolean;
    @sap.display.format : 'UpperCase'
    @sap.label : 'BP Type'
    @sap.quickinfo : 'Business Partner Type'
    BusinessPartnerType : String(4);
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    ETag : String(26);
    @sap.label : 'Name 1'
    @sap.quickinfo : 'Name 1 (group)'
    GroupBusinessPartnerName1 : String(40);
    @sap.label : 'Name 2'
    @sap.quickinfo : 'Name 2 (group)'
    GroupBusinessPartnerName2 : String(40);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Address Number'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    IndependentAddressID : String(10);
    @sap.display.format : 'NonNegative'
    @sap.label : 'Check digit'
    @sap.quickinfo : 'Check digit for the international location number'
    InternationalLocationNumber3 : String(1);
    @sap.label : 'Middle Name'
    @sap.quickinfo : 'Middle Name or Second Forename of a Person'
    MiddleName : String(40);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Ctry/Reg. for Format'
    @sap.quickinfo : 'Country/Region for Name Format Rule'
    NameCountry : String(3);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Name Format'
    @sap.quickinfo : 'Name format'
    NameFormat : String(2);
    @sap.label : 'Full Name'
    PersonFullName : String(80);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Person Number'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    PersonNumber : String(10);
    @sap.label : 'Archiving Flag'
    @sap.quickinfo : 'Central Archiving Flag'
    IsMarkedForArchiving : Boolean;
    @sap.display.format : 'UpperCase'
    @sap.label : 'External BP Number'
    @sap.quickinfo : 'Business Partner Number in External System'
    BusinessPartnerIDByExtSystem : String(20);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Print Format'
    @sap.quickinfo : 'Business Partner Print Format'
    BusinessPartnerPrintFormat : String(1);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Occupation'
    @sap.quickinfo : 'Occupation/group'
    BusinessPartnerOccupation : String(4);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Marital Status'
    @sap.quickinfo : 'Marital Status of Business Partner'
    BusPartMaritalStatus : String(1);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Nationality'
    BusPartNationality : String(3);
    @sap.label : 'Name at Birth'
    @sap.quickinfo : 'Name at birth of business partner'
    BusinessPartnerBirthName : String(40);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Name Supplement'
    @sap.quickinfo : 'Name supplement, e.g. noble title (key)'
    BusinessPartnerSupplementName : String(4);
    @sap.label : 'Employer'
    @sap.quickinfo : 'Name of Employer of a Natural Person'
    NaturalPersonEmployerName : String(35);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Prefix Key'
    @sap.quickinfo : 'Name Prefix (Key)'
    LastNamePrefix : String(4);
    @sap.display.format : 'UpperCase'
    @sap.label : '2nd prefix'
    @sap.quickinfo : '2nd name prefix (key)'
    LastNameSecondPrefix : String(4);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Initials'
    @sap.quickinfo : '&quot;Middle Initial&quot; or personal initials'
    Initials : String(10);
    @sap.label : 'DC Not Required'
    @sap.quickinfo : 'BP: Data Controller Not Required'
    BPDataControllerIsNotRequired : Boolean;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Trading Partner No.'
    @sap.quickinfo : 'Company ID of Trading Partner'
    TradingPartner : String(6);
    to_AddressIndependentEmail : Association to many A_BPAddressIndependentEmail {  };
    to_AddressIndependentFax : Association to many A_BPAddressIndependentFax {  };
    to_AddressIndependentMobile : Association to many A_BPAddressIndependentMobile {  };
    to_AddressIndependentPhone : Association to many A_BPAddressIndependentPhone {  };
    to_AddressIndependentWebsite : Association to many A_BPAddressIndependentWebsite {  };
    to_BPCreditWorthiness : Association to A_BPCreditWorthiness {  };
    to_BPDataController : Association to many A_BPDataController {  };
    to_BPEmployment : Association to many A_BPEmployment {  };
    to_BPFinServicesReporting : Association to A_BPFinancialServicesReporting {  };
    to_BPFiscalYearInformation : Association to many A_BPFiscalYearInformation {  };
    to_BPRelationship : Association to many A_BPRelationship {  };
    to_BuPaIdentification : Association to many A_BuPaIdentification {  };
    to_BuPaIndustry : Association to many A_BuPaIndustry {  };
    to_BusinessPartner : Association to A_BPFinancialServicesExtn {  };
    to_BusinessPartnerAddress : Association to many A_BusinessPartnerAddress {  };
    to_BusinessPartnerAlias : Association to many A_BusinessPartnerAlias {  };
    to_BusinessPartnerBank : Association to many A_BusinessPartnerBank {  };
    to_BusinessPartnerContact : Association to many A_BusinessPartnerContact {  };
    to_BusinessPartnerIsBank : Association to A_BusinessPartnerIsBank {  };
    to_BusinessPartnerRating : Association to many A_BusinessPartnerRating {  };
    to_BusinessPartnerRole : Association to many A_BusinessPartnerRole {  };
    to_BusinessPartnerTax : Association to many A_BusinessPartnerTaxNumber {  };
    to_BusPartAddrDepdntTaxNmbr : Association to many A_BusPartAddrDepdntTaxNmbr {  };
    to_Customer : Association to A_Customer {  };
    to_PaymentCard : Association to many A_BusinessPartnerPaymentCard {  };
    to_Supplier : Association to A_Supplier {  };
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.content.version : '1'
  @sap.label : 'Address'
  entity A_BusinessPartnerAddress {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Business Partner'
    @sap.quickinfo : 'Business Partner Number'
    key BusinessPartner : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Address Number'
    key AddressID : String(10) not null;
    @odata.Type : 'Edm.DateTimeOffset'
    @sap.label : 'Valid From'
    @sap.quickinfo : 'Validity Start of a Business Partner Address'
    ValidityStartDate : DateTime;
    @odata.Type : 'Edm.DateTimeOffset'
    @sap.label : 'Valid To'
    @sap.quickinfo : 'Validity End of a Business Partner Address'
    ValidityEndDate : DateTime;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Authorization Group'
    AuthorizationGroup : String(4);
    @sap.label : 'GUID of a Business Partner Address'
    @sap.heading : ''
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    AddressUUID : UUID;
    @sap.label : 'Street 3'
    AdditionalStreetPrefixName : String(40);
    @sap.label : 'Street 5'
    AdditionalStreetSuffixName : String(40);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Time Zone'
    @sap.quickinfo : 'Address Time Zone'
    AddressTimeZone : String(6);
    @sap.label : 'c/o'
    @sap.quickinfo : 'c/o name'
    CareOfName : String(40);
    @sap.display.format : 'UpperCase'
    @sap.label : 'City Code'
    @sap.quickinfo : 'City code for city/street file'
    CityCode : String(12);
    @sap.label : 'City'
    CityName : String(40);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Company Postal Code'
    @sap.quickinfo : 'Company Postal Code (for Large Customers)'
    CompanyPostalCode : String(10);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Country/Region Key'
    Country : String(3);
    @sap.label : 'County'
    County : String(40);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Delivery Service No.'
    @sap.quickinfo : 'Number of Delivery Service'
    DeliveryServiceNumber : String(10);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Delvry Serv Type'
    @sap.quickinfo : 'Type of Delivery Service'
    DeliveryServiceTypeCode : String(4);
    @sap.label : 'District'
    District : String(40);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Title Key'
    @sap.quickinfo : 'Form-of-Address Key'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    FormOfAddress : String(4);
    @sap.label : 'Full Name'
    @sap.quickinfo : 'Full name of a party (Bus. Partner, Org. Unit, Doc. address)'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    FullName : String(80);
    @sap.label : 'Different City'
    @sap.quickinfo : 'City (different from postal city)'
    HomeCityName : String(40);
    @sap.label : 'House Number'
    HouseNumber : String(10);
    @sap.label : 'Supplement'
    @sap.quickinfo : 'House number supplement'
    HouseNumberSupplementText : String(10);
    @sap.label : 'Language Key'
    Language : String(2);
    @sap.display.format : 'UpperCase'
    @sap.label : 'PO Box'
    POBox : String(10);
    @sap.label : 'PO Box City'
    @sap.quickinfo : 'PO Box city'
    POBoxDeviatingCityName : String(40);
    @sap.display.format : 'UpperCase'
    @sap.label : 'PO Box Ctry/Region'
    @sap.quickinfo : 'PO Box of Country/Region'
    POBoxDeviatingCountry : String(3);
    @sap.display.format : 'UpperCase'
    @sap.label : 'PO Box Region'
    @sap.quickinfo : 'Region for PO Box (Country/Region, State, Province, ...)'
    POBoxDeviatingRegion : String(3);
    @sap.label : 'PO Box w/o No.'
    @sap.quickinfo : 'Flag: PO Box Without Number'
    POBoxIsWithoutNumber : Boolean;
    @sap.label : 'PO Box Lobby'
    POBoxLobbyName : String(40);
    @sap.display.format : 'UpperCase'
    @sap.label : 'PO Box Postal Code'
    POBoxPostalCode : String(10);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Person Number'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    Person : String(10);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Postal Code'
    @sap.quickinfo : 'City Postal Code'
    PostalCode : String(10);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Comm. Method'
    @sap.quickinfo : 'Communication Method (Key) (Business Address Services)'
    PrfrdCommMediumType : String(3);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Region'
    @sap.quickinfo : 'Region (State, Province, County)'
    Region : String(3);
    @sap.label : 'Street'
    StreetName : String(60);
    @sap.label : 'Street 2'
    StreetPrefixName : String(40);
    @sap.label : 'Street 4'
    StreetSuffixName : String(40);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Tax Jurisdiction'
    TaxJurisdiction : String(15);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Transportation Zone'
    @sap.quickinfo : 'Transportation zone to or from which the goods are delivered'
    TransportZone : String(10);
    @sap.display.format : 'UpperCase'
    @sap.label : 'External Address No.'
    @sap.quickinfo : 'Address number in external system'
    AddressIDByExternalSystem : String(20);
    @sap.display.format : 'UpperCase'
    @sap.label : 'County code'
    @sap.quickinfo : 'County code for county'
    CountyCode : String(8);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Township code'
    @sap.quickinfo : 'Township code for Township'
    TownshipCode : String(8);
    @sap.label : 'Township'
    TownshipName : String(40);
    to_AddressUsage : Association to many A_BuPaAddressUsage {  };
    to_BPAddrDepdntIntlLocNumber : Association to A_BPAddrDepdntIntlLocNumber {  };
    to_BPIntlAddressVersion : Association to many A_BPIntlAddressVersion {  };
    to_EmailAddress : Association to many A_AddressEmailAddress {  };
    to_FaxNumber : Association to many A_AddressFaxNumber {  };
    to_MobilePhoneNumber : Association to many A_AddressPhoneNumber {  };
    to_PhoneNumber : Association to many A_AddressPhoneNumber {  };
    to_URLAddress : Association to many A_AddressHomePageURL {  };
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.content.version : '1'
  @sap.label : 'Additional Names'
  entity A_BusinessPartnerAlias {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Business Partner'
    @sap.quickinfo : 'Business Partner Number'
    key BusinessPartner : String(10) not null;
    @sap.display.format : 'NonNegative'
    @sap.label : 'Item: Alias'
    @sap.quickinfo : 'Items with Business Partner Name/Alias'
    key BPAliasPositionNumber : String(3) not null;
    @sap.label : 'Alias'
    @sap.quickinfo : 'Business Partner Alias'
    BusinessPartnerAliasName : String(80);
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.content.version : '1'
  @sap.label : 'Bank'
  entity A_BusinessPartnerBank {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Business Partner'
    @sap.quickinfo : 'Business Partner Number'
    key BusinessPartner : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Bank Details ID'
    key BankIdentification : String(4) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Bank Country/Region'
    @sap.quickinfo : 'Bank Country/Region Key'
    BankCountryKey : String(3);
    @sap.label : 'Bank Name'
    @sap.quickinfo : 'Name of Financial Institution'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    BankName : String(60);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Bank Key'
    BankNumber : String(15);
    @sap.display.format : 'UpperCase'
    @sap.label : 'SWIFT/BIC'
    @sap.quickinfo : 'SWIFT/BIC for International Payments'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    SWIFTCode : String(11);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Bank Control Key'
    BankControlKey : String(2);
    @sap.label : 'Account Holder'
    @sap.quickinfo : 'Account Holder Name'
    BankAccountHolderName : String(60);
    @sap.label : 'Account Name'
    @sap.quickinfo : 'Name of Bank Account'
    BankAccountName : String(40);
    @odata.Type : 'Edm.DateTimeOffset'
    @sap.label : 'Valid From'
    @sap.quickinfo : 'Validity Start of Business Partner Bank Details'
    ValidityStartDate : DateTime;
    @odata.Type : 'Edm.DateTimeOffset'
    @sap.label : 'Valid To'
    @sap.quickinfo : 'Validity End of Business Partner Bank Details'
    ValidityEndDate : DateTime;
    @sap.display.format : 'UpperCase'
    @sap.label : 'IBAN'
    @sap.quickinfo : 'IBAN (International Bank Account Number)'
    IBAN : String(34);
    @sap.display.format : 'Date'
    @sap.label : 'IBAN Valid From'
    @sap.quickinfo : 'Validity Start of IBAN'
    IBANValidityStartDate : Date;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Bank Account'
    @sap.quickinfo : 'Bank Account Number'
    BankAccount : String(18);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Reference Details'
    @sap.quickinfo : 'Reference Details for Bank Details'
    BankAccountReferenceText : String(20);
    @sap.label : 'Collect.author.'
    @sap.quickinfo : 'Indicator: Collection Authorization'
    CollectionAuthInd : Boolean;
    @sap.label : 'City'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    CityName : String(35);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Authorization Group'
    AuthorizationGroup : String(4);
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.content.version : '1'
  @sap.label : 'Contact'
  entity A_BusinessPartnerContact {
    @sap.display.format : 'UpperCase'
    @sap.label : 'BP Relationship No.'
    @sap.quickinfo : 'BP Relationship Number'
    key RelationshipNumber : String(12) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Business Partner'
    @sap.quickinfo : 'Business Partner Number'
    key BusinessPartnerCompany : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Business Partner'
    @sap.quickinfo : 'Business Partner Number'
    key BusinessPartnerPerson : String(10) not null;
    @sap.display.format : 'Date'
    @sap.label : 'Valid To'
    @sap.quickinfo : 'Validity Date (Valid To)'
    key ValidityEndDate : Date not null;
    @sap.display.format : 'Date'
    @sap.label : 'Valid From'
    @sap.quickinfo : 'Validity Date (Valid From)'
    ValidityStartDate : Date;
    @sap.label : 'Standard'
    @sap.quickinfo : 'Standard Relationship'
    IsStandardRelationship : Boolean;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Relationship Cat.'
    @sap.quickinfo : 'Business Partner Relationship Category'
    RelationshipCategory : String(6);
    to_ContactAddress : Association to many A_BPContactToAddress {  };
    to_ContactRelationship : Association to A_BPContactToFuncAndDept {  };
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.deletable : 'false'
  @sap.content.version : '1'
  @sap.label : 'Partner is Bank'
  entity A_BusinessPartnerIsBank {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Business Partner'
    @sap.quickinfo : 'Business Partner Number'
    key BusinessPartner : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Bank Key'
    @sap.quickinfo : 'Bank Keys'
    BankKey : String(15);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Bank Country/Region'
    @sap.quickinfo : 'Bank Country/Region Key'
    BankCountry : String(3);
    @sap.display.format : 'NonNegative'
    @sap.label : 'Minimum Reserve Req.'
    @sap.quickinfo : 'Minimum Reserve Requirement for Bank'
    BPMinimumReserve : String(1);
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.content.version : '1'
  @sap.label : 'Business Partner Payment Card'
  entity A_BusinessPartnerPaymentCard {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Business Partner'
    @sap.quickinfo : 'Business Partner Number'
    key BusinessPartner : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Payment Card ID'
    key PaymentCardID : String(6) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Payment Card Type'
    key PaymentCardType : String(4) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Card Number'
    @sap.quickinfo : 'Payment Cards: Card Number'
    key CardNumber : String(25) not null;
    @sap.label : 'Standard Card'
    @sap.quickinfo : 'BP: Standard Payment Card'
    IsStandardCard : Boolean;
    @sap.label : 'Description'
    @sap.quickinfo : 'Description of Credit Card Details'
    CardDescription : String(40);
    @sap.display.format : 'Date'
    @sap.label : 'Card valid from'
    @sap.quickinfo : 'Payment cards: Valid from'
    ValidityDate : Date;
    @sap.display.format : 'Date'
    @sap.label : 'Card Valid To'
    @sap.quickinfo : 'Payment Cards: Valid To'
    ValidityEndDate : Date;
    @sap.label : 'Card Holder'
    @sap.quickinfo : 'Payment Cards: Name of Cardholder'
    CardHolder : String(40);
    @sap.label : 'Issuing bank'
    @sap.quickinfo : 'Payment cards: Issuing bank'
    CardIssuingBank : String(40);
    @sap.display.format : 'Date'
    @sap.label : 'Issued on'
    @sap.quickinfo : 'Payment Cards: Date of Issue'
    CardIssueDate : Date;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Payment Card Lock'
    @sap.quickinfo : 'Payment Cards: Reason for Payment Card Lock'
    PaymentCardLock : String(2);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Card Number'
    @sap.quickinfo : 'Masked Payment Card Number ( Digital Payment )'
    MaskedCardNumber : String(25);
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.content.version : '1'
  @sap.label : 'Ratings'
  entity A_BusinessPartnerRating {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Business Partner'
    @sap.quickinfo : 'Business Partner Number'
    key BusinessPartner : String(10) not null;
    @sap.label : 'Rating Procedure'
    key BusinessPartnerRatingProcedure : String(10) not null;
    @sap.display.format : 'Date'
    @sap.label : 'Rating Valid To'
    @sap.quickinfo : 'Valid-to Date for Rating'
    key BPRatingValidityEndDate : Date not null;
    @sap.label : 'Rating'
    BusinessPartnerRatingGrade : String(10);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Trend'
    BusinessPartnerRatingTrend : String(2);
    @sap.display.format : 'Date'
    @sap.label : 'Rating Valid From'
    @sap.quickinfo : 'Valid-from Date for Rating'
    BPRatingValidityStartDate : Date;
    @sap.display.format : 'Date'
    @sap.label : 'Rated On'
    @sap.quickinfo : 'Entered-on Date for Rating'
    BPRatingCreationDate : Date;
    @sap.label : 'Text'
    @sap.quickinfo : 'Text for Ratings'
    BusinessPartnerRatingComment : String(60);
    @sap.label : 'Rating Allowed'
    BusinessPartnerRatingIsAllowed : Boolean;
    @sap.label : 'Rating Valid'
    @sap.quickinfo : 'Business Partner Rating is valid on Key Date'
    BPRatingIsValidOnKeyDate : Boolean;
    @sap.display.format : 'Date'
    @sap.label : 'Access Date'
    @sap.quickinfo : 'Key Date of Accessing Business Partner Rating Data'
    BusinessPartnerRatingKeyDate : Date;
    @sap.label : 'Rating is Expired'
    @sap.quickinfo : 'Rating Validity is Expired according to Permitted Period'
    BusinessPartnerRatingIsExpired : Boolean;
    @sap.label : 'Longtext Rating'
    @sap.quickinfo : 'Longtext for Rating'
    BPRatingLongComment : String(255);
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.deletable : 'false'
  @sap.content.version : '1'
  @sap.label : 'Role'
  entity A_BusinessPartnerRole {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Business Partner'
    @sap.quickinfo : 'Business Partner Number'
    key BusinessPartner : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'BP Role'
    key BusinessPartnerRole : String(6) not null;
    @odata.Type : 'Edm.DateTimeOffset'
    @sap.label : 'Valid From'
    @sap.quickinfo : 'Validity Start of a BP Role'
    ValidFrom : DateTime;
    @odata.Type : 'Edm.DateTimeOffset'
    @sap.label : 'Valid To'
    @sap.quickinfo : 'Validity End of a BP Role'
    ValidTo : DateTime;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Authorization Group'
    AuthorizationGroup : String(4);
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.content.version : '1'
  @sap.label : 'Tax Number'
  entity A_BusinessPartnerTaxNumber {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Business Partner'
    @sap.quickinfo : 'Business Partner Number'
    key BusinessPartner : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Tax Number Category'
    key BPTaxType : String(4) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Tax number'
    @sap.quickinfo : 'Business Partner Tax Number'
    BPTaxNumber : String(20);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Tax Number Long'
    @sap.quickinfo : 'Business Partner Tax Number'
    BPTaxLongNumber : String(60);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Authorization Group'
    AuthorizationGroup : String(4);
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.content.version : '1'
  @sap.label : 'Business Partner Address Dependent Tax Numbers'
  entity A_BusPartAddrDepdntTaxNmbr {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Business Partner'
    @sap.quickinfo : 'Business Partner Number'
    key BusinessPartner : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Address Number'
    key AddressID : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Tax Number Category'
    key BPTaxType : String(4) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Tax number'
    @sap.quickinfo : 'Business Partner Tax Number'
    BPTaxNumber : String(20);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Tax Number Long'
    @sap.quickinfo : 'Business Partner Tax Number'
    BPTaxLongNumber : String(60);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Authorization Group'
    AuthorizationGroup : String(4);
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.content.version : '1'
  @sap.label : 'Customer Address Dependent External Identifier'
  entity A_CustAddrDepdntExtIdentifier {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Customer'
    @sap.quickinfo : 'Customer Number'
    key Customer : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Address Number'
    @sap.quickinfo : 'Business Partner Address Number (from BUT020)'
    key AddressID : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'SlrDfndCustAddrID'
    @sap.quickinfo : 'Seller-Defined Customer Address ID for EDI'
    CustomerExternalRefID : String(12);
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.content.version : '1'
  @sap.label : 'Customer Address Dependent Infomation'
  entity A_CustAddrDepdntInformation {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Customer'
    @sap.quickinfo : 'Customer Number'
    key Customer : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Address Number'
    @sap.quickinfo : 'Business Partner Address Number (from BUT020)'
    key AddressID : String(10) not null;
    @sap.label : 'Express station'
    @sap.quickinfo : 'Express train station'
    ExpressTrainStationName : String(25);
    @sap.label : 'Train station'
    TrainStationName : String(25);
    @sap.display.format : 'UpperCase'
    @sap.label : 'City Code'
    CityCode : String(4);
    @sap.display.format : 'UpperCase'
    @sap.label : 'County Code'
    County : String(3);
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'false'
  @sap.deletable : 'false'
  @sap.content.version : '1'
  @sap.label : 'Customer'
  entity A_Customer {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Customer'
    @sap.quickinfo : 'Customer Number'
    key Customer : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Authorization'
    @sap.quickinfo : 'Authorization Group'
    AuthorizationGroup : String(4);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Billing Block'
    @sap.quickinfo : 'Central billing block for customer'
    BillingIsBlockedForCustomer : String(2);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Created by'
    @sap.quickinfo : 'Name of Person who Created the Object'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    CreatedByUser : String(12);
    @sap.display.format : 'Date'
    @sap.label : 'Created On'
    @sap.quickinfo : 'Record Created On'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    CreationDate : Date;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Account Group'
    @sap.quickinfo : 'Customer Account Group'
    CustomerAccountGroup : String(4);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Customer Classific.'
    @sap.quickinfo : 'Customer Classification'
    CustomerClassification : String(2);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Customer Name'
    @sap.quickinfo : 'Customer Full Name'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    CustomerFullName : String(220);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Customer Name'
    @sap.quickinfo : 'Customer Full Name'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    BPCustomerFullName : String(220);
    @sap.label : 'Name of Customer'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    CustomerName : String(80);
    @sap.label : 'Name of Customer'
    @sap.quickinfo : 'Customer Name'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    BPCustomerName : String(81);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Delivery block'
    @sap.quickinfo : 'Central delivery block for the customer'
    DeliveryIsBlocked : String(2);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Attribute 1'
    FreeDefinedAttribute01 : String(2);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Attribute 2'
    FreeDefinedAttribute02 : String(2);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Attribute 3'
    FreeDefinedAttribute03 : String(2);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Attribute 4'
    FreeDefinedAttribute04 : String(2);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Attribute 5'
    FreeDefinedAttribute05 : String(2);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Attribute 6'
    FreeDefinedAttribute06 : String(3);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Attribute 7'
    FreeDefinedAttribute07 : String(3);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Attribute 8'
    FreeDefinedAttribute08 : String(3);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Attribute 9'
    FreeDefinedAttribute09 : String(3);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Attribute 10'
    FreeDefinedAttribute10 : String(3);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Natural Person'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    NFPartnerIsNaturalPerson : String(1);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Order Block'
    @sap.quickinfo : 'Central Order Block for Customer'
    OrderIsBlockedForCustomer : String(2);
    @sap.label : 'Posting Block'
    @sap.quickinfo : 'Central Posting Block'
    PostingIsBlocked : Boolean;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Supplier'
    @sap.quickinfo : 'Account Number of Supplier'
    Supplier : String(10);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Group Key'
    CustomerCorporateGroup : String(10);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Fiscal address'
    @sap.quickinfo : 'Account number of the master record with the fiscal address'
    FiscalAddress : String(10);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Industry'
    @sap.quickinfo : 'Industry Key'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    Industry : String(4);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Industry Code 1'
    IndustryCode1 : String(10);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Industry Code 2'
    IndustryCode2 : String(10);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Industry Code 3'
    IndustryCode3 : String(10);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Industry Code 4'
    IndustryCode4 : String(10);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Industry Code 5'
    IndustryCode5 : String(10);
    @sap.display.format : 'NonNegative'
    @sap.label : 'Int. location no. 1'
    @sap.quickinfo : 'International location number (part 1)'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    InternationalLocationNumber1 : String(7);
    @sap.display.format : 'NonNegative'
    @sap.label : 'Int. location no. 2'
    @sap.quickinfo : 'International location number (Part 2)'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    InternationalLocationNumber2 : String(5);
    @sap.display.format : 'NonNegative'
    @sap.label : 'Check digit'
    @sap.quickinfo : 'Check digit for the international location number'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    InternationalLocationNumber3 : String(1);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Nielsen Indicator'
    @sap.quickinfo : 'Nielsen ID'
    NielsenRegion : String(2);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Payment Reason'
    PaymentReason : String(4);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Tax Type'
    ResponsibleType : String(2);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Tax Number 1'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    TaxNumber1 : String(16);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Tax Number 2'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    TaxNumber2 : String(11);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Tax Number 3'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    TaxNumber3 : String(18);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Tax Number 4'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    TaxNumber4 : String(18);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Tax Number 5'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    TaxNumber5 : String(60);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Tax Number Type'
    TaxNumberType : String(2);
    @sap.display.format : 'UpperCase'
    @sap.label : 'VAT Registration No.'
    @sap.quickinfo : 'VAT Registration Number'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    VATRegistration : String(20);
    @sap.label : 'Deletion Flag'
    @sap.quickinfo : 'Central Deletion Flag for Master Record'
    DeletionIndicator : Boolean;
    @sap.label : 'Express station'
    @sap.quickinfo : 'Express train station'
    ExpressTrainStationName : String(25);
    @sap.label : 'Train station'
    TrainStationName : String(25);
    @sap.display.format : 'UpperCase'
    @sap.label : 'City Code'
    CityCode : String(4);
    @sap.display.format : 'UpperCase'
    @sap.label : 'County Code'
    County : String(3);
    @sap.display.format : 'UpperCase'
    @sap.label : 'ICMS Taxpayer'
    BR_ICMSTaxPayerType : String(2);
    to_CustAddrDepdntExtIdentifier : Association to many A_CustAddrDepdntExtIdentifier {  };
    to_CustAddrDepdntInformation : Association to many A_CustAddrDepdntInformation {  };
    to_CustomerCompany : Association to many A_CustomerCompany {  };
    to_CustomerSalesArea : Association to many A_CustomerSalesArea {  };
    to_CustomerTaxGrouping : Association to many A_CustomerTaxGrouping {  };
    to_CustomerText : Association to many A_CustomerText {  };
    to_CustomerUnloadingPoint : Association to many A_CustomerUnloadingPoint {  };
    to_CustUnldgPtAddrDepdntInfo : Association to many A_CustUnldgPtAddrDepdntInfo {  };
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.deletable : 'false'
  @sap.content.version : '1'
  @sap.label : 'Customer Company'
  entity A_CustomerCompany {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Customer'
    @sap.quickinfo : 'Customer Number'
    key Customer : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Company Code'
    key CompanyCode : String(4) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Tolerance Group'
    @sap.quickinfo : 'Tolerance Group for Business Partner/G/L Account'
    APARToleranceGroup : String(4);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Account at Customer'
    @sap.quickinfo : 'Our Account Number at Customer'
    AccountByCustomer : String(12);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Clerk Abbrev.'
    @sap.quickinfo : 'Accounting Clerk Abbreviation'
    AccountingClerk : String(2);
    @sap.label : 'Acctg clerk''s fax'
    @sap.quickinfo : 'Accounting clerk''s fax number at the customer/vendor'
    AccountingClerkFaxNumber : String(31);
    @sap.label : 'Clrk''s internet add.'
    @sap.quickinfo : 'Internet address of partner company clerk'
    AccountingClerkInternetAddress : String(130);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Acct.clerks tel.no.'
    @sap.quickinfo : 'Accounting clerk''s telephone number at business partner'
    AccountingClerkPhoneNumber : String(30);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Alternative payer'
    @sap.quickinfo : 'Account number of an alternative payer'
    AlternativePayerAccount : String(10);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Authorization'
    @sap.quickinfo : 'Authorization Group'
    AuthorizationGroup : String(4);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Coll.Invoice Variant'
    @sap.quickinfo : 'Collective Invoice Variant'
    CollectiveInvoiceVariant : String(1);
    @sap.label : 'Account Memo'
    @sap.quickinfo : 'Memo'
    CustomerAccountNote : String(30);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Head Office'
    @sap.quickinfo : 'Head Office Account Number (in branch accounts)'
    CustomerHeadOffice : String(10);
    @sap.label : 'Clearing with vendor'
    @sap.quickinfo : 'Indicator: Clearing between customer and vendor ?'
    CustomerSupplierClearingIsUsed : Boolean;
    @sap.display.format : 'UpperCase'
    @sap.label : 'House Bank'
    @sap.quickinfo : 'Short Key for a House Bank'
    HouseBank : String(5);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Interest Indicator'
    InterestCalculationCode : String(2);
    @sap.display.format : 'Date'
    @sap.label : 'Last Key Date'
    @sap.quickinfo : 'Key Date of Last Interest Calculation'
    InterestCalculationDate : Date;
    @sap.display.format : 'NonNegative'
    @sap.label : 'Int.Calc.Freq.'
    @sap.quickinfo : 'Interest Calculation Frequency in Months'
    IntrstCalcFrequencyInMonths : String(2);
    @sap.label : 'Local Processing'
    @sap.quickinfo : 'Indicator: Local Processing?'
    IsToBeLocallyProcessed : Boolean;
    @sap.label : 'Individual Payment'
    @sap.quickinfo : 'Indicator: Pay All Items Separately?'
    ItemIsToBePaidSeparately : Boolean;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Sort key'
    @sap.quickinfo : 'Key for sorting according to assignment numbers'
    LayoutSortingRule : String(3);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Payment Block'
    @sap.quickinfo : 'Block Key for Payment'
    PaymentBlockingReason : String(1);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Payment Methods'
    @sap.quickinfo : 'List of Respected Payment Methods'
    PaymentMethodsList : String(10);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Payment Reason'
    PaymentReason : String(4);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Terms of Payment'
    @sap.quickinfo : 'Key for Terms of Payment'
    PaymentTerms : String(4);
    @sap.label : 'Pmnt advice by EDI'
    @sap.quickinfo : 'Indicator: Send Payment Advices by EDI'
    PaytAdviceIsSentbyEDI : Boolean;
    @sap.label : 'Co.code post.block'
    @sap.quickinfo : 'Posting block for company code'
    PhysicalInventoryBlockInd : Boolean;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Reconciliation Acct'
    @sap.quickinfo : 'Reconciliation Account in General Ledger'
    ReconciliationAccount : String(10);
    @sap.label : 'Record Pmnt History'
    @sap.quickinfo : 'Indicator: Record Payment History ?'
    RecordPaymentHistoryIndicator : Boolean;
    @sap.label : 'User at customer'
    UserAtCustomer : String(15);
    @sap.label : 'Co.Cde Deletion Flag'
    @sap.quickinfo : 'Deletion Flag for Master Record (Company Code Level)'
    DeletionIndicator : Boolean;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Planning Group'
    CashPlanningGroup : String(10);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Known/Negotiat.Leave'
    @sap.quickinfo : 'Short Key for Known/Negotiated Leave'
    KnownOrNegotiatedLeave : String(4);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Value Adjustment'
    @sap.quickinfo : 'Value Adjustment Key'
    ValueAdjustmentKey : String(2);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Account Group'
    @sap.quickinfo : 'Customer Account Group'
    CustomerAccountGroup : String(4);
    to_CompanyText : Association to many A_CustomerCompanyText {  };
    to_CustomerDunning : Association to many A_CustomerDunning {  };
    to_WithHoldingTax : Association to many A_CustomerWithHoldingTax {  };
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.content.version : '1'
  @sap.label : 'Customer Company Text'
  entity A_CustomerCompanyText {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Customer'
    @sap.quickinfo : 'Customer Number'
    key Customer : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Company Code'
    key CompanyCode : String(4) not null;
    @sap.label : 'Language'
    @sap.quickinfo : 'Language key'
    key Language : String(2) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Text ID'
    key LongTextID : String(4) not null;
    @sap.label : 'String'
    @sap.heading : ''
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.sortable : 'false'
    @sap.filterable : 'false'
    LongText : String;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.content.version : '1'
  @sap.label : 'Customer Dunning'
  entity A_CustomerDunning {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Customer'
    @sap.quickinfo : 'Customer Number'
    key Customer : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Company Code'
    key CompanyCode : String(4) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Dunning Area'
    key DunningArea : String(2) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Dunning Block'
    DunningBlock : String(1);
    @sap.display.format : 'NonNegative'
    @sap.label : 'Dunning Level'
    DunningLevel : String(1);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Dunning Procedure'
    DunningProcedure : String(4);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Dunning Recipient'
    @sap.quickinfo : 'Account Number of the Dunning Recipient'
    DunningRecipient : String(10);
    @sap.display.format : 'Date'
    @sap.label : 'Last Dunned'
    @sap.quickinfo : 'Date of Last Dunning Notice'
    LastDunnedOn : Date;
    @sap.display.format : 'Date'
    @sap.label : 'Legal Dunn.Proc.From'
    @sap.quickinfo : 'Date of the Legal Dunning Proceedings'
    LegDunningProcedureOn : Date;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Dunning Clerk'
    DunningClerk : String(2);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Authorization'
    @sap.quickinfo : 'Authorization Group'
    AuthorizationGroup : String(4);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Account Group'
    @sap.quickinfo : 'Customer Account Group'
    CustomerAccountGroup : String(4);
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.deletable : 'false'
  @sap.content.version : '1'
  @sap.label : 'Sales Area'
  entity A_CustomerSalesArea {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Customer'
    @sap.quickinfo : 'Customer Number'
    key Customer : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Sales Organization'
    key SalesOrganization : String(4) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Distribution Channel'
    key DistributionChannel : String(2) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Division'
    key Division : String(2) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Account at Customer'
    @sap.quickinfo : 'Shipper''s (Our) Account Number at the Customer or Vendor'
    AccountByCustomer : String(12);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Authorization Group'
    AuthorizationGroup : String(4);
    @sap.display.format : 'UpperCase'
    @sap.label : 'BBlock for SlsA'
    @sap.quickinfo : 'Billing block for customer (sales and distribution)'
    BillingIsBlockedForCustomer : String(2);
    @sap.label : 'Complete Delivery'
    @sap.quickinfo : 'Complete Delivery Defined for Each Sales Order'
    CompleteDeliveryIsDefined : Boolean;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Credit Control Area'
    CreditControlArea : String(4);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Currency'
    @sap.semantics : 'currency-code'
    Currency : String(5);
    @sap.label : 'Settlement Mgmt.'
    @sap.quickinfo : 'Indicator: Relevant for Settlement Management'
    CustIsRlvtForSettlmtMgmt : Boolean;
    @sap.display.format : 'UpperCase'
    @sap.label : 'ABC Classification'
    @sap.quickinfo : 'Customer classification (ABC analysis)'
    CustomerABCClassification : String(2);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Acct Assmt Grp Cust.'
    @sap.quickinfo : 'Account Assignment Group for Customer'
    CustomerAccountAssignmentGroup : String(2);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Customer Group'
    CustomerGroup : String(2);
    @sap.label : 'Rebate'
    @sap.quickinfo : 'Indicator: Customer Is Rebate-Relevant'
    CustomerIsRebateRelevant : Boolean;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Terms of Payment'
    @sap.quickinfo : 'Key for Terms of Payment'
    CustomerPaymentTerms : String(4);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Customer Price Group'
    CustomerPriceGroup : String(2);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Cust.Pric.Procedure'
    @sap.quickinfo : 'Customer Classification for Pricing Procedure Determination'
    CustomerPricingProcedure : String(2);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Customer Stats.Group'
    @sap.quickinfo : 'Customer Statistics Group'
    CustomerStatisticsGroup : String(1);
    @sap.display.format : 'UpperCase'
    @sap.label : 'PP customer proced.'
    @sap.quickinfo : 'Customer procedure for product proposal'
    CustProdProposalProcedure : String(2);
    @sap.display.format : 'UpperCase'
    @sap.label : 'DelBlckSalesAr.'
    @sap.quickinfo : 'Customer delivery block (sales area)'
    DeliveryIsBlockedForCustomer : String(2);
    @sap.display.format : 'NonNegative'
    @sap.label : 'Delivery Priority'
    DeliveryPriority : String(2);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Incoterms'
    @sap.quickinfo : 'Incoterms (Part 1)'
    IncotermsClassification : String(3);
    @sap.label : 'Incoterms Location 2'
    IncotermsLocation2 : String(70);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Incoterms Version'
    IncotermsVersion : String(4);
    @sap.label : 'Incoterms Location 1'
    IncotermsLocation1 : String(70);
    @sap.label : 'Location UUID'
    IncotermsSupChnLoc1AddlUUID : UUID;
    @sap.label : 'Location UUID'
    IncotermsSupChnLoc2AddlUUID : UUID;
    @sap.label : 'Location UUID'
    IncotermsSupChnDvtgLocAddlUUID : UUID;
    @sap.label : 'Del.ID SlsArea'
    @sap.quickinfo : 'Deletion flag for customer (sales level)'
    DeletionIndicator : Boolean;
    @sap.label : 'Incoterms (Part 2)'
    IncotermsTransferLocation : String(28);
    @sap.label : 'Price determination'
    @sap.quickinfo : 'Relevant for price determination ID'
    InspSbstHasNoTimeOrQuantity : Boolean;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Invoicing Dates'
    @sap.quickinfo : 'Invoice Dates (Calendar Identification)'
    InvoiceDate : String(2);
    @sap.display.format : 'NonNegative'
    @sap.label : 'Order Probability'
    @sap.quickinfo : 'Order Probability of the Item'
    ItemOrderProbabilityInPercent : String(3);
    @sap.label : 'Man. Invoice Maint.'
    @sap.quickinfo : 'Manual Invoice Maintenance'
    ManualInvoiceMaintIsRelevant : Boolean;
    @sap.label : 'Max.Part.Deliveries'
    @sap.quickinfo : 'Maximum Number of Partial Deliveries Allowed Per Item'
    MaxNmbrOfPartialDelivery : Decimal(1, 0);
    @sap.label : 'Order Combination'
    @sap.quickinfo : 'Order Combination Indicator'
    OrderCombinationIsAllowed : Boolean;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Ord.blk:sls ar.'
    @sap.quickinfo : 'Customer order block (sales area)'
    OrderIsBlockedForCustomer : String(2);
    @sap.label : 'Overdeliv. Tolerance'
    @sap.quickinfo : 'Overdelivery Tolerance'
    OverdelivTolrtdLmtRatioInPct : Decimal(3, 1);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Partial Deliv./Item'
    @sap.quickinfo : 'Partial Delivery at Item Level'
    PartialDeliveryIsAllowed : String(1);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Price List Type'
    PriceListType : String(2);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Unit of Measure Grp'
    @sap.quickinfo : 'Unit of Measure Group'
    ProductUnitGroup : String(4);
    @sap.label : 'POD timeframe'
    @sap.quickinfo : 'Timeframe for Confirmation of POD'
    ProofOfDeliveryTimeValue : Decimal(6, 2);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Sales Group'
    SalesGroup : String(3);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Item proposal'
    SalesItemProposal : String(10);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Sales Office'
    SalesOffice : String(4);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Shipping Conditions'
    ShippingCondition : String(2);
    @sap.label : 'Relevant for POD'
    @sap.quickinfo : 'Relevant for POD processing'
    SlsDocIsRlvtForProofOfDeliv : Boolean;
    @sap.label : 'Unlimited Tolerance'
    @sap.quickinfo : 'Unlimited Overdelivery Allowed'
    SlsUnlmtdOvrdelivIsAllwd : Boolean;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Delivering Plant'
    @sap.quickinfo : 'Delivering Plant (Own or External)'
    SupplyingPlant : String(4);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Sales District'
    SalesDistrict : String(6);
    @sap.label : 'Underdel. Tolerance'
    @sap.quickinfo : 'Underdelivery Tolerance'
    UnderdelivTolrtdLmtRatioInPct : Decimal(3, 1);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Invoice List Sched.'
    @sap.quickinfo : 'Invoice List Schedule (calendar identification)'
    InvoiceListSchedule : String(2);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Exchange Rate Type'
    ExchangeRateType : String(4);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Customer Group 1'
    AdditionalCustomerGroup1 : String(3);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Customer Group 2'
    AdditionalCustomerGroup2 : String(3);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Customer Group 3'
    AdditionalCustomerGroup3 : String(3);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Customer Group 4'
    AdditionalCustomerGroup4 : String(3);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Customer Group 5'
    AdditionalCustomerGroup5 : String(3);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Paymt guarant. proc.'
    @sap.quickinfo : 'Customer payment guarantee procedure'
    PaymentGuaranteeProcedure : String(4);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Account Group'
    @sap.quickinfo : 'Customer Account Group'
    CustomerAccountGroup : String(4);
    to_PartnerFunction : Association to many A_CustSalesPartnerFunc {  };
    to_SalesAreaTax : Association to many A_CustomerSalesAreaTax {  };
    to_SalesAreaText : Association to many A_CustomerSalesAreaText {  };
    to_SlsAreaAddrDepdntInfo : Association to many A_CustSlsAreaAddrDepdntInfo {  };
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.deletable : 'false'
  @sap.content.version : '1'
  @sap.label : 'Sales Area Tax'
  entity A_CustomerSalesAreaTax {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Customer'
    @sap.quickinfo : 'Customer Number'
    key Customer : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Sales Organization'
    key SalesOrganization : String(4) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'RefDistCh-Cust/Mat.'
    @sap.quickinfo : 'Reference distrib.channel for cust.and material masters'
    key DistributionChannel : String(2) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Division'
    key Division : String(2) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Departure Ctry/Reg.'
    @sap.quickinfo : 'Departure Country/Region (from which the goods are sent)'
    key DepartureCountry : String(3) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Tax Condition Type'
    @sap.quickinfo : 'Tax Condition Type (Sales Tax, Value-Added Tax,...)'
    key CustomerTaxCategory : String(4) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Tax Classification'
    @sap.quickinfo : 'Tax Classification for Customer'
    CustomerTaxClassification : String(1);
    to_SlsAreaAddrDepdntTax : Association to many A_CustSlsAreaAddrDepdntTaxInfo {  };
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.content.version : '1'
  @sap.label : 'Customer Sales Area Text'
  entity A_CustomerSalesAreaText {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Customer'
    @sap.quickinfo : 'Customer Number'
    key Customer : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Sales Organization'
    key SalesOrganization : String(4) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Distribution Channel'
    key DistributionChannel : String(2) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Division'
    key Division : String(2) not null;
    @sap.label : 'Language'
    @sap.quickinfo : 'Language key'
    key Language : String(2) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Text ID'
    key LongTextID : String(4) not null;
    @sap.label : 'String'
    @sap.heading : ''
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.sortable : 'false'
    @sap.filterable : 'false'
    LongText : String;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'false'
  @sap.content.version : '1'
  @sap.label : 'Customer Tax Grouping'
  entity A_CustomerTaxGrouping {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Customer'
    @sap.quickinfo : 'Customer Number'
    key Customer : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Tax Category'
    @sap.quickinfo : 'Category Indicator for Tax Codes'
    key CustomerTaxGroupingCode : String(3) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Exempt. Number'
    @sap.quickinfo : 'Number of exemption certificate'
    CustTaxGrpExemptionCertificate : String(15);
    @sap.label : 'Exemption Rate'
    @sap.quickinfo : 'Exemption rate'
    CustTaxGroupExemptionRate : Decimal(5, 2);
    @sap.display.format : 'Date'
    @sap.label : 'Exempted from'
    @sap.quickinfo : 'Start date of exemption'
    CustTaxGroupExemptionStartDate : Date;
    @sap.display.format : 'Date'
    @sap.label : 'Exempted Until'
    @sap.quickinfo : 'Date on which exemption ends'
    CustTaxGroupExemptionEndDate : Date;
    @sap.display.format : 'Date'
    @sap.label : 'subjected from'
    @sap.quickinfo : 'Subjected from'
    CustTaxGroupSubjectedStartDate : Date;
    @sap.display.format : 'Date'
    @sap.label : 'subjected until'
    @sap.quickinfo : 'Subjected until'
    CustTaxGroupSubjectedEndDate : Date;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.content.version : '1'
  @sap.label : 'Customer Text'
  entity A_CustomerText {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Customer'
    @sap.quickinfo : 'Customer Number'
    key Customer : String(10) not null;
    @sap.label : 'Language'
    @sap.quickinfo : 'Language key'
    key Language : String(2) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Text ID'
    key LongTextID : String(4) not null;
    @sap.label : 'String'
    @sap.heading : ''
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.sortable : 'false'
    @sap.filterable : 'false'
    LongText : String;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.content.version : '1'
  @sap.label : 'Customer Unloading Point'
  entity A_CustomerUnloadingPoint {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Customer'
    @sap.quickinfo : 'Customer Number'
    key Customer : String(10) not null;
    @sap.label : 'Unloading Point'
    key UnloadingPointName : String(25) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Cust.fact.calendar'
    @sap.quickinfo : 'Customer''s factory calendar'
    CustomerFactoryCalenderCode : String(2);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Goods receiving hrs'
    @sap.quickinfo : 'Goods receiving hours ID (default value)'
    BPGoodsReceivingHoursCode : String(3);
    @sap.label : 'Default unloading pt'
    @sap.quickinfo : 'Default unloading point'
    IsDfltBPUnloadingPoint : Boolean;
    @sap.label : 'Monday'
    @sap.quickinfo : 'Goods receipt times: Monday morning from ...'
    MondayMorningOpeningTime : Time;
    @sap.label : 'Monday'
    @sap.quickinfo : 'Goods receiving hours: Monday morning until ...'
    MondayMorningClosingTime : Time;
    @sap.label : 'Monday'
    @sap.quickinfo : 'Goods receiving hours: Monday afternoon from ...'
    MondayAfternoonOpeningTime : Time;
    @sap.label : 'Monday'
    @sap.quickinfo : 'Goods receiving hours: Monday afternoon until ...'
    MondayAfternoonClosingTime : Time;
    @sap.label : 'Tuesday'
    @sap.quickinfo : 'Goods receiving hours: Tuesday morning from...'
    TuesdayMorningOpeningTime : Time;
    @sap.label : 'Tuesday'
    @sap.quickinfo : 'Goods receipt times: Tuesday morning until ...'
    TuesdayMorningClosingTime : Time;
    @sap.label : 'Tuesday'
    @sap.quickinfo : 'Goods receiving hours: Tuesday afternoon from ...'
    TuesdayAfternoonOpeningTime : Time;
    @sap.label : 'Tuesday'
    @sap.quickinfo : 'Goods receiving hours: Tuesday afternoon until ...'
    TuesdayAfternoonClosingTime : Time;
    @sap.label : 'Wednesday'
    @sap.quickinfo : 'Goods receiving hours: Wednesday morning from ...'
    WednesdayMorningOpeningTime : Time;
    @sap.label : 'Wednesday'
    @sap.quickinfo : 'Goods receiving hours: Wednesday morning until ...'
    WednesdayMorningClosingTime : Time;
    @sap.label : 'Wednesday'
    @sap.quickinfo : 'Goods receiving hours: Wednesday afternoon from ...'
    WednesdayAfternoonOpeningTime : Time;
    @sap.label : 'Wednesday'
    @sap.quickinfo : 'Goods receiving hours: Wednesday afternoon until ...'
    WednesdayAfternoonClosingTime : Time;
    @sap.label : 'Thursday'
    @sap.quickinfo : 'Goods receiving hours: Thursday morning from ...'
    ThursdayMorningOpeningTime : Time;
    @sap.label : 'Thursday'
    @sap.quickinfo : 'Goods receiving hours: Thursday morning until ...'
    ThursdayMorningClosingTime : Time;
    @sap.label : 'Thursday'
    @sap.quickinfo : 'Goods receiving hours: Thursday afternoon from ...'
    ThursdayAfternoonOpeningTime : Time;
    @sap.label : 'Thursday'
    @sap.quickinfo : 'Goods receiving hours: Thursday afternoon until...'
    ThursdayAfternoonClosingTime : Time;
    @sap.label : 'Friday'
    @sap.quickinfo : 'Goods receiving hours: Friday morning from ...'
    FridayMorningOpeningTime : Time;
    @sap.label : 'Friday'
    @sap.quickinfo : 'Goods receiving hours: Friday morning until ...'
    FridayMorningClosingTime : Time;
    @sap.label : 'Friday'
    @sap.quickinfo : 'Goods receiving hours: Friday afternoon from ...'
    FridayAfternoonOpeningTime : Time;
    @sap.label : 'Friday'
    @sap.quickinfo : 'Goods receiving hours: Friday afternoon until ...'
    FridayAfternoonClosingTime : Time;
    @sap.label : 'Saturday'
    @sap.quickinfo : 'Goods receiving hours: Saturday morning from ...'
    SaturdayMorningOpeningTime : Time;
    @sap.label : 'Saturday'
    @sap.quickinfo : 'Goods receiving hours: Saturday morning until ...'
    SaturdayMorningClosingTime : Time;
    @sap.label : 'Saturday'
    @sap.quickinfo : 'Goods receiving hours: Saturday afternoon from ...'
    SaturdayAfternoonOpeningTime : Time;
    @sap.label : 'Saturday'
    @sap.quickinfo : 'Goods receiving hours: Saturday afternoon until ...'
    SaturdayAfternoonClosingTime : Time;
    @sap.label : 'Sunday'
    @sap.quickinfo : 'Goods receiving hours: Sunday morning from ...'
    SundayMorningOpeningTime : Time;
    @sap.label : 'Sunday'
    @sap.quickinfo : 'Goods receiving hours: Sunday morning until ...'
    SundayMorningClosingTime : Time;
    @sap.label : 'Sunday'
    @sap.quickinfo : 'Goods receiving hours: Sunday afternoon from ...'
    SundayAfternoonOpeningTime : Time;
    @sap.label : 'Sunday'
    @sap.quickinfo : 'Goods receiving hours: Sunday afternoon until ...'
    SundayAfternoonClosingTime : Time;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.content.version : '1'
  @sap.label : 'Withholding Tax'
  entity A_CustomerWithHoldingTax {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Customer'
    @sap.quickinfo : 'Customer Number'
    key Customer : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Company Code'
    key CompanyCode : String(4) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Withholding Tax Type'
    @sap.quickinfo : 'Indicator for Withholding Tax Type'
    key WithholdingTaxType : String(2) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'W/Tax Code'
    @sap.quickinfo : 'Withholding Tax Code'
    WithholdingTaxCode : String(2);
    @sap.label : 'WTax Agent'
    @sap.quickinfo : 'Indicator: Withholding Tax Agent?'
    WithholdingTaxAgent : Boolean;
    @sap.display.format : 'Date'
    @sap.label : 'W/Tax Obligated Frm'
    @sap.quickinfo : 'Obligated to Withhold Tax From'
    ObligationDateBegin : Date;
    @sap.display.format : 'Date'
    @sap.label : 'Oblig.to W/Tax Until'
    @sap.quickinfo : 'Obligated to Withhold Tax Until'
    ObligationDateEnd : Date;
    @sap.display.format : 'UpperCase'
    @sap.label : 'W/tax number'
    @sap.quickinfo : 'Withholding tax identification number'
    WithholdingTaxNumber : String(16);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Exemption Number'
    @sap.quickinfo : 'Exemption Certificate Number'
    WithholdingTaxCertificate : String(25);
    @sap.label : 'Exemption Rate'
    WithholdingTaxExmptPercent : Decimal(5, 2);
    @sap.display.format : 'Date'
    @sap.label : 'Exemption Start Date'
    @sap.quickinfo : 'Date on Which Exemption Begins'
    ExemptionDateBegin : Date;
    @sap.display.format : 'Date'
    @sap.label : 'Exemption End Date'
    @sap.quickinfo : 'Date on Which Exemption Ends'
    ExemptionDateEnd : Date;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Exemption Reason'
    @sap.quickinfo : 'Reason for Exemption'
    ExemptionReason : String(2);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Authorization'
    @sap.quickinfo : 'Authorization Group'
    AuthorizationGroup : String(4);
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.content.version : '1'
  @sap.label : 'Sales Partner Functions'
  entity A_CustSalesPartnerFunc {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Customer'
    @sap.quickinfo : 'Customer Number'
    key Customer : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Sales Organization'
    key SalesOrganization : String(4) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Distribution Channel'
    key DistributionChannel : String(2) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Division'
    key Division : String(2) not null;
    @sap.display.format : 'NonNegative'
    @sap.label : 'Partner counter'
    key PartnerCounter : String(3) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Partner Function'
    key PartnerFunction : String(2) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Supplier'
    @sap.quickinfo : 'Account Number of Supplier'
    BPCustomerNumber : String(10);
    @sap.label : 'Partner Description'
    @sap.quickinfo : 'Cust.-Specif. Descr. of Business Partner (Plant, Stor. Loc.)'
    CustomerPartnerDescription : String(30);
    @sap.label : 'Default Partner'
    DefaultPartner : Boolean;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Supplier'
    @sap.quickinfo : 'Account Number of Supplier'
    Supplier : String(10);
    @sap.display.format : 'NonNegative'
    @sap.label : 'Personnel Number'
    PersonnelNumber : String(8);
    @sap.display.format : 'NonNegative'
    @sap.label : 'Contact Person'
    @sap.quickinfo : 'Number of Contact Person'
    ContactPerson : String(10);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Address Number'
    @sap.quickinfo : 'Business Partner Address Number (from BUT020)'
    AddressID : String(10);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Authorization'
    @sap.quickinfo : 'Authorization Group'
    AuthorizationGroup : String(4);
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.content.version : '1'
  @sap.label : 'Customer Sales Area Address Dependent Information'
  entity A_CustSlsAreaAddrDepdntInfo {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Customer'
    @sap.quickinfo : 'Customer Number'
    key Customer : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Sales Organization'
    key SalesOrganization : String(4) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Distribution Channel'
    key DistributionChannel : String(2) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Division'
    key Division : String(2) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Address Number'
    @sap.quickinfo : 'Business Partner Address Number (from BUT020)'
    key AddressID : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Incoterms'
    @sap.quickinfo : 'Incoterms (Part 1)'
    IncotermsClassification : String(3);
    @sap.label : 'Incoterms Location 1'
    IncotermsLocation1 : String(70);
    @sap.label : 'Incoterms Location 2'
    IncotermsLocation2 : String(70);
    @sap.label : 'Location UUID'
    IncotermsSupChnLoc1AddlUUID : UUID;
    @sap.label : 'Location UUID'
    IncotermsSupChnLoc2AddlUUID : UUID;
    @sap.label : 'Location UUID'
    IncotermsSupChnDvtgLocAddlUUID : UUID;
    @sap.display.format : 'UpperCase'
    @sap.label : 'DelBlckSalesAr.'
    @sap.quickinfo : 'Customer delivery block (sales area)'
    DeliveryIsBlocked : String(2);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Sales Office'
    SalesOffice : String(4);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Sales Group'
    SalesGroup : String(3);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Shipping Conditions'
    ShippingCondition : String(2);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Delivering Plant'
    @sap.quickinfo : 'Delivering Plant (Own or External)'
    SupplyingPlant : String(4);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Incoterms Version'
    IncotermsVersion : String(4);
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.content.version : '1'
  @sap.label : 'Customer Sales Area Address Dependent Tax Info'
  entity A_CustSlsAreaAddrDepdntTaxInfo {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Customer'
    @sap.quickinfo : 'Customer Number'
    key Customer : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Sales Organization'
    key SalesOrganization : String(4) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'RefDistCh-Cust/Mat.'
    @sap.quickinfo : 'Reference distrib.channel for cust.and material masters'
    key DistributionChannel : String(2) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Division'
    key Division : String(2) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Address Number'
    @sap.quickinfo : 'Business Partner Address Number (from BUT020)'
    key AddressID : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Departure Ctry/Reg.'
    @sap.quickinfo : 'Departure Country/Region (from which the goods are sent)'
    key DepartureCountry : String(3) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Tax Condition Type'
    @sap.quickinfo : 'Tax Condition Type (Sales Tax, Value-Added Tax,...)'
    key CustomerTaxCategory : String(4) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Tax Classification'
    @sap.quickinfo : 'Tax Classification for Customer'
    CustomerTaxClassification : String(1);
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.content.version : '1'
  @sap.label : 'Customer Unloading Point Address Dependent Information'
  entity A_CustUnldgPtAddrDepdntInfo {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Customer'
    @sap.quickinfo : 'Customer Number'
    key Customer : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Address Number'
    @sap.quickinfo : 'Business Partner Address Number (from BUT020)'
    key AddressID : String(10) not null;
    @sap.label : 'Unloading Point'
    key UnloadingPointName : String(25) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Cust.fact.calendar'
    @sap.quickinfo : 'Customer''s factory calendar'
    CustomerFactoryCalenderCode : String(2);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Goods receiving hrs'
    @sap.quickinfo : 'Goods receiving hours ID (default value)'
    BPGoodsReceivingHoursCode : String(3);
    @sap.label : 'Default unloading pt'
    @sap.quickinfo : 'Default unloading point'
    IsDfltBPUnloadingPoint : Boolean;
    @sap.label : 'Monday'
    @sap.quickinfo : 'Goods receipt times: Monday morning from ...'
    MondayMorningOpeningTime : Time;
    @sap.label : 'Monday'
    @sap.quickinfo : 'Goods receiving hours: Monday morning until ...'
    MondayMorningClosingTime : Time;
    @sap.label : 'Monday'
    @sap.quickinfo : 'Goods receiving hours: Monday afternoon from ...'
    MondayAfternoonOpeningTime : Time;
    @sap.label : 'Monday'
    @sap.quickinfo : 'Goods receiving hours: Monday afternoon until ...'
    MondayAfternoonClosingTime : Time;
    @sap.label : 'Tuesday'
    @sap.quickinfo : 'Goods receiving hours: Tuesday morning from...'
    TuesdayMorningOpeningTime : Time;
    @sap.label : 'Tuesday'
    @sap.quickinfo : 'Goods receipt times: Tuesday morning until ...'
    TuesdayMorningClosingTime : Time;
    @sap.label : 'Tuesday'
    @sap.quickinfo : 'Goods receiving hours: Tuesday afternoon from ...'
    TuesdayAfternoonOpeningTime : Time;
    @sap.label : 'Tuesday'
    @sap.quickinfo : 'Goods receiving hours: Tuesday afternoon until ...'
    TuesdayAfternoonClosingTime : Time;
    @sap.label : 'Wednesday'
    @sap.quickinfo : 'Goods receiving hours: Wednesday morning from ...'
    WednesdayMorningOpeningTime : Time;
    @sap.label : 'Wednesday'
    @sap.quickinfo : 'Goods receiving hours: Wednesday morning until ...'
    WednesdayMorningClosingTime : Time;
    @sap.label : 'Wednesday'
    @sap.quickinfo : 'Goods receiving hours: Wednesday afternoon from ...'
    WednesdayAfternoonOpeningTime : Time;
    @sap.label : 'Wednesday'
    @sap.quickinfo : 'Goods receiving hours: Wednesday afternoon until ...'
    WednesdayAfternoonClosingTime : Time;
    @sap.label : 'Thursday'
    @sap.quickinfo : 'Goods receiving hours: Thursday morning from ...'
    ThursdayMorningOpeningTime : Time;
    @sap.label : 'Thursday'
    @sap.quickinfo : 'Goods receiving hours: Thursday morning until ...'
    ThursdayMorningClosingTime : Time;
    @sap.label : 'Thursday'
    @sap.quickinfo : 'Goods receiving hours: Thursday afternoon from ...'
    ThursdayAfternoonOpeningTime : Time;
    @sap.label : 'Thursday'
    @sap.quickinfo : 'Goods receiving hours: Thursday afternoon until...'
    ThursdayAfternoonClosingTime : Time;
    @sap.label : 'Friday'
    @sap.quickinfo : 'Goods receiving hours: Friday morning from ...'
    FridayMorningOpeningTime : Time;
    @sap.label : 'Friday'
    @sap.quickinfo : 'Goods receiving hours: Friday morning until ...'
    FridayMorningClosingTime : Time;
    @sap.label : 'Friday'
    @sap.quickinfo : 'Goods receiving hours: Friday afternoon from ...'
    FridayAfternoonOpeningTime : Time;
    @sap.label : 'Friday'
    @sap.quickinfo : 'Goods receiving hours: Friday afternoon until ...'
    FridayAfternoonClosingTime : Time;
    @sap.label : 'Saturday'
    @sap.quickinfo : 'Goods receiving hours: Saturday morning from ...'
    SaturdayMorningOpeningTime : Time;
    @sap.label : 'Saturday'
    @sap.quickinfo : 'Goods receiving hours: Saturday morning until ...'
    SaturdayMorningClosingTime : Time;
    @sap.label : 'Saturday'
    @sap.quickinfo : 'Goods receiving hours: Saturday afternoon from ...'
    SaturdayAfternoonOpeningTime : Time;
    @sap.label : 'Saturday'
    @sap.quickinfo : 'Goods receiving hours: Saturday afternoon until ...'
    SaturdayAfternoonClosingTime : Time;
    @sap.label : 'Sunday'
    @sap.quickinfo : 'Goods receiving hours: Sunday morning from ...'
    SundayMorningOpeningTime : Time;
    @sap.label : 'Sunday'
    @sap.quickinfo : 'Goods receiving hours: Sunday morning until ...'
    SundayMorningClosingTime : Time;
    @sap.label : 'Sunday'
    @sap.quickinfo : 'Goods receiving hours: Sunday afternoon from ...'
    SundayAfternoonOpeningTime : Time;
    @sap.label : 'Sunday'
    @sap.quickinfo : 'Goods receiving hours: Sunday afternoon until ...'
    SundayAfternoonClosingTime : Time;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.creatable : 'false'
  @sap.deletable : 'false'
  @sap.content.version : '1'
  @sap.label : 'Supplier'
  entity A_Supplier {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Supplier'
    @sap.quickinfo : 'Account Number of Supplier'
    key Supplier : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Alternative Payee'
    @sap.quickinfo : 'Account Number of the Alternative Payee'
    AlternativePayeeAccountNumber : String(10);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Authorization'
    @sap.quickinfo : 'Authorization Group'
    AuthorizationGroup : String(4);
    @sap.display.format : 'UpperCase'
    @sap.label : 'PAN'
    @sap.quickinfo : 'Permanent Account Number'
    BusinessPartnerPanNumber : String(40);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Created by'
    @sap.quickinfo : 'Name of Person who Created the Object'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    CreatedByUser : String(12);
    @sap.display.format : 'Date'
    @sap.label : 'Created On'
    @sap.quickinfo : 'Record Created On'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    CreationDate : Date;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Customer'
    @sap.quickinfo : 'Customer Number'
    Customer : String(10);
    @sap.label : 'Payment block'
    @sap.quickinfo : 'Payment Block'
    PaymentIsBlockedForSupplier : Boolean;
    @sap.label : 'Posting Block'
    @sap.quickinfo : 'Central Posting Block'
    PostingIsBlocked : Boolean;
    @sap.label : 'Purch. block'
    @sap.quickinfo : 'Centrally imposed purchasing block'
    PurchasingIsBlocked : Boolean;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Account Group'
    @sap.quickinfo : 'Supplier Account Group'
    SupplierAccountGroup : String(4);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Supplier Name'
    @sap.quickinfo : 'Supplier Full Name'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    SupplierFullName : String(220);
    @sap.label : 'Name of Supplier'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    SupplierName : String(80);
    @sap.display.format : 'UpperCase'
    @sap.label : 'VAT Registration No.'
    @sap.quickinfo : 'VAT Registration Number'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    VATRegistration : String(20);
    @sap.display.format : 'Date'
    @sap.label : 'Date of Birth'
    @sap.quickinfo : 'Date of Birth of the Person Subject to Withholding Tax'
    BirthDate : Date;
    @sap.label : 'Int. Location No.'
    @sap.quickinfo : 'Cocatenated International Location Number'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    ConcatenatedInternationalLocNo : String(20);
    @sap.label : 'Deletion Flag'
    @sap.quickinfo : 'Central Deletion Flag for Master Record'
    DeletionIndicator : Boolean;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Fiscal address'
    @sap.quickinfo : 'Account number of the master record with fiscal address'
    FiscalAddress : String(10);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Industry'
    @sap.quickinfo : 'Industry Key'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    Industry : String(4);
    @sap.display.format : 'NonNegative'
    @sap.label : 'Int. location no. 1'
    @sap.quickinfo : 'International location number (part 1)'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    InternationalLocationNumber1 : String(7);
    @sap.display.format : 'NonNegative'
    @sap.label : 'Int. location no. 2'
    @sap.quickinfo : 'International location number (Part 2)'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    InternationalLocationNumber2 : String(5);
    @sap.display.format : 'NonNegative'
    @sap.label : 'Check digit'
    @sap.quickinfo : 'Check digit for the international location number'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    InternationalLocationNumber3 : String(1);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Natural Person'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    IsNaturalPerson : String(1);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Payment Reason'
    PaymentReason : String(4);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Tax Type'
    ResponsibleType : String(2);
    @sap.display.format : 'Date'
    @sap.label : 'QM System Valid To'
    @sap.quickinfo : 'Validity Date of Certification'
    SuplrQltyInProcmtCertfnValidTo : Date;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Actual QM System'
    @sap.quickinfo : 'Actual QM System of Supplier'
    SuplrQualityManagementSystem : String(4);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Group Key'
    SupplierCorporateGroup : String(10);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Block Function'
    @sap.quickinfo : 'Function That Will Be Blocked'
    SupplierProcurementBlock : String(2);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Tax Number 1'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    TaxNumber1 : String(16);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Tax Number 2'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    TaxNumber2 : String(11);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Tax Number 3'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    TaxNumber3 : String(18);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Tax Number 4'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    TaxNumber4 : String(18);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Tax Number 5'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    TaxNumber5 : String(60);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Tax Number'
    @sap.quickinfo : 'Tax Number at Responsible Tax Authority'
    TaxNumberResponsible : String(18);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Tax Number Type'
    TaxNumberType : String(2);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Relevant for POD'
    @sap.quickinfo : 'Supplier indicator relevant for proof of delivery'
    SuplrProofOfDelivRlvtCode : String(1);
    @sap.label : 'Tax split'
    @sap.quickinfo : 'Tax Split'
    BR_TaxIsSplit : Boolean;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Instruction Key'
    @sap.quickinfo : 'Instruction Key for Data Medium Exchange'
    DataExchangeInstructionKey : String(2);
    to_SupplierCompany : Association to many A_SupplierCompany {  };
    to_SupplierPurchasingOrg : Association to many A_SupplierPurchasingOrg {  };
    to_SupplierText : Association to many A_SupplierText {  };
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.deletable : 'false'
  @sap.content.version : '1'
  @sap.label : 'Supplier Company'
  entity A_SupplierCompany {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Supplier'
    @sap.quickinfo : 'Account Number of Supplier'
    key Supplier : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Company Code'
    key CompanyCode : String(4) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Authorization'
    @sap.quickinfo : 'Authorization Group'
    AuthorizationGroup : String(4);
    @sap.label : 'Company Name'
    @sap.quickinfo : 'Name of Company Code or Company'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    CompanyCodeName : String(25);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Payment Block'
    @sap.quickinfo : 'Block Key for Payment'
    PaymentBlockingReason : String(1);
    @sap.label : 'Co.code post.block'
    @sap.quickinfo : 'Posting block for company code'
    SupplierIsBlockedForPosting : Boolean;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Clerk Abbrev.'
    @sap.quickinfo : 'Accounting Clerk Abbreviation'
    AccountingClerk : String(2);
    @sap.label : 'Acctg clerk''s fax'
    @sap.quickinfo : 'Accounting clerk''s fax number at the customer/vendor'
    AccountingClerkFaxNumber : String(31);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Acct.clerks tel.no.'
    @sap.quickinfo : 'Accounting clerk''s telephone number at business partner'
    AccountingClerkPhoneNumber : String(30);
    @sap.label : 'Clerk at vendor'
    SupplierClerk : String(15);
    @sap.label : 'Clrk''s internet add.'
    @sap.quickinfo : 'Internet address of partner company clerk'
    SupplierClerkURL : String(130);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Payment Methods'
    @sap.quickinfo : 'List of Respected Payment Methods'
    PaymentMethodsList : String(10);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Payment Reason'
    PaymentReason : String(4);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Terms of Payment'
    @sap.quickinfo : 'Key for Terms of Payment'
    PaymentTerms : String(4);
    @sap.label : 'Clearing w/ Customer'
    @sap.quickinfo : 'Indicator: Clearing Between Customer and Supplier?'
    ClearCustomerSupplier : Boolean;
    @sap.label : 'Local Processing'
    @sap.quickinfo : 'Indicator: Local Processing?'
    IsToBeLocallyProcessed : Boolean;
    @sap.label : 'Individual Payment'
    @sap.quickinfo : 'Indicator: Pay All Items Separately?'
    ItemIsToBePaidSeparately : Boolean;
    @sap.label : 'Pmnt advice by EDI'
    @sap.quickinfo : 'Indicator: Send Payment Advices by EDI'
    PaymentIsToBeSentByEDI : Boolean;
    @sap.display.format : 'UpperCase'
    @sap.label : 'House Bank'
    @sap.quickinfo : 'Short Key for a House Bank'
    HouseBank : String(5);
    @sap.label : 'Check Cashing Time'
    @sap.quickinfo : 'Probable Time Until Check Is Paid'
    CheckPaidDurationInDays : Decimal(3, 0);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Currency'
    @sap.quickinfo : 'Currency Key'
    @sap.semantics : 'currency-code'
    Currency : String(5);
    @sap.unit : 'Currency'
    @sap.label : 'Bill/Ex. Limit'
    @sap.quickinfo : 'Bill of Exchange Limit (in Local Currency)'
    BillOfExchLmtAmtInCoCodeCrcy : Decimal(14, 3);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Account with vendor'
    @sap.quickinfo : 'Our account number with the vendor'
    SupplierClerkIDBySupplier : String(12);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Reconciliation Acct'
    @sap.quickinfo : 'Reconciliation Account in General Ledger'
    ReconciliationAccount : String(10);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Interest Indicator'
    InterestCalculationCode : String(2);
    @sap.display.format : 'Date'
    @sap.label : 'Last Key Date'
    @sap.quickinfo : 'Key Date of Last Interest Calculation'
    InterestCalculationDate : Date;
    @sap.display.format : 'NonNegative'
    @sap.label : 'Int.Calc.Freq.'
    @sap.quickinfo : 'Interest Calculation Frequency in Months'
    IntrstCalcFrequencyInMonths : String(2);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Head Office'
    @sap.quickinfo : 'Head Office Account Number'
    SupplierHeadOffice : String(10);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Alternative payee'
    @sap.quickinfo : 'Account number of the alternative payee'
    AlternativePayee : String(10);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Sort key'
    @sap.quickinfo : 'Key for sorting according to assignment numbers'
    LayoutSortingRule : String(3);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Tolerance Group'
    @sap.quickinfo : 'Tolerance Group for Business Partner/G/L Account'
    APARToleranceGroup : String(4);
    @sap.display.format : 'Date'
    @sap.label : 'Certification Date'
    SupplierCertificationDate : Date;
    @sap.label : 'Account Memo'
    @sap.quickinfo : 'Memo'
    SupplierAccountNote : String(30);
    @sap.display.format : 'UpperCase'
    @sap.label : 'WTax C/R Key'
    @sap.quickinfo : 'Withholding Tax Country/Region Key'
    WithholdingTaxCountry : String(3);
    @sap.label : 'Co.Cde Deletion Flag'
    @sap.quickinfo : 'Deletion Flag for Master Record (Company Code Level)'
    DeletionIndicator : Boolean;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Planning Group'
    CashPlanningGroup : String(10);
    @sap.label : 'Check Double Invoice'
    @sap.quickinfo : 'Check Flag for Double Invoices or Credit Memos'
    IsToBeCheckedForDuplicates : Boolean;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Minority Indicator'
    MinorityGroup : String(3);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Account Group'
    @sap.quickinfo : 'Supplier Account Group'
    SupplierAccountGroup : String(4);
    to_CompanyText : Association to many A_SupplierCompanyText {  };
    to_Supplier : Association to A_Supplier {  };
    to_SupplierDunning : Association to many A_SupplierDunning {  };
    to_SupplierWithHoldingTax : Association to many A_SupplierWithHoldingTax {  };
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.content.version : '1'
  @sap.label : 'Supplier Company Text'
  entity A_SupplierCompanyText {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Supplier'
    @sap.quickinfo : 'Account Number of Supplier'
    key Supplier : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Company Code'
    key CompanyCode : String(4) not null;
    @sap.label : 'Language'
    @sap.quickinfo : 'Language key'
    key Language : String(2) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Text ID'
    key LongTextID : String(4) not null;
    @sap.label : 'String'
    @sap.heading : ''
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.sortable : 'false'
    @sap.filterable : 'false'
    LongText : String;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.content.version : '1'
  @sap.label : 'Supplier Dunning'
  entity A_SupplierDunning {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Supplier'
    @sap.quickinfo : 'Account Number of Supplier'
    key Supplier : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Company Code'
    key CompanyCode : String(4) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Dunning Area'
    key DunningArea : String(2) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Dunning Block'
    DunningBlock : String(1);
    @sap.display.format : 'NonNegative'
    @sap.label : 'Dunning Level'
    DunningLevel : String(1);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Dunning Procedure'
    DunningProcedure : String(4);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Dunn.recipient'
    @sap.quickinfo : 'Account number of the dunning recipient'
    DunningRecipient : String(10);
    @sap.display.format : 'Date'
    @sap.label : 'Last Dunned'
    @sap.quickinfo : 'Date of Last Dunning Notice'
    LastDunnedOn : Date;
    @sap.display.format : 'Date'
    @sap.label : 'Legal Dunn.Proc.From'
    @sap.quickinfo : 'Date of the Legal Dunning Proceedings'
    LegDunningProcedureOn : Date;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Dunning Clerk'
    DunningClerk : String(2);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Authorization'
    @sap.quickinfo : 'Authorization Group'
    AuthorizationGroup : String(4);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Account Group'
    @sap.quickinfo : 'Supplier Account Group'
    SupplierAccountGroup : String(4);
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.content.version : '1'
  @sap.label : 'Purchasing Partner Functions'
  entity A_SupplierPartnerFunc {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Supplier'
    @sap.quickinfo : 'Account Number of Supplier'
    key Supplier : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Purch. Organization'
    @sap.quickinfo : 'Purchasing Organization'
    key PurchasingOrganization : String(4) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Supplier Subrange'
    key SupplierSubrange : String(6) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Plant'
    key Plant : String(4) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Partner Function'
    key PartnerFunction : String(2) not null;
    @sap.display.format : 'NonNegative'
    @sap.label : 'Partner counter'
    key PartnerCounter : String(3) not null;
    @sap.label : 'Default Partner'
    DefaultPartner : Boolean;
    @sap.display.format : 'Date'
    @sap.label : 'Created On'
    @sap.quickinfo : 'Record Creation Date'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    CreationDate : Date;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Created By'
    @sap.quickinfo : 'Name of Person Responsible for Creating the Object'
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    CreatedByUser : String(12);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Ref. to suplr'
    @sap.quickinfo : 'Reference to other supplier'
    ReferenceSupplier : String(10);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Authorization'
    @sap.quickinfo : 'Authorization Group'
    AuthorizationGroup : String(4);
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.deletable : 'false'
  @sap.content.version : '1'
  @sap.label : 'Purchasing Organization'
  entity A_SupplierPurchasingOrg {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Supplier'
    @sap.quickinfo : 'Supplier''s Account Number'
    key Supplier : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Purch. Organization'
    @sap.quickinfo : 'Purchasing Organization'
    key PurchasingOrganization : String(4) not null;
    @sap.label : 'Aut. ev. GRSetmt.Ret'
    @sap.quickinfo : 'Automatic evaluated receipt settlement for return items'
    AutomaticEvaluatedRcptSettlmt : Boolean;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Schema Grp, Supplier'
    @sap.quickinfo : 'Group for Calculation Schema (Supplier)'
    CalculationSchemaGroupCode : String(2);
    @sap.label : 'Del. flag POrg.'
    @sap.quickinfo : 'Deletion Indicator for Supplier at Purchasing Level'
    DeletionIndicator : Boolean;
    @sap.label : 'Eval. Receipt Sett.'
    @sap.quickinfo : 'Evaluated Receipt Settlement (ERS)'
    EvaldReceiptSettlementIsActive : Boolean;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Incoterms'
    @sap.quickinfo : 'Incoterms (Part 1)'
    IncotermsClassification : String(3);
    @sap.label : 'Incoterms (Part 2)'
    IncotermsTransferLocation : String(28);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Incoterms Version'
    IncotermsVersion : String(4);
    @sap.label : 'Incoterms Location 1'
    IncotermsLocation1 : String(70);
    @sap.label : 'Incoterms Location 2'
    IncotermsLocation2 : String(70);
    @sap.label : 'Location UUID'
    IncotermsSupChnLoc1AddlUUID : UUID;
    @sap.label : 'Location UUID'
    IncotermsSupChnLoc2AddlUUID : UUID;
    @sap.label : 'Location UUID'
    IncotermsSupChnDvtgLocAddlUUID : UUID;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Mode of Transport'
    @sap.quickinfo : 'Mode of Transport at the Border (Intrastat)'
    IntrastatCrsBorderTrMode : String(1);
    @sap.label : 'GR-Based Inv. Verif.'
    @sap.quickinfo : 'Indicator: GR-Based Invoice Verification'
    InvoiceIsGoodsReceiptBased : Boolean;
    @sap.label : 'Srv.-Based Inv. Ver.'
    @sap.quickinfo : 'Indicator for Service-Based Invoice Verification'
    InvoiceIsMMServiceEntryBased : Boolean;
    @sap.label : 'Planned Deliv. Time'
    @sap.quickinfo : 'Planned Delivery Time in Days'
    MaterialPlannedDeliveryDurn : Decimal(3, 0);
    @sap.unit : 'PurchaseOrderCurrency'
    @sap.label : 'Minimum order value'
    MinimumOrderAmount : Decimal(14, 3);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Terms of Payment'
    @sap.quickinfo : 'Key for Terms of Payment'
    PaymentTerms : String(4);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Planning Cycle'
    PlanningCycle : String(3);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Pricing Date Control'
    @sap.quickinfo : 'Price Determination (Pricing) Date Control'
    PricingDateControl : String(1);
    @sap.display.format : 'UpperCase'
    @sap.label : 'PROACT control prof.'
    @sap.quickinfo : 'Profile for transferring material data via IDoc PROACT'
    ProdStockAndSlsDataTransfPrfl : String(4);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Unit of Measure Grp'
    @sap.quickinfo : 'Unit of Measure Group'
    ProductUnitGroup : String(4);
    @sap.label : 'Automatic PO'
    @sap.quickinfo : 'Automatic Generation of Purchase Order Allowed'
    PurOrdAutoGenerationIsAllowed : Boolean;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Order currency'
    @sap.quickinfo : 'Purchase order currency'
    @sap.semantics : 'currency-code'
    PurchaseOrderCurrency : String(5);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Purchasing Group'
    PurchasingGroup : String(3);
    @sap.label : 'Pur. block POrg'
    @sap.quickinfo : 'Purchasing block at purchasing organization level'
    PurchasingIsBlockedForSupplier : Boolean;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Rounding Profile'
    RoundingProfile : String(4);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Shipping Conditions'
    ShippingCondition : String(2);
    @sap.label : 'Checkbox'
    @sap.heading : ''
    SuplrDiscountInKindIsGranted : Boolean;
    @sap.label : 'Revaluation'
    @sap.quickinfo : 'Revaluation allowed'
    SuplrInvcRevalIsAllowed : Boolean;
    @sap.label : 'Settlement Mgmt.'
    @sap.quickinfo : 'Indicator: Relevant for Settlement Management'
    SuplrIsRlvtForSettlmtMgmt : Boolean;
    @sap.label : 'Price determination'
    @sap.quickinfo : 'Indicator: &quot;relev. to price determination (vend. hierarchy)'
    SuplrPurgOrgIsRlvtForPriceDetn : Boolean;
    @sap.display.format : 'UpperCase'
    @sap.label : 'ABC indicator'
    SupplierABCClassificationCode : String(1);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Acc. with supplier'
    @sap.quickinfo : 'Our account number with the supplier'
    SupplierAccountNumber : String(12);
    @sap.label : 'Returns supplier'
    @sap.quickinfo : 'Indicates whether supplier is returns supplier'
    SupplierIsReturnsSupplier : Boolean;
    @sap.label : 'Telephone'
    @sap.quickinfo : 'Supplier''s Telephone Number'
    SupplierPhoneNumber : String(16);
    @sap.label : 'Salesperson'
    @sap.quickinfo : 'Responsible Salesperson at Supplier''s Office'
    SupplierRespSalesPersonName : String(30);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Confirmation Control'
    @sap.quickinfo : 'Confirmation Control Key'
    SupplierConfirmationControlKey : String(4);
    @sap.label : 'Acknowledgment Reqd.'
    @sap.quickinfo : 'Order Acknowledgment Requirement'
    IsOrderAcknRqd : Boolean;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Authorization'
    @sap.quickinfo : 'Authorization Group'
    AuthorizationGroup : String(4);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Account Group'
    @sap.quickinfo : 'Supplier Account Group'
    SupplierAccountGroup : String(4);
    to_PartnerFunction : Association to many A_SupplierPartnerFunc {  };
    to_PurchasingOrgText : Association to many A_SupplierPurchasingOrgText {  };
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.content.version : '1'
  @sap.label : 'Purchasing Organization Text'
  entity A_SupplierPurchasingOrgText {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Supplier'
    @sap.quickinfo : 'Account Number of Supplier'
    key Supplier : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Purch. Organization'
    @sap.quickinfo : 'Purchasing Organization'
    key PurchasingOrganization : String(4) not null;
    @sap.label : 'Language'
    @sap.quickinfo : 'Language key'
    key Language : String(2) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Text ID'
    key LongTextID : String(4) not null;
    @sap.label : 'String'
    @sap.heading : ''
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.sortable : 'false'
    @sap.filterable : 'false'
    LongText : String;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.content.version : '1'
  @sap.label : 'Supplier Text'
  entity A_SupplierText {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Supplier'
    @sap.quickinfo : 'Account Number of Supplier'
    key Supplier : String(10) not null;
    @sap.label : 'Language'
    @sap.quickinfo : 'Language key'
    key Language : String(2) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Text ID'
    key LongTextID : String(4) not null;
    @sap.label : 'String'
    @sap.heading : ''
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    @sap.sortable : 'false'
    @sap.filterable : 'false'
    LongText : String;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @sap.content.version : '1'
  @sap.label : 'Company Withholding Tax'
  entity A_SupplierWithHoldingTax {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Supplier'
    @sap.quickinfo : 'Account Number of Supplier'
    key Supplier : String(10) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Company Code'
    key CompanyCode : String(4) not null;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Withholding Tax Type'
    @sap.quickinfo : 'Indicator for Withholding Tax Type'
    key WithholdingTaxType : String(2) not null;
    @sap.display.format : 'Date'
    @sap.label : 'Exemption Start Date'
    @sap.quickinfo : 'Date on Which Exemption Begins'
    ExemptionDateBegin : Date;
    @sap.display.format : 'Date'
    @sap.label : 'Exemption End Date'
    @sap.quickinfo : 'Date on Which Exemption Ends'
    ExemptionDateEnd : Date;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Exemption Reason'
    @sap.quickinfo : 'Reason for Exemption'
    ExemptionReason : String(2);
    @sap.label : 'Subject to W/Tx'
    @sap.quickinfo : 'Indicator: Subject to Withholding Tax?'
    IsWithholdingTaxSubject : Boolean;
    @sap.display.format : 'UpperCase'
    @sap.label : 'Recipient Type'
    @sap.quickinfo : 'Type of Recipient'
    RecipientType : String(2);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Exemption Number'
    @sap.quickinfo : 'Exemption Certificate Number'
    WithholdingTaxCertificate : String(25);
    @sap.display.format : 'UpperCase'
    @sap.label : 'W/Tax Code'
    @sap.quickinfo : 'Withholding Tax Code'
    WithholdingTaxCode : String(2);
    @sap.label : 'Exemption Rate'
    WithholdingTaxExmptPercent : Decimal(5, 2);
    @sap.display.format : 'UpperCase'
    @sap.label : 'W/tax number'
    @sap.quickinfo : 'Withholding tax identification number'
    WithholdingTaxNumber : String(16);
    @sap.display.format : 'UpperCase'
    @sap.label : 'Authorization'
    @sap.quickinfo : 'Authorization Group'
    AuthorizationGroup : String(4);
  };
};

