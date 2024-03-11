/* checksum : 1797283d013fbd970962f9e6abf890d8 */
@cds.external : true
@cds.persistence.skip : true
@open : true
entity b1_sbs_v2.PurchaseOrders {
  key DocEntry : Integer not null;
  DocNum : Integer;
  @Validation.AllowedValues : [
    {
      $Type: 'Validation.AllowedValue',
      @Core.SymbolicName: 'dDocument_Items',
      Value: 0
    },
    {
      $Type: 'Validation.AllowedValue',
      @Core.SymbolicName: 'dDocument_Service',
      Value: 1
    }
  ]
  DocType : b1_sbs_v2.BoDocumentTypes;
  @odata.Precision : 0
  @odata.Type : 'Edm.DateTimeOffset'
  DocDueDate : DateTime;
  CardCode : LargeString;
  Comments : LargeString;
  @odata.Precision : 0
  @odata.Type : 'Edm.DateTimeOffset'
  DocDate : DateTime;
  @odata.Precision : 0
  @odata.Type : 'Edm.DateTimeOffset'
  CreationDate : DateTime;
  CardName : LargeString;
  DocTotal : Double;
  DocCurrency : LargeString;
};

@cds.external : true
@Validation.AllowedValues : [
  {
    $Type: 'Validation.AllowedValue',
    @Core.SymbolicName: 'dDocument_Items',
    Value: 0
  },
  {
    $Type: 'Validation.AllowedValue',
    @Core.SymbolicName: 'dDocument_Service',
    Value: 1
  }
]
type b1_sbs_v2.BoDocumentTypes : Integer;

@cds.external : true
service b1_sbs_v2 {};

