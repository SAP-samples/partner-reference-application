sap.ui.define([], function () {
  'use strict';
  return {
    /**
     * @param oContext the binding context of the current entity
     * @param aSelectedContexts contains an array of binding contexts corresponding to selected items in case of table actions
     */
    navigateVisitorList: function () {
      let linkVisitor = window.location.href
        .replace('/poetryslams/', '/visitors/')
        .replace('poetryslams-', 'visitors-');

      // Locally the path to the app is different to the path in workzone or multi tenancy deployment
      const path = linkVisitor.includes('&/PoetrySlams')
        ? '&/PoetrySlams'
        : '/PoetrySlams';
      window.location.href = encodeURI(linkVisitor.split(path)[0]);
    },
    navigateVisitorObject: function (oBindingContext) {
      const visitorID = oBindingContext.getObject().visitor.ID;
      let linkVisitor = window.location.href
        .replace('/poetryslams/', '/visitors/')
        .replace('poetryslams-', 'visitors-');
      linkVisitor =
        linkVisitor.split('PoetrySlams')[0] + 'Visitors(' + visitorID + ')';

      window.location.href = encodeURI(linkVisitor);
    },
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