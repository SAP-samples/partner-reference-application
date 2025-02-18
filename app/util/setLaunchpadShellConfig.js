'use strict';
window['sap-ushell-config'] = {
  defaultRenderer: 'fiori2',
  services: {
    NavTargetResolution: {
      config: {
        enableClientSideTargetResolution: true
      }
    },
    ClientSideTargetResolution: {
      adapter: {
        config: {
          inbounds: {
            poetryslamsdisplay: {
              semanticObject: 'poetryslams',
              action: 'display',
              signature: {
                parameters: {},
                additionalParameters: 'ignored'
              },
              resolutionResult: {
                additionalInformation: 'SAPUI5.Component=poetryslams',
                applicationType: 'SAPUI5',
                url: '/poetryslams/webapp'
              }
            },
            visitorsdisplay: {
              semanticObject: 'visitors',
              action: 'display',
              signature: {
                parameters: {},
                additionalParameters: 'allowed'
              },
              resolutionResult: {
                additionalInformation: 'SAPUI5.Component=visitors',
                applicationType: 'SAPUI5',
                url: '/visitors/webapp'
              }
            }
          }
        }
      }
    },
    LaunchPage: {
      adapter: {
        config: {
          groups: [
            {
              id: 'PoetrySlamManager',
              title: 'Poetry Slam Manager',
              isPreset: true,
              isVisible: true,
              isGroupLocked: false,
              tiles: [
                {
                  id: 'PoetrySlamsDisplay',
                  tileType: 'sap.ushell.ui.tile.DynamicTile',
                  properties: {
                    title: 'Manage Poetry Slams',
                    targetURL: '#poetryslams-display'
                  }
                },
                {
                  id: 'VisitorsDisplay',
                  tileType: 'sap.ushell.ui.tile.DynamicTile',
                  properties: {
                    title: 'Manage Visitors',
                    targetURL: '#visitors-display'
                  }
                }
              ]
            }
          ]
        }
      }
    }
  }
};
