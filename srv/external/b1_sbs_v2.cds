/* checksum : 93870c2240156ce09e2d1b7fab6525f7 */
@cds.external : true
service b1_sbs_v2 {
  @cds.external : true
  @cds.persistence.skip : true
  @open : true
  entity PurchaseOrders {
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
    DocType : BoDocumentTypes;
    @odata.Precision : 0
    @odata.Type : 'Edm.DateTimeOffset'
    DocDueDate : DateTime;
    CardCode : String;
    Comments : String;
    @odata.Precision : 0
    @odata.Type : 'Edm.DateTimeOffset'
    DocDate : DateTime;
    @odata.Precision : 0
    @odata.Type : 'Edm.DateTimeOffset'
    CreationDate : DateTime;
    CardName : String;
    DocTotal : Double;
    DocCurrency : String;
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
  type BoDocumentTypes : Integer;
};

