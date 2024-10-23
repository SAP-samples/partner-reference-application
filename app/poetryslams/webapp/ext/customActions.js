sap.ui.define(['sap/ui/core/library'], function () {
  'use strict';
  return {
    /**
     * @param oContext the binding context of the current entity
     * @param aSelectedContexts contains an array of binding contexts corresponding to selected items in case of table actions
     */
    navigateVisitorList: function () {
      let linkVisitor = window.location.href.replace('poetryslams', 'visitors');

      // Locally the path to the app is different to the path in workzone or multi tenancy deployment
      const path = linkVisitor.includes('&/PoetrySlams')
        ? '&/PoetrySlams'
        : '/PoetrySlams';
      window.location.href = linkVisitor.split(path)[0];
    },
    navigateVisitorObject: function (oBindingContext) {
      const visitorID = oBindingContext.getObject().visitor.ID;
      // Encode URI component
      const encodedVisitorID = encodeURIComponent(visitorID.toString());
      try {
        let url = new URL(encodeURI(window.location.href));
        // Validate the URL components
        const validProtocols = ['http:', 'https:'];
        if (!validProtocols.includes(url.protocol)) {
          throw new Error('Invalid protocol');
        }

        // Ensure the URL matches a safe pattern
        const urlPattern =
          /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w\-@:%(),+.~#?&/=]*)?$/;
        if (!urlPattern.test(url.href)) {
          throw new Error('URL does not match safe pattern');
        }

        let currentPath = url.pathname;
        let currentHash = url.hash;
        if (
          !currentPath.includes('poetryslams') ||
          !currentHash.includes('PoetrySlams')
        ) {
          throw new Error('URL path and/or hash does not match safe pattern');
        }
        url.pathname = url.pathname.replace('poetryslams', 'visitors');
        url.hash =
          url.hash.split('PoetrySlams')[0] + `Visitors(${encodedVisitorID})`;

        window.location.href = url.href;
      } catch (error) {
        console.error('Invalid URL:', error.message);
        return null;
      }
    }
  };
});
