'use strict';

function filterLog(log) {
  // Filter the audit log entries
  const auditLogs = log.output
    .split(/^\[/m)
    .filter((log) => log.startsWith('audit-log'));
  // Extract the type and details
  const auditLogsInfo = auditLogs.map((log) =>
    log.replaceAll(/\s/g, '').match(/-(\w+):.*attributes:\[(.*)\]/)
  );
  // Keep the type and extract the affected attributes
  const auditLogsTypeAndAttributes = auditLogsInfo.map((info) => {
    return {
      type: info[1],
      attributes: [...info[2].matchAll(/name:'(\w+)'/g)].map((attr) => attr[1])
    };
  });

  return auditLogsTypeAndAttributes;
}

module.exports = { filterLog };
