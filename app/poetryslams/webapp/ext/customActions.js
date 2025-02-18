sap.ui.define([], function () {
  'use strict';
  return {
    createGuestList: function (oBindingContext) {
      const poetrySlamID = oBindingContext.getObject().ID;
      const oModel = this._controller.getView().getModel();
      // Redirect to guest list creation endpoint
      sap.m.URLHelper.redirect(
        oModel.sServiceUrl + `PDFDocument(${poetrySlamID})/content`,
        true
      );
    }
  };
});
